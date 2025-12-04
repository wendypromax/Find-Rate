import { pool } from "../config/db.js";

export const ContactoService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM contacto");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM contacto WHERE id_contacto = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_contacto, correo_contacto, mensaje_contacto } = data;
    const [result] = await pool.query(
      "INSERT INTO contacto (nombre_contacto, correo_contacto, mensaje_contacto) VALUES (?, ?, ?)",
      [nombre_contacto, correo_contacto, mensaje_contacto]
    );
    return { id_contacto: result.insertId, message: "Contacto registrado correctamente" };
  },

  async update(id, data) {
    const { mensaje_contacto } = data;
    await pool.query("UPDATE contacto SET mensaje_contacto = ? WHERE id_contacto = ?", [
      mensaje_contacto,
      id,
    ]);
    return { message: "Contacto actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM contacto WHERE id_contacto = ?", [id]);
    return { message: "Contacto eliminado correctamente" };
  },
};
