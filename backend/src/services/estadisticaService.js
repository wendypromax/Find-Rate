import { pool } from "../config/db.js";

export const EstadisticaService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM estadistica");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM estadistica WHERE id_estadistica = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { tipo_estadistica, valor_estadistica } = data;
    const [result] = await pool.query(
      "INSERT INTO estadistica (tipo_estadistica, valor_estadistica) VALUES (?, ?)",
      [tipo_estadistica, valor_estadistica]
    );
    return { id_estadistica: result.insertId, message: "Estadística creada correctamente" };
  },

  async update(id, data) {
    const { valor_estadistica } = data;
    await pool.query(
      "UPDATE estadistica SET valor_estadistica = ? WHERE id_estadistica = ?",
      [valor_estadistica, id]
    );
    return { message: "Estadística actualizada correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM estadistica WHERE id_estadistica = ?", [id]);
    return { message: "Estadística eliminada correctamente" };
  },
};
