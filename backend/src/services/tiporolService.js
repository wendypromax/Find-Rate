import { pool } from "../config/db.js";

export const TipoRolService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM tipo_rol");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM tipo_rol WHERE id_tipo_rol = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_tipo_rol } = data;
    const [result] = await pool.query(
      "INSERT INTO tipo_rol (nombre_tipo_rol) VALUES (?)",
      [nombre_tipo_rol]
    );
    return { id_tipo_rol: result.insertId, message: "Tipo de rol creado correctamente" };
  },

  async update(id, data) {
    const { nombre_tipo_rol } = data;
    await pool.query("UPDATE tipo_rol SET nombre_tipo_rol = ? WHERE id_tipo_rol = ?", [
      nombre_tipo_rol,
      id,
    ]);
    return { message: "Tipo de rol actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM tipo_rol WHERE id_tipo_rol = ?", [id]);
    return { message: "Tipo de rol eliminado correctamente" };
  },
};
