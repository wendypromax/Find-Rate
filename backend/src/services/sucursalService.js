import { pool } from "../config/db.js";

export const SucursalService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM sucursal");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM sucursal WHERE id_sucursal = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { nombre_sucursal, direccion_sucursal, telefono_sucursal, id_lugarfk } = data;
    const [result] = await pool.query(
      "INSERT INTO sucursal (nombre_sucursal, direccion_sucursal, telefono_sucursal, id_lugarfk) VALUES (?, ?, ?, ?)",
      [nombre_sucursal, direccion_sucursal, telefono_sucursal, id_lugarfk]
    );
    return { id_sucursal: result.insertId, message: "Sucursal creada correctamente" };
  },

  async update(id, data) {
    const { nombre_sucursal, direccion_sucursal, telefono_sucursal } = data;
    await pool.query(
      "UPDATE sucursal SET nombre_sucursal = ?, direccion_sucursal = ?, telefono_sucursal = ? WHERE id_sucursal = ?",
      [nombre_sucursal, direccion_sucursal, telefono_sucursal, id]
    );
    return { message: "Sucursal actualizada correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM sucursal WHERE id_sucursal = ?", [id]);
    return { message: "Sucursal eliminada correctamente" };
  },
};
