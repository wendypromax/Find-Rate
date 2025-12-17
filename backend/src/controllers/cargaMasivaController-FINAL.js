import cargaMasivaService from '../services/cargaMasivaService.js';
import upload from '../middlewares/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar modelo CORREGIDO - usa el nombre correcto
import { LugarModel } from '../models/lugarModel.js';

console.log('‚úÖ CargaMasivaController-FINAL cargado');

class CargaMasivaController {
  constructor() {
    console.log('Ì¥Ñ Controlador inicializado');
    this.vistaPreviaArchivo = this.vistaPreviaArchivo.bind(this);
    this.verificarEstado = this.verificarEstado.bind(this);
    this.procesarArchivo = this.procesarArchivo.bind(this);
    this.descargarPlantilla = this.descargarPlantilla.bind(this);
  }

  // =============================================
  // 1. VERIFICAR ESTADO (ESTE YA FUNCIONA)
  // =============================================
  async verificarEstado(req, res) {
    console.log('Ì¥ç /estado accedido');
    
    try {
      const uploadsDir = path.join(__dirname, '../uploads/cargas-masivas');
      const templatesDir = path.join(__dirname, '../uploads/templates');
      
      // Crear directorios si no existen
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
      }
      
      const estado = {
        servicio: 'Carga Masiva - VERSI√ìN FINAL',
        estado: 'operativo',
        timestamp: new Date().toISOString(),
        modelo: LugarModel ? '‚úÖ Cargado correctamente' : '‚ùå No encontrado',
        directorios: {
          uploads: fs.existsSync(uploadsDir) ? '‚úÖ existe' : '‚ùå no existe',
          templates: fs.existsSync(templatesDir) ? '‚úÖ existe' : '‚ùå no existe'
        }
      };
      
      res.status(200).json({
        success: true,
        data: estado
      });
    } catch (error) {
      console.error('‚ùå Error en /estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error verificando estado',
        error: error.message
      });
    }
  }

  // =============================================
  // 2. VISTA PREVIA - VERSI√ìN CORREGIDA
  // =============================================
  async vistaPreviaArchivo(req, res) {
    console.log('ÌæØ /vista-previa accedido');
    
    // Usar middleware de multer
    upload.single('archivo')(req, res, async (err) => {
      console.log('Ì≥Å Multer ejecutado');
      console.log('   Error:', err);
      console.log('   File:', req.file);
      console.log('   Body keys:', Object.keys(req.body));
      
      if (err) {
        console.error('‚ùå Error en multer:', err);
        return res.status(400).json({
          success: false,
          message: 'Error subiendo archivo',
          error: err.message
        });
      }

      if (!req.file) {
        console.log('‚ùå No hay archivo en req.file');
        return res.status(400).json({
          success: false,
          message: 'No se subi√≥ ning√∫n archivo',
          instruccion: 'Usa form-data con key="archivo" y tipo File',
          received: {
            body: req.body,
            files: req.files
          }
        });
      }

      console.log('‚úÖ Archivo recibido:', {
        name: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        type: req.file.mimetype
      });

      try {
        console.log('Ì≥ä Procesando CSV...');
        
        // Leer CSV directamente
        const resultados = [];
        const csv = await import('csv-parser');
        
        fs.createReadStream(req.file.path)
          .pipe(csv.default())
          .on('data', (row) => {
            console.log('Ì≥ù Fila:', row);
            resultados.push(row);
          })
          .on('end', () => {
            console.log('‚úÖ CSV procesado, filas:', resultados.length);
            
            // Eliminar archivo temporal
            fs.unlinkSync(req.file.path);
            
            res.status(200).json({
              success: true,
              message: '‚úÖ Vista previa exitosa',
              data: {
                totalFilas: resultados.length,
                vistaPrevia: resultados.slice(0, 5), // Primeros 5
                muestraCompleta: resultados.length <= 10 ? resultados : resultados.slice(0, 10),
                archivo: {
                  nombre: req.file.originalname,
                  tipo: req.file.mimetype,
                  tama√±o: `${(req.file.size / 1024).toFixed(2)} KB`
                }
              }
            });
          })
          .on('error', (streamError) => {
            console.error('‚ùå Error leyendo CSV:', streamError);
            fs.unlinkSync(req.file.path);
            res.status(500).json({
              success: false,
              message: 'Error leyendo archivo CSV',
              error: streamError.message
            });
          });
          
      } catch (procesoError) {
        console.error('‚ùå Error en proceso:', procesoError);
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
          success: false,
          message: 'Error procesando archivo',
          error: procesoError.message
        });
      }
    });
  }

  // =============================================
  // 3. PROCESAR ARCHIVO COMPLETO
  // =============================================
  async procesarArchivo(req, res) {
    console.log('Ì¥Ñ /procesar accedido');
    
    upload.single('archivo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error subiendo archivo',
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se subi√≥ ning√∫n archivo'
        });
      }

      try {
        const empresaId = req.user?.empresa_id || req.user?.empresaId || req.user?.id || 1;
        
        console.log(`Ìø¢ Procesando para empresa ID: ${empresaId}`);
        console.log(`Ì≥Å Archivo: ${req.file.originalname}`);

        // CORRECCI√ìN: Usar LugarModel (no Lugar)
        const resultado = await cargaMasivaService.procesarCSV(
          req.file.path,
          empresaId,
          LugarModel  // ‚Üê ¬°CORREGIDO!
        );

        // Limpiar archivo temporal
        fs.unlinkSync(req.file.path);

        // Limpiar archivos antiguos
        await cargaMasivaService.limpiarArchivosTemporales();

        res.status(200).json({
          success: true,
          message: '‚úÖ Carga masiva procesada exitosamente',
          data: {
            totalProcesados: resultado.totalFilas,
            exitosos: resultado.exitosos,
            errores: resultado.errores.length,
            detalles: {
              errores: resultado.errores.slice(0, 5),
              lugaresInsertados: resultado.lugaresInsertados?.slice(0, 3)
            }
          }
        });

      } catch (procesoError) {
        console.error('‚ùå Error procesando:', procesoError);
        
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
          success: false,
          message: 'Error procesando el archivo',
          error: procesoError.message
        });
      }
    });
  }

  // =============================================
  // 4. DESCARGAR PLANTILLA
  // =============================================
  async descargarPlantilla(req, res) {
    console.log('Ì≥• /plantilla accedido');
    
    try {
      const plantillaPath = cargaMasivaService.generarPlantillaCSV();
      
      res.download(plantillaPath, 'plantilla_lugares.csv', (err) => {
        if (err) {
          console.error('‚ùå Error descargando:', err);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: 'Error al descargar la plantilla'
            });
          }
        }
      });
    } catch (error) {
      console.error('‚ùå Error generando plantilla:', error);
      res.status(500).json({
        success: false,
        message: 'Error generando plantilla',
        error: error.message
      });
    }
  }
}

export default new CargaMasivaController();
