import { pool } from "../db.js";

export const TipoServicioService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM tipo_servicio");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tipo_servicio WHERE id_tipo_servicio = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_tipo_servicio } = data;
    const [result] = await pool.query(
      "INSERT INTO tipo_servicio (nombre_tipo_servicio) VALUES (?)",
      [nombre_tipo_servicio]
    );
    return { id_tipo_servicio: result.insertId, message: "Tipo de servicio creado correctamente" };
  },

  async update(id, data) {
    const { nombre_tipo_servicio } = data;
    await pool.query("UPDATE tipo_servicio SET nombre_tipo_servicio = ? WHERE id_tipo_servicio = ?", [
      nombre_tipo_servicio,
      id,
    ]);
    return { message: "Tipo de servicio actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM tipo_servicio WHERE id_tipo_servicio = ?", [id]);
    return { message: "Tipo de servicio eliminado correctamente" };
  },
};
