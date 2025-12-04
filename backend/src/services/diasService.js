import { pool } from "../config/db.js";

export const DiasService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM dias");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM dias WHERE id_dia = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_dia } = data;
    const [result] = await pool.query("INSERT INTO dias (nombre_dia) VALUES (?)", [nombre_dia]);
    return { id_dia: result.insertId, message: "Día agregado correctamente" };
  },

  async update(id, data) {
    const { nombre_dia } = data;
    await pool.query("UPDATE dias SET nombre_dia = ? WHERE id_dia = ?", [nombre_dia, id]);
    return { message: "Día actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM dias WHERE id_dia = ?", [id]);
    return { message: "Día eliminado correctamente" };
  },
};
