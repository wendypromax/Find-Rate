import { pool } from "../db.js";

export const FavoritosService = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM favoritos");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM favoritos WHERE id_favorito = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const { id_usuariofk, id_lugarfk } = data;
    const [result] = await pool.query(
      "INSERT INTO favoritos (id_usuariofk, id_lugarfk) VALUES (?, ?)",
      [id_usuariofk, id_lugarfk]
    );
    return { id_favorito: result.insertId, message: "Favorito agregado correctamente" };
  },

  async update(id, data) {
    const { id_lugarfk } = data;
    await pool.query("UPDATE favoritos SET id_lugarfk = ? WHERE id_favorito = ?", [
      id_lugarfk,
      id,
    ]);
    return { message: "Favorito actualizado correctamente" };
  },

  async delete(id) {
    await pool.query("DELETE FROM favoritos WHERE id_favorito = ?", [id]);
    return { message: "Favorito eliminado correctamente" };
  },
};
