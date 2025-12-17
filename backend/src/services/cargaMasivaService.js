import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

class CargaMasivaService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads/cargas-masivas');
    this.templatesDir = path.join(__dirname, '../uploads/templates');
    this.ensureDirectories();
  }

  ensureDirectories() {
    // Crear directorios si no existen
    [this.uploadsDir, this.templatesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Limpiar archivos temporales antiguos (más de 1 hora)
  async limpiarArchivosTemporales() {
    try {
      const files = await readdir(this.uploadsDir);
      const now = Date.now();
      const unaHora = 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtimeMs > unaHora) {
          await unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Error limpiando archivos temporales:', error);
    }
  }

  // Procesar CSV
  async procesarCSV(filePath, empresaId, LugarModel) {
    return new Promise((resolve, reject) => {
      const resultados = {
        exitosos: 0,
        errores: [],
        lugaresInsertados: [],
        totalFilas: 0
      };

      const lugaresBatch = [];
      const batchSize = 50; // Insertar en lotes de 50
      let currentBatch = [];

      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          resultados.totalFilas++;
          
          try {
            // Validar y procesar fila
            const lugar = this.procesarFilaCSV(row, empresaId);
            if (lugar.error) {
              resultados.errores.push({
                fila: resultados.totalFilas,
                datos: row,
                error: lugar.error
              });
            } else {
              currentBatch.push(lugar.data);
              
              // Cuando el lote alcanza el tamaño máximo, agregarlo al batch
              if (currentBatch.length >= batchSize) {
                lugaresBatch.push([...currentBatch]);
                currentBatch = [];
              }
            }
          } catch (error) {
            resultados.errores.push({
              fila: resultados.totalFilas,
              datos: row,
              error: `Error procesando fila: ${error.message}`
            });
          }
        })
        .on('end', async () => {
          try {
            // Agregar el último lote incompleto
            if (currentBatch.length > 0) {
              lugaresBatch.push([...currentBatch]);
            }

            // Insertar todos los lotes
            for (const batch of lugaresBatch) {
              if (batch.length > 0) {
                try {
                  const inserted = await LugarModel.insertMany(batch, { ordered: false });
                  resultados.exitosos += inserted.length;
                  resultados.lugaresInsertados.push(...inserted);
                } catch (insertError) {
                  // Registrar errores de inserción
                  resultados.errores.push({
                    error: `Error insertando lote: ${insertError.message}`,
                    loteSize: batch.length
                  });
                }
              }
            }

            resolve(resultados);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(new Error(`Error leyendo archivo CSV: ${error.message}`));
        });
    });
  }

  procesarFilaCSV(row, empresaId) {
    // Validaciones básicas
    const camposRequeridos = ['nombre', 'direccion'];
    const errores = [];

    camposRequeridos.forEach(campo => {
      if (!row[campo] || row[campo].trim() === '') {
        errores.push(`Campo "${campo}" es requerido`);
      }
    });

    // Validar coordenadas si están presentes
    if (row.latitud && (isNaN(parseFloat(row.latitud)) || parseFloat(row.latitud) < -90 || parseFloat(row.latitud) > 90)) {
      errores.push('Latitud inválida (-90 a 90)');
    }

    if (row.longitud && (isNaN(parseFloat(row.longitud)) || parseFloat(row.longitud) < -180 || parseFloat(row.longitud) > 180)) {
      errores.push('Longitud inválida (-180 a 180)');
    }

    if (errores.length > 0) {
      return { error: errores.join(', ') };
    }

    // Procesar datos
    return {
      data: {
        nombre: row.nombre.trim(),
        direccion: row.direccion.trim(),
        descripcion: row.descripcion ? row.descripcion.trim() : '',
        telefono: row.telefono ? row.telefono.trim() : '',
        email: row.email ? row.email.trim() : '',
        sitio_web: row.sitio_web || row.sitioWeb ? (row.sitio_web || row.sitioWeb).trim() : '',
        horario: row.horario ? row.horario.trim() : '',
        precio_promedio: row.precio_promedio || row.precioPromedio ? parseFloat(row.precio_promedio || row.precioPromedio) : null,
        capacidad: row.capacidad ? parseInt(row.capacidad) : null,
        latitud: row.latitud ? parseFloat(row.latitud) : null,
        longitud: row.longitud ? parseFloat(row.longitud) : null,
        empresa_id: empresaId,
        categoria_id: row.categoria_id || row.categoriaId || null,
        tipo_negocio_id: row.tipo_negocio_id || row.tipoNegocioId || null,
        estado: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    };
  }

  // Generar plantilla CSV
  generarPlantillaCSV() {
    const plantillaPath = path.join(this.templatesDir, 'plantilla_lugares.csv');
    
    const encabezados = [
      'nombre',
      'direccion',
      'descripcion',
      'telefono',
      'email',
      'sitio_web',
      'horario',
      'precio_promedio',
      'capacidad',
      'latitud',
      'longitud',
      'categoria_id',
      'tipo_negocio_id'
    ];
    
    const ejemplos = [
      {
        nombre: 'Restaurante El Sabor',
        direccion: 'Av. Principal 123, Ciudad',
        descripcion: 'Restaurante de comida tradicional',
        telefono: '555-1234',
        email: 'contacto@elsabor.com',
        sitio_web: 'www.elsabor.com',
        horario: 'Lunes a Domingo 12:00 - 23:00',
        precio_promedio: '25.50',
        capacidad: '80',
        latitud: '19.4326',
        longitud: '-99.1332',
        categoria_id: '1',
        tipo_negocio_id: '2'
      },
      {
        nombre: 'Cafetería Central',
        direccion: 'Calle Secundaria 456',
        descripcion: 'Café y pasteles artesanales',
        telefono: '555-5678',
        email: 'hola@cafeteria.com',
        sitio_web: 'www.cafeteria.com',
        horario: 'Lunes a Viernes 7:00 - 20:00',
        precio_promedio: '12.75',
        capacidad: '40',
        latitud: '19.4336',
        longitud: '-99.1342',
        categoria_id: '2',
        tipo_negocio_id: '3'
      }
    ];
    
    // Crear contenido CSV
    let contenido = encabezados.join(',') + '\n';
    
    ejemplos.forEach(ejemplo => {
      const fila = encabezados.map(header => {
        const valor = ejemplo[header] !== undefined ? ejemplo[header] : '';
        // Escapar comas y comillas
        if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"'))) {
          return `"${valor.replace(/"/g, '""')}"`;
        }
        return valor;
      });
      contenido += fila.join(',') + '\n';
    });
    
    fs.writeFileSync(plantillaPath, contenido, 'utf8');
    
    return plantillaPath;
  }

  // Obtener vista previa del CSV
  async obtenerVistaPrevia(filePath, maxRows = 5) {
    return new Promise((resolve, reject) => {
      const resultados = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (resultados.length < maxRows) {
            resultados.push(row);
          }
        })
        .on('end', () => {
          resolve(resultados);
        })
        .on('error', (error) => {
          reject(new Error(`Error leyendo CSV: ${error.message}`));
        });
    });
  }
}

export default new CargaMasivaService();