import { pool } from "../db.js";

export const TipoNegocioService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM tipo_negocio");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tipo_negocio WHERE id_tipo_negocio = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_tipo_negocio } = data;
    const [result] = await pool.query(
      "INSERT INTO tipo_negocio (nombre_tipo_negocio) VALUES (?)",
      [nombre_tipo_negocio]
    );
    return { id_tipo_negocio: result.insertId, message: "Tipo de negocio creado correctamente" };
  },

  async update(id, data) {
    const { nombre_tipo_negocio } = data;
    await pool.query("UPDATE tipo_negocio SET nombre_tipo_negocio = ? WHERE id_tipo_negocio = ?", [
      nombre_tipo_negocio,
      id,
    ]);
    return { message: "Tipo de negocio actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM tipo_negocio WHERE id_tipo_negocio = ?", [id]);
    return { message: "Tipo de negocio eliminado correctamente" };
  },
};
