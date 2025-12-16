import cargaMasivaService from '../services/cargaMasivaService.js';
import upload from '../middlewares/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa EXACTAMENTE como está en tu modelo
import { LugarModel } from '../models/lugarModel.js';

class CargaMasivaControllerCorregido {
  // Subir y procesar archivo CSV
  async procesarArchivo(req, res) {
    try {
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
            message: 'No se subió ningún archivo'
          });
        }

        try {
          const empresaId = req.user?.empresa_id || req.user?.empresaId || req.user?.id || 1;
          
          console.log(`📊 Procesando para empresa: ${empresaId}`);
          console.log(`📁 Archivo: ${req.file.path}`);
          console.log(`🗄️  Modelo:`, LugarModel ? 'OK' : 'NO ENCONTRADO');

          // CORRECIÓN: Usa LugarModel, no Lugar
          const resultado = await cargaMasivaService.procesarCSV(
            req.file.path,
            empresaId,
            LugarModel  // ← ¡CORREGIDO!
          );

          fs.unlinkSync(req.file.path);

          res.status(200).json({
            success: true,
            message: 'Carga masiva procesada exitosamente',
            data: resultado
          });

        } catch (procesoError) {
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          console.error('❌ Error procesando CSV:', procesoError);
          
          res.status(500).json({
            success: false,
            message: 'Error procesando el archivo',
            error: procesoError.message
          });
        }
      });
    } catch (error) {
      console.error('💥 Error en controlador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Descargar plantilla
  async descargarPlantilla(req, res) {
    try {
      const plantillaPath = cargaMasivaService.generarPlantillaCSV();
      res.download(plantillaPath, 'plantilla_lugares.csv');
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generando plantilla',
        error: error.message
      });
    }
  }

  // Vista previa del archivo - VERSIÓN SIMPLIFICADA
  async vistaPreviaArchivo(req, res) {
    console.log('🎯 Ruta /vista-previa accedida');
    
    try {
      upload.single('archivo')(req, res, async (err) => {
        console.log('📁 Middleware upload ejecutado');
        
        if (err) {
          console.error('❌ Error upload:', err);
          return res.status(400).json({
            success: false,
            message: 'Error subiendo archivo',
            error: err.message
          });
        }

        if (!req.file) {
          console.log('❌ No hay archivo');
          return res.status(400).json({
            success: false,
            message: 'No se subió ningún archivo'
          });
        }

        console.log('✅ Archivo recibido:', req.file.filename);
        
        try {
          // Usa el servicio o lee directamente
          const vistaPrevia = await cargaMasivaService.obtenerVistaPrevia(req.file.path, 5);
          
          fs.unlinkSync(req.file.path);

          console.log('✅ Vista previa generada, filas:', vistaPrevia.length);

          res.status(200).json({
            success: true,
            message: 'Vista previa generada correctamente',
            data: {
              vistaPrevia: vistaPrevia,
              totalFilas: vistaPrevia.length
            }
          });
        } catch (procesoError) {
          console.error('❌ Error en vista previa:', procesoError);
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          
          res.status(500).json({
            success: false,
            message: 'Error obteniendo vista previa',
            error: procesoError.message
          });
        }
      });
    } catch (error) {
      console.error('💥 Error general:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error.message
      });
    }
  }

  // Verificar estado del servicio
  async verificarEstado(req, res) {
    console.log('🔍 Ruta /estado accedida');
    
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
        servicio: 'Carga Masiva - VERSIÓN CORREGIDA',
        estado: 'operativo',
        timestamp: new Date().toISOString(),
        modelo: LugarModel ? 'Cargado correctamente' : 'No encontrado',
        rutas: {
          uploads: uploadsDir,
          templates: templatesDir
        }
      };
      
      res.status(200).json({
        success: true,
        data: estado
      });
    } catch (error) {
      console.error('❌ Error en estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error verificando estado',
        error: error.message
      });
    }
  }
}

export default new CargaMasivaControllerCorregido();