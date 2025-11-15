// 📂 controllers/reseniaController.js
import { db } from "../Server.js";

// ✅ Obtener todas las reseñas CON información del usuario
export const getResenias = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.nombre_usuario, u.apellido_usuario 
       FROM resenia r 
       INNER JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       ORDER BY r.fecha_resenia DESC`
    );
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas" });
  }
};

// ✅ Obtener reseña por ID CON información del usuario
export const getReseniaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.nombre_usuario, u.apellido_usuario 
       FROM resenia r 
       INNER JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       WHERE r.id_resenia = ?`, 
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    res.json({ success: true, resenia: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener la reseña" });
  }
};

// ✅ Obtener reseñas por lugar CON información del usuario
export const getReseniasByLugar = async (req, res) => {
  const { id_lugar } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.nombre_usuario, u.apellido_usuario 
       FROM resenia r 
       INNER JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       WHERE r.id_lugarfk = ? 
       ORDER BY r.fecha_resenia DESC`,
      [id_lugar]
    );
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas del lugar" });
  }
};

// ✅ Crear nueva reseña
export const createResenia = async (req, res) => {
  const { comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk } = req.body;

  if (!comentario_resenia || !calificacion_resenia || !id_usuariofk || !id_lugarfk) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO resenia (comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk)
       VALUES (?, ?, ?, ?)`,
      [comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk]
    );

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      id_resenia: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ success: false, message: "Error al crear la reseña" });
  }
};

// ✅ Actualizar reseña
export const updateResenia = async (req, res) => {
  const { id } = req.params;
  const { comentario_resenia, calificacion_resenia } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE resenia SET comentario_resenia = ?, calificacion_resenia = ? WHERE id_resenia = ?",
      [comentario_resenia, calificacion_resenia, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    res.json({ success: true, message: "Reseña actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar la reseña" });
  }
};

// ✅ Eliminar reseña
export const deleteResenia = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM resenia WHERE id_resenia = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    res.json({ success: true, message: "Reseña eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar la reseña" });
  }
};