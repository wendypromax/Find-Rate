import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import XLSX from 'xlsx';
import { parse } from 'csv-parse';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

console.log('🚀 Módulo de Carga Masiva - VERSIÓN FINAL FUNCIONAL');

// ============================================
// MIDDLEWARE SIMPLIFICADO - SIN CONSULTAS A BD
// ============================================
const obtenerUsuarioReal = (req, res, next) => {
  console.log('🔐 Obteniendo usuario real para carga masiva...');
  
  try {
    // OPCIÓN 1: Si ya tienes usuario en req.user
    if (req.user && req.user.id_usuario) {
      console.log('👤 Usuario ya autenticado en req.user:', req.user);
      next();
      return;
    }
    
    // OPCIÓN 2: Obtener de headers (MÉTODO SIMPLIFICADO)
    const userIdHeader = req.headers['x-user-id'];
    const userEmailHeader = req.headers['x-user-email'];
    
    console.log('📋 Headers recibidos:', {
      'x-user-id': userIdHeader,
      'x-user-email': userEmailHeader
    });
    
    if (userIdHeader && !isNaN(parseInt(userIdHeader))) {
      console.log(`📥 ID de usuario desde header: ${userIdHeader}`);
      
      // Crear usuario directamente desde headers SIN consultar BD
      req.user = {
        id_usuario: parseInt(userIdHeader),
        id: parseInt(userIdHeader),
        email: userEmailHeader || 'sin-email@empresa.com',
        rol: 'empresario',
        nombre: 'Usuario Empresario'
      };
      
      console.log('✅ Usuario creado desde headers:', req.user);
    } else {
      // Sin usuario válido
      console.error('❌ NO SE PUDO OBTENER USUARIO VÁLIDO');
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado. Por favor inicia sesión.',
        requiredHeaders: ['X-User-Id: <id_usuario>', 'X-User-Email: <correo>']
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Error en middleware obtenerUsuarioReal:', error);
    return res.status(500).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

// Aplicar middleware a TODAS las rutas de carga masiva
router.use(obtenerUsuarioReal);

// ============================================
// CONFIGURACIÓN MULTER
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/cargas-masivas');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const nombreSeguro = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
    
    const userInfo = req.user ? `user-${req.user.id_usuario}` : 'unknown';
    cb(null, `carga-${userInfo}-${timestamp}-${random}-${nombreSeguro}`);
  }
});

