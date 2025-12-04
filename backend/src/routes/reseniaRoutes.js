import express from "express";
import { pool as db } from "../config/db.js";

const router = express.Router();

// POST - Crear nueva reseña
router.post('/', async (req, res) => {
  console.log("📨 POST /api/resenias - Datos recibidos:", req.body);

  try {
    const { comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk } = req.body;

    if (!comentario_resenia?.trim())
      return res.status(400).json({ success: false, message: "El comentario es obligatorio" });

    if (!calificacion_resenia)
      return res.status(400).json({ success: false, message: "La calificación es obligatoria" });

    if (!id_usuariofk)
      return res.status(400).json({ success: false, message: "El ID de usuario es obligatorio" });

    if (!id_lugarfk)
      return res.status(400).json({ success: false, message: "El ID de lugar es obligatorio" });

    const [result] = await db.execute(
      `INSERT INTO resenia 
       (comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk, fecha_resenia, hora_resenia) 
       VALUES (?, ?, ?, ?, NOW(), CURTIME())`,
      [
        comentario_resenia.trim(),
        calificacion_resenia.toString(),
        parseInt(id_usuariofk),
        parseInt(id_lugarfk)
      ]
    );

    const [nuevaResenia] = await db.execute(
      `SELECT r.*, u.nombre_usuario 
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       WHERE r.id_resenia = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      resenia: nuevaResenia[0]
    });

  } catch (error) {
    console.error("💥 Error en POST /api/resenias:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// GET - Obtener reseñas por lugar
router.get("/lugar/:id_lugar", async (req, res) => {
  const { id_lugar } = req.params;

  try {
    const [resenias] = await db.execute(
      `SELECT 
        r.id_resenia,
        r.comentario_resenia,
        r.calificacion_resenia,
        r.fecha_resenia,
        r.hora_resenia,
        r.id_usuariofk,
        r.id_lugarfk,
        COALESCE(u.nombre_usuario, 'Usuario') as nombre_usuario
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       WHERE r.id_lugarfk = ? 
       ORDER BY r.fecha_resenia DESC, r.hora_resenia DESC`,
      [parseInt(id_lugar)]
    );

    res.json({ success: true, resenias });

  } catch (error) {
    console.error("💥 Error en GET /api/resenias/lugar:", error);
    res.status(500).json({ success: false, message: "Error interno servidor" });
  }
});

// GET todas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT r.*, u.nombre_usuario, l.nombre_lugar 
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar 
       ORDER BY r.fecha_resenia DESC`
    );

    res.json({ success: true, resenias: rows, total: rows.length });

  } catch (error) {
    console.error("Error en GET /api/resenias:", error);
    res.status(500).json({ success: false, message: "Error al cargar reseñas" });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario_resenia, calificacion_resenia } = req.body;

    const [result] = await db.execute(
      "UPDATE resenia SET comentario_resenia = ?, calificacion_resenia = ? WHERE id_resenia = ?",
      [comentario_resenia, calificacion_resenia, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });

    res.json({ success: true, message: "Reseña actualizada correctamente" });

  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ success: false, message: "Error al actualizar reseña" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM resenia WHERE id_resenia = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });

    res.json({ success: true, message: "Reseña eliminada correctamente" });

  } catch (error) {
    console.error("DELETE error:", error);
    res.status(500).json({ success: false, message: "Error al eliminar reseña" });
  }
});

export default router;
