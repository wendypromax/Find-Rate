import { pool } from "../config/db.js";

export const obtenerResenasPorLugar = async (idLugar) => {
  try {
    let sql = `
      SELECT 
        l.id_lugar,
        l.nombre_lugar,
        COUNT(r.id_resenia) AS total_resenas
      FROM lugar l
      LEFT JOIN resenia r 
        ON r.id_lugarfk = l.id_lugar
    `;

    const params = [];

    if (idLugar) {
      sql += " WHERE l.id_lugar = ?";
      params.push(idLugar);
    }

    sql += " GROUP BY l.id_lugar, l.nombre_lugar";

    const [rows] = await pool.query(sql, params);
    return rows;

  } catch (error) {
    console.error("❌ ERROR REPORTE RESEÑAS POR LUGAR:", error);
    throw error;
  }
};
import db from "../config/db.js";

export const obtenerReporteGeneralResenas = async (
  fechaInicio,
  fechaFin,
  idLugar,
  estado
) => {
  let sql = `
    SELECT 
      COUNT(r.id_resenia) AS total_resenas,
      AVG(r.calificacion_resenia) AS promedio_calificacion,
      SUM(CASE WHEN r.estado_resenia = 'activo' THEN 1 ELSE 0 END) AS activas,
      SUM(CASE WHEN r.estado_resenia = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
      SUM(CASE WHEN r.estado_resenia = 'cancelado' THEN 1 ELSE 0 END) AS canceladas
    FROM resenia r
    WHERE 1 = 1
  `;

  const params = [];

  if (fechaInicio) {
    sql += " AND DATE(r.fecha_resenia) >= ?";
    params.push(fechaInicio);
  }

  if (fechaFin) {
    sql += " AND DATE(r.fecha_resenia) <= ?";
    params.push(fechaFin);
  }

  if (idLugar) {
    sql += " AND r.id_lugarfk = ?";
    params.push(idLugar);
  }

  if (estado) {
    sql += " AND r.estado_resenia = ?";
    params.push(estado);
  }

  const [rows] = await db.query(sql, params);
  return rows[0];
};
