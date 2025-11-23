// backend/controllers/reseniaController.js
import { pool as db } from "../db.js";

// ✅ Obtener todas las reseñas
export const getResenias = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      ORDER BY r.fecha_resenia DESC
    `);
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas" });
  }
};

// ✅ Obtener reseña por ID
export const getReseniaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      WHERE r.id_resenia = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
    
    res.json({ success: true, resenia: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseña" });
  }
};

// ✅ Obtener reseñas por lugar
export const getReseniasByLugar = async (req, res) => {
  const { id_lugar } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, u.foto_usuario
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      WHERE r.id_lugarfk = ? 
      ORDER BY r.fecha_resenia DESC
    `, [id_lugar]);
    
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas del lugar" });
  }
};

// ✅ Obtener reseñas por usuario
export const getReseniasByUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, u.foto_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      WHERE r.id_usuariofk = ? 
      ORDER BY r.fecha_resenia DESC
    `, [id_usuario]);
    
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas del usuario" });
  }
};

// ✅ Crear reseña
export const createResenia = async (req, res) => {
  const { id_lugarfk, id_usuariofk, comentario, calificacion } = req.body;
  
  try {
    // Validar campos obligatorios
    if (!id_lugarfk || !id_usuariofk || !comentario || !calificacion) {
      return res.status(400).json({ 
        success: false, 
        message: "Todos los campos son obligatorios" 
      });
    }

    // Verificar si ya existe una reseña del usuario para este lugar
    const [existing] = await db.query(
      "SELECT * FROM resenia WHERE id_lugarfk = ? AND id_usuariofk = ?",
      [id_lugarfk, id_usuariofk]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya has escrito una reseña para este lugar" 
      });
    }

    // Insertar nueva reseña
    const [result] = await db.query(
      "INSERT INTO resenia (id_lugarfk, id_usuariofk, comentario, calificacion, fecha_resenia) VALUES (?, ?, ?, ?, NOW())",
      [id_lugarfk, id_usuariofk, comentario, calificacion]
    );

    res.status(201).json({ 
      success: true, 
      message: "Reseña creada correctamente", 
      id_resenia: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al crear reseña" });
  }
};

// ✅ Actualizar reseña
export const updateResenia = async (req, res) => {
  const { id } = req.params;
  const { comentario, calificacion } = req.body;
  
  try {
    const [result] = await db.query(
      "UPDATE resenia SET comentario = ?, calificacion = ? WHERE id_resenia = ?",
      [comentario, calificacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    res.json({ success: true, message: "Reseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar reseña" });
  }
};

// ✅ Eliminar reseña
export const deleteResenia = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query("DELETE FROM resenia WHERE id_resenia = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    res.json({ success: true, message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar reseña" });
  }
};

// ✅ Verificar si el usuario es propietario de la reseña
export const verificarPropietarioResenia = async (req, res) => {
  const { id_resenia } = req.params;
  const { id_usuario } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id_usuariofk FROM resenia WHERE id_resenia = ?",
      [id_resenia]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    const esPropietario = rows[0].id_usuariofk === parseInt(id_usuario);
    
    res.json({ 
      success: true, 
      esPropietario,
      id_usuariofk: rows[0].id_usuariofk 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al verificar propietario" });
  }
};