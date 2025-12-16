import { obtenerResenasPorLugar } from "../services/reporteService.js";

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
import { obtenerReporteGeneralResenas } from "../services/reporteService.js";

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
