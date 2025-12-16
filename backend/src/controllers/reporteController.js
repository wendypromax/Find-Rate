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
