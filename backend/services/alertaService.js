import { pool } from "../db.js";

export const AlertaService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM alerta");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM alerta WHERE id_alerta = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { estado_alerta, id_usuariofk } = data;
    const [result] = await pool.query(
      "INSERT INTO alerta (estado_alerta, id_usuariofk) VALUES (?, ?)",
      [estado_alerta, id_usuariofk]
    );
    return { id_alerta: result.insertId, message: "Alerta creada" };
  },

  async update(id, data) {
    const { estado_alerta } = data;
    await pool.query("UPDATE alerta SET estado_alerta=? WHERE id_alerta=?", [
      estado_alerta,
      id,
    ]);
    return { message: "Alerta actualizada" };
  },

  async delete(id) {
    await pool.query("DELETE FROM alerta WHERE id_alerta=?", [id]);
    return { message: "Alerta eliminada" };
  },
};
