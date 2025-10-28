import { pool } from "../db.js";

export const CalificacionService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM calificacion");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM calificacion WHERE id_calificacion = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { puntuacion, comentario, id_usuariofk, id_reseniafk } = data;
    const [result] = await pool.query(
      "INSERT INTO calificacion (puntuacion, comentario, id_usuariofk, id_reseniafk) VALUES (?, ?, ?, ?)",
      [puntuacion, comentario, id_usuariofk, id_reseniafk]
    );
    return { id_calificacion: result.insertId, message: "Calificación creada correctamente" };
  },

  async update(id, data) {
    const { puntuacion, comentario } = data;
    await pool.query(
      "UPDATE calificacion SET puntuacion = ?, comentario = ? WHERE id_calificacion = ?",
      [puntuacion, comentario, id]
    );
    return { message: "Calificación actualizada correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM calificacion WHERE id_calificacion = ?", [id]);
    return { message: "Calificación eliminada correctamente" };
  },
};
