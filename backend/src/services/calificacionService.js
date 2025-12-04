// 📂 services/calificacionService.js
import { pool } from "../config/db.js";

export const CalificacionService = {
  // ✅ Obtener todas las calificaciones
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM calificacion");
    return rows;
  },

  // ✅ Obtener una calificación por su ID
  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM calificacion WHERE id_calificacion = ?", [id]);
    return rows[0];
  },

  // ✅ Crear nueva calificación
  async create(data) {
    const { ambiente, limpieza, id_tipo_serviciofk, id_reseniafk } = data;
    const [result] = await pool.query(
      "INSERT INTO calificacion (ambiente, limpieza, id_tipo_serviciofk, id_reseniafk) VALUES (?, ?, ?, ?)",
      [ambiente, limpieza, id_tipo_serviciofk, id_reseniafk]
    );
    return { id_calificacion: result.insertId, message: "Calificación creada correctamente" };
  },

  // ✅ Actualizar calificación
  async update(id, data) {
    const { ambiente, limpieza } = data;
    await pool.query(
      "UPDATE calificacion SET ambiente = ?, limpieza = ? WHERE id_calificacion = ?",
      [ambiente, limpieza, id]
    );
    return { message: "Calificación actualizada correctamente" };
  },

  // ✅ Eliminar calificación
  async delete(id) {
    await pool.query("DELETE FROM calificacion WHERE id_calificacion = ?", [id]);
    return { message: "Calificación eliminada correctamente" };
  },

  // ✅ Nueva función: obtener promedio por lugar
  async getPromedioPorLugar() {
    const [rows] = await pool.query(`
      SELECT 
        l.id_lugar,
        l.nombre_lugar,
        ROUND(AVG(r.calificacion_resenia), 1) AS promedio_calificacion
      FROM lugar l
      LEFT JOIN resenia r ON l.id_lugar = r.id_lugarfk
      GROUP BY l.id_lugar, l.nombre_lugar
    `);
    return rows;
  },
};
