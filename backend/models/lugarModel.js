import { pool } from "../db.js";

export const LugarModel = {
  async insertarLugar(data) {
    const {
      nit_lugar,
      nombre_lugar,
      localidad_lugar,
      direccion_lugar,
      red_social_lugar,
      tipo_entrada_lugar,
      id_usuariofk,
    } = data;

    if (!nit_lugar || !nombre_lugar || !direccion_lugar || !id_usuariofk) {
      throw new Error("Faltan datos obligatorios");
    }

    const [existingLugar] = await pool.query(
      "SELECT * FROM lugares WHERE nit_lugar = ?",
      [nit_lugar]
    );

    if (existingLugar.length > 0) {
      throw new Error("El NIT del lugar ya está registrado");
    }

    await pool.query(
      `INSERT INTO lugares 
      (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, id_usuariofk) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, id_usuariofk]
    );

    return { message: "Lugar registrado correctamente" };
  },
};
