import express from "express";
import { db } from "../server.js"; 


const router = express.Router();



// ✅ Promedios por lugar (corregido)
router.get("/promedios", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        l.id_lugar, 
        l.nombre_lugar, 
        ROUND(AVG(r.calificacion_resenia + 0), 1) AS promedio_calificacion
      FROM lugar l
      LEFT JOIN resenia r ON l.id_lugar = r.id_lugarfk
      GROUP BY l.id_lugar, l.nombre_lugar
    `);

    res.json({ success: true, promedios: rows });
  } catch (error) {
    console.error("Error al obtener promedios:", error);
    res.status(500).json({ success: false, message: "Error al obtener promedios" });
  }
});

export default router;
