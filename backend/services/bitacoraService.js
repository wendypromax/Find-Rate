import { pool } from "../db.js";

export const BitacoraService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM bitacora");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM bitacora WHERE id_bitacora = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { descripcion, fecha_bitacora, id_usuariofk } = data;
    const [result] = await pool.query(
      "INSERT INTO bitacora (descripcion, fecha_bitacora, id_usuariofk) VALUES (?, ?, ?)",
      [descripcion, fecha_bitacora, id_usuariofk]
    );
    return { id_bitacora: result.insertId, message: "Bitácora creada correctamente" };
  },

  async update(id, data) {
    const { descripcion } = data;
    await pool.query("UPDATE bitacora SET descripcion = ? WHERE id_bitacora = ?", [descripcion, id]);
    return { message: "Bitácora actualizada correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM bitacora WHERE id_bitacora = ?", [id]);
    return { message: "Bitácora eliminada correctamente" };
  },
};
