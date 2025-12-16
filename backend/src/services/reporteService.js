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
