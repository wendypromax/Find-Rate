import { pool } from "../config/db.js";

export const ReseniaService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM resenia");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM resenia WHERE id_resenia = ?", [id]);
    return rows[0];
  },

  // ✅ Nuevo método: obtener reseñas por lugar
  async getByLugarId(id_lugar) {
    const [rows] = await pool.query(
      `SELECT 
         r.id_resenia,
         r.titulo_resenia,
         r.contenido_resenia,
         r.fecha_resenia,
         u.nombre_usuario,
         u.apellido_usuario
       FROM resenia r
       JOIN usuario u ON r.id_usuariofk = u.id_usuario
       WHERE r.id_lugarfk = ?
       ORDER BY r.fecha_resenia DESC`,
      [id_lugar]
    );
    return rows;
  },

  async create(data) {
    const { titulo_resenia, contenido_resenia, fecha_resenia, id_usuariofk, id_lugarfk } = data;
    const [result] = await pool.query(
      "INSERT INTO resenia (titulo_resenia, contenido_resenia, fecha_resenia, id_usuariofk, id_lugarfk) VALUES (?, ?, ?, ?, ?)",
      [titulo_resenia, contenido_resenia, fecha_resenia, id_usuariofk, id_lugarfk]
    );
    return { id_resenia: result.insertId, message: "Reseña creada correctamente" };
  },

  async update(id, data) {
    const { titulo_resenia, contenido_resenia } = data;
    await pool.query(
      "UPDATE resenia SET titulo_resenia = ?, contenido_resenia = ? WHERE id_resenia = ?",
      [titulo_resenia, contenido_resenia, id]
    );
    return { message: "Reseña actualizada correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM resenia WHERE id_resenia = ?", [id]);
    return { message: "Reseña eliminada correctamente" };
  },
};
