import express from 'express';
import cargaMasivaController from '../controllers/cargaMasivaController.js';

const router = express.Router();

// Middleware temporal para pruebas
router.use((req, res, next) => {
  req.user = {
    id: 1,
    empresa_id: 1,
    rol: 'empresario'
  };
  console.log('⚠️  Usando autenticación de prueba');
  next();
});

// Ruta para subir y procesar archivo CSV
router.post('/procesar', cargaMasivaController.procesarArchivo);

// Ruta para descargar plantilla
router.get('/plantilla', cargaMasivaController.descargarPlantilla);

// ⚠️ ESTA RUTA DEBE ESTAR PRESENTE:
router.post('/vista-previa', cargaMasivaController.vistaPreviaArchivo);

// Ruta para verificar estado del servicio
router.get('/estado', cargaMasivaController.verificarEstado);

export default router;