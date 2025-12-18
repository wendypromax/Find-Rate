// Tus imports existentes
import { obtenerResenasPorLugar, obtenerReporteGeneralResenas } from "../services/reporteService.js";
import { UserModel } from "../models/userModel.js"; 

export const reporteResenasPorLugar = async (req, res) => {
  try {
    const { idLugar } = req.query;
    const data = await obtenerResenasPorLugar(idLugar);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte"
    });
  }
};

export const reporteGeneralResenas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, idLugar, estado } = req.query;

    const data = await obtenerReporteGeneralResenas(
      fechaInicio,
      fechaFin,
      idLugar,
      estado
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al generar el reporte general"
    });
  }
};

// ===== NUEVAS FUNCIONES PARA REPORTES DE USUARIOS ===== ✅ AGREGAR DESDE AQUÍ

export const reporteUsuariosFiltrados = async (req, res) => {
  try {
    const filters = {
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      rol: req.query.rol,
      estado: req.query.estado,
      buscar: req.query.buscar || req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };

    const result = await UserModel.getUsersWithFilters(filters);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error en reporteUsuariosFiltrados:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios filtrados",
      error: error.message
    });
  }
};

export const reporteUsuariosPorFecha = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'fecha_inicio y fecha_fin son requeridos'
      });
    }

    const usuarios = await UserModel.getUsersByDateRange(fecha_inicio, fecha_fin);
    
    res.json({
      success: true,
      data: usuarios,
      total: usuarios.length
    });
  } catch (error) {
    console.error("Error en reporteUsuariosPorFecha:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios por fecha",
      error: error.message
    });
  }
};

export const reporteEstadisticasUsuarios = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta, year } = req.query;
    
    let stats;
    if (year) {
      // Conteos mensuales
      stats = await UserModel.getMonthlyCounts(year);
    } else {
      // Estadísticas generales
      stats = await UserModel.getStatsByDate(fecha_desde, fecha_hasta);
    }
    
    res.json({
      success: true,
      data: stats,
      total: stats.length
    });
  } catch (error) {
    console.error("Error en reporteEstadisticasUsuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};

export const reporteTodosUsuarios = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error("Error en reporteTodosUsuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todos los usuarios",
      error: error.message
    });
  }
};

export const inicializarFechasUsuarios = async (req, res) => {
  try {
    // Opcional: verificar si es admin
    // if (!req.user || req.user.rol !== 'Administrador') {
    //   return res.status(403).json({ 
    //     success: false,
    //     message: 'No autorizado' 
    //   });
    // }
    
    const result = await UserModel.addFechaRegistroColumn();
    
    if (result.success) {
      // Si se agregó la columna, actualizar fechas
      const updateResult = await UserModel.updateExistingUsersDates();
      res.json({
        success: true,
        message: 'Configuración completada',
        columnAdded: result,
        datesUpdated: updateResult
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Error al inicializar fechas',
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error en inicializarFechasUsuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error en inicialización",
      error: error.message
    });
  }
};