const fileFilter = (req, file, cb) => {
  const extensionesPermitidas = ['.csv', '.xlsx', '.xls'];
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (extensionesPermitidas.includes(extension)) {
    console.log(`✅ Archivo aceptado: ${file.originalname} (Usuario ID: ${req.user?.id_usuario || 'sin-usuario'})`);
    cb(null, true);
  } else {
    console.log(`❌ Archivo rechazado: ${file.originalname}`);
    cb(new Error('Solo se permiten archivos CSV o Excel (.csv, .xlsx, .xls)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  }
});

// ============================================
// RUTA PRINCIPAL DE CARGA MASIVA - FUNCIONAL
// ============================================
router.post('/lugares/carga-masiva', upload.single('archivo'), async (req, res) => {
  console.log('🔄 ===== INICIANDO CARGA MASIVA =====');
  console.log('👤 Usuario que hace la carga:', req.user);
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No se seleccionó ningún archivo',
      usuario: req.user
    });
  }

  console.log(`📊 Procesando: ${req.file.originalname}`);
  console.log(`👤 Usuario ID: ${req.user.id_usuario}`);
  
  const connection = await pool.getConnection();
  const extension = path.extname(req.file.originalname).toLowerCase();
  
  try {
    await connection.beginTransaction();
    
    let datos = [];
    let totalFilas = 0;
    const lugaresInsertados = [];
    const errores = [];
    
    // LEER ARCHIVO
    if (extension === '.csv') {
      console.log('📖 Leyendo archivo CSV...');
      datos = await new Promise((resolve, reject) => {
        const resultados = [];
        fs.createReadStream(req.file.path)
          .pipe(parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
            delimiter: ','
          }))
          .on('data', (row) => {
            resultados.push(row);
          })
          .on('end', () => {
            console.log(`✅ ${resultados.length} filas leídas del CSV`);
            resolve(resultados);
          })
          .on('error', reject);
      });
    } 
    else if (extension === '.xlsx' || extension === '.xls') {
      console.log('📖 Leyendo archivo Excel...');
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      datos = XLSX.utils.sheet_to_json(worksheet);
      console.log(`✅ ${datos.length} filas leídas del Excel`);
    }
    
    totalFilas = datos.length;
    console.log(`📊 Total filas a procesar: ${totalFilas}`);
    
    if (totalFilas === 0) {
      throw new Error('El archivo está vacío o no contiene datos válidos');
    }
    
    // VALIDAR Y PROCESAR CADA FILA
    console.log('🔄 Procesando filas...');
    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i];
      const numeroFila = i + 1;
      
      try {
        // Validar campos requeridos
        if (!fila.nit || String(fila.nit).trim() === '') {
          throw new Error('Falta NIT');
        }
        
        if (!fila.nombre || String(fila.nombre).trim() === '') {
          throw new Error('Falta nombre');
        }
        
        if (!fila.localidad || String(fila.localidad).trim() === '') {
          throw new Error('Falta localidad');
        }
        
        if (!fila.direccion || String(fila.direccion).trim() === '') {
          throw new Error('Falta dirección');
        }
        
        // Validar que el NIT sea un número válido
        const nit = parseInt(fila.nit);
        if (isNaN(nit) || nit <= 0) {
          throw new Error(`NIT inválido: ${fila.nit}. Debe ser un número positivo.`);
        }
        
        // VERIFICAR SI EL NIT YA EXISTE EN LA BASE DE DATOS
        const [lugaresExistentes] = await connection.query(
          'SELECT id_lugar, nombre_lugar FROM lugar WHERE nit_lugar = ?',
          [nit]
        );
        
        if (lugaresExistentes.length > 0) {
          throw new Error(`NIT ${nit} ya existe en el sistema`);
        }
        
        // PREPARAR DATOS PARA INSERTAR
        const lugarData = {
          nit_lugar: nit,
          nombre_lugar: String(fila.nombre).trim(),
          localidad_lugar: String(fila.localidad).trim(),
          direccion_lugar: String(fila.direccion).trim(),
          red_social_lugar: fila.red_social ? String(fila.red_social).trim() : '',
          tipo_entrada_lugar: fila.tipo_entrada ? String(fila.tipo_entrada).trim() : 'Gratuita',
          id_usuariofk: req.user.id_usuario,
          id_reseniafk: fila.id_reseniafk ? parseInt(fila.id_reseniafk) : null,
          id_tipo_negociofk: fila.id_tipo_negociofk ? parseInt(fila.id_tipo_negociofk) : null,
          id_tipo_serviciofk: fila.id_tipo_serviciofk ? parseInt(fila.id_tipo_serviciofk) : null,
          imagen_lugar: fila.imagen_lugar || null,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        console.log(`📝 Insertando fila ${numeroFila}: ${lugarData.nombre_lugar.substring(0, 30)}... (NIT: ${nit})`);
        
        // INSERTAR EN LA BASE DE DATOS
        const query = `
          INSERT INTO lugar (
            nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, 
            red_social_lugar, tipo_entrada_lugar, id_usuariofk,
            id_reseniafk, id_tipo_negociofk, id_tipo_serviciofk, 
            imagen_lugar, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
          lugarData.nit_lugar,
          lugarData.nombre_lugar,
          lugarData.localidad_lugar,
          lugarData.direccion_lugar,
          lugarData.red_social_lugar,
          lugarData.tipo_entrada_lugar,
          lugarData.id_usuariofk,
          lugarData.id_reseniafk,
          lugarData.id_tipo_negociofk,
          lugarData.id_tipo_serviciofk,
          lugarData.imagen_lugar,
          lugarData.created_at,
          lugarData.updated_at
        ];
        
        const [result] = await connection.query(query, values);
        
        if (result && result.insertId) {
          lugaresInsertados.push({
            id_lugar: result.insertId,
            ...lugarData
          });
          
          console.log(`✅ Lugar insertado con ID: ${result.insertId} para usuario: ${lugarData.id_usuariofk}`);
        } else {
          throw new Error('No se pudo obtener el ID del lugar insertado');
        }
        
      } catch (error) {
        console.error(`❌ Error en fila ${numeroFila}:`, error.message);
        errores.push({
          fila: numeroFila,
          error: error.message,
          datos: {
            nit: fila.nit,
            nombre: fila.nombre
          }
        });
      }
    }
    
    // CONFIRMAR TRANSACCIÓN
    await connection.commit();
    console.log('✅ Transacción confirmada');
    
    // LIMPIAR ARCHIVO
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Archivo temporal eliminado');
    }
    
    // RESPUESTA EXITOSA
    const respuesta = {
      success: true,
      message: `🎉 Carga masiva completada exitosamente`,
      data: {
        resumen: {
          totalProcesados: totalFilas,
          exitosos: lugaresInsertados.length,
          errores: errores.length,
          tasaExito: totalFilas > 0 ? `${((lugaresInsertados.length / totalFilas) * 100).toFixed(1)}%` : '0%',
          formatoArchivo: extension,
          usuarioId: req.user.id_usuario
        },
        detalles: {
          lugaresEjemplo: lugaresInsertados.slice(0, 3).map(l => ({
            id: l.id_lugar,
            nit: l.nit_lugar,
            nombre: l.nombre_lugar.substring(0, 50),
            localidad: l.localidad_lugar,
            usuarioId: l.id_usuariofk
          })),
          erroresEjemplo: errores.slice(0, 3)
        },
        usuario: req.user,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('✅ Carga completada. Resumen:', respuesta.data.resumen);
    console.log('📊 Lugares insertados con IDs:', lugaresInsertados.map(l => l.id_lugar));
    
    res.status(200).json(respuesta);
    
  } catch (error) {
    // REVERTIR EN CASO DE ERROR
    await connection.rollback();
    console.error('❌ Error en procesamiento:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error en procesamiento masivo',
      error: error.message,
      usuario: req.user
    });
    
  } finally {
    connection.release();
  }
});

// ============================================
// RUTAS ADICIONALES SIMPLIFICADAS
// ============================================

// RUTA PARA VERIFICAR USUARIO ACTUAL
router.get('/usuario-actual', (req, res) => {
  const respuesta = {
    success: true,
    message: 'Usuario actual para carga masiva',
    usuario: req.user,
    autenticado: !!req.user,
    headers: {
      'x-user-id': req.headers['x-user-id'],
      'x-user-email': req.headers['x-user-email']
    },
    timestamp: new Date().toISOString()
  };
  
  console.log('🔍 Verificando usuario actual:', respuesta);
  
  res.status(200).json(respuesta);
});

// RUTA PARA DESCARGAR PLANTILLA CON NITs ÚNICOS
router.get('/plantilla', (req, res) => {
  try {
    const plantillaPath = path.join(__dirname, '../uploads/templates/plantilla_lugares.csv');
    
    // Crear directorio si no existe
    const templateDir = path.dirname(plantillaPath);
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }
    
    // Crear contenido con NITs aleatorios únicos
    const nit1 = 100000000 + Math.floor(Math.random() * 90000000);
    const nit2 = 200000000 + Math.floor(Math.random() * 90000000);
    const nit3 = 300000000 + Math.floor(Math.random() * 90000000);
    
    const contenido = `nit,nombre,localidad,direccion,red_social,tipo_entrada,id_tipo_negociofk,id_tipo_serviciofk,imagen_lugar
${nit1},Restaurante Ejemplo 1,Bogotá,Calle 123 #45-67,@restaurante1,Gratuita,1,2,restaurante1.jpg
${nit2},Café Ejemplo 2,Medellín,Avenida 456 #78-90,@cafe2,Paga,2,3,cafe2.jpg
${nit3},Hotel Ejemplo 3,Cali,Carrera 789 #12-34,@hotel3,Mixta,3,4,hotel3.jpg

INSTRUCCIONES:
1. Usa NITs únicos (${nit1}, ${nit2}, ${nit3} son ejemplos únicos)
2. Los campos: nit, nombre, localidad, direccion son OBLIGATORIOS
3. Los lugares se asignarán al usuario ID: ${req.user?.id_usuario || 'TU_ID'}
4. No uses NITs que ya existan en el sistema`;

    fs.writeFileSync(plantillaPath, contenido);
    
    res.download(plantillaPath, 'plantilla_lugares.csv', (err) => {
      if (err) {
        console.error('Error descargando plantilla:', err);
      }
    });
  } catch (error) {
    console.error('Error en /plantilla:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando plantilla',
      error: error.message
    });
  }
});

// RUTA DE ESTADO DEL SERVICIO
router.get('/estado', (req, res) => {
  res.status(200).json({
    success: true,
    servicio: 'Carga Masiva - VERSIÓN FINAL',
    version: '1.0.0',
    estado: 'operativo',
    usuarioActual: req.user,
    timestamp: new Date().toISOString()
  });
});

export default router;