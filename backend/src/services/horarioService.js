import { pool } from "../config/db.js";

export const HorarioService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM horario");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM horario WHERE id_horario = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { hora_apertura, hora_cierre, id_diafk, id_lugarfk } = data;
    const [result] = await pool.query(
      "INSERT INTO horario (hora_apertura, hora_cierre, id_diafk, id_lugarfk) VALUES (?, ?, ?, ?)",
      [hora_apertura, hora_cierre, id_diafk, id_lugarfk]
    );
    return { id_horario: result.insertId, message: "Horario registrado correctamente" };
  },

  async update(id, data) {
    const { hora_apertura, hora_cierre } = data;
    await pool.query(
      "UPDATE horario SET hora_apertura = ?, hora_cierre = ? WHERE id_horario = ?",
      [hora_apertura, hora_cierre, id]
    );
    return { message: "Horario actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM horario WHERE id_horario = ?", [id]);
    return { message: "Horario eliminado correctamente" };
  },
};
