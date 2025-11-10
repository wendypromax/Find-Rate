import { db } from "../Server.js";

export const LugarModel = {
  // 🔹 Insertar un nuevo lugar
  insertarLugar: async (data) => {
    const {
      nit_lugar,
      nombre_lugar,
      localidad_lugar,
      direccion_lugar,
      red_social_lugar,
      tipo_entrada_lugar,
      id_usuariofk,
    } = data;
    
    const [result] = await db.query(
      `INSERT INTO lugar 
       (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, id_usuariofk) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar,
        direccion_lugar,
        red_social_lugar,
        tipo_entrada_lugar,
        id_usuariofk,
      ]
    );
    
    return { id_lugar: result.insertId };
  },

  // 🔹 Obtener un lugar por su ID
  obtenerLugarPorId: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM lugar WHERE id_lugar = ?", 
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔹 Obtener todos los lugares
  obtenerTodosLosLugares: async () => {
    const [rows] = await db.query("SELECT * FROM lugar");
    return rows;
  },

  // 🔹 Buscar lugares por nombre, localidad o dirección, opcionalmente filtrando por tipo
  buscarLugares: async (query, tipo_entrada) => {
    let sql = `
      SELECT * FROM lugar
      WHERE nombre_lugar LIKE ? OR localidad_lugar LIKE ? OR direccion_lugar LIKE ?
    `;
    
    // ⚠️ CORRECCIÓN: Las comillas invertidas deben estar dentro de las comillas normales
    const params = [`%${query}%`, `%${query}%`, `%${query}%`];
    
    if (tipo_entrada) {
      sql += " AND tipo_entrada_lugar = ?";
      params.push(tipo_entrada);
    }
    
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // 🔹 Obtener lugares por usuario (empresario)
  obtenerLugaresPorUsuario: async (id_usuario) => {
    const [rows] = await db.query(
      "SELECT * FROM lugar WHERE id_usuariofk = ?",
      [id_usuario]
    );
    return rows;
  },

  // 🔹 Actualizar un lugar
  actualizarLugar: async (id, data) => {
    const {
      nit_lugar,
      nombre_lugar,
      localidad_lugar,
      direccion_lugar,
      red_social_lugar,
      tipo_entrada_lugar,
    } = data;

    const [result] = await db.query(
      `UPDATE lugar SET 
       nit_lugar = ?, 
       nombre_lugar = ?, 
       localidad_lugar = ?, 
       direccion_lugar = ?, 
       red_social_lugar = ?, 
       tipo_entrada_lugar = ?
       WHERE id_lugar = ?`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar,
        direccion_lugar,
        red_social_lugar,
        tipo_entrada_lugar,
        id,
      ]
    );

    return { affectedRows: result.affectedRows };
  },

  // 🔹 Actualizar imagen del lugar
  actualizarImagenLugar: async (id, imagen_lugar) => {
    const [result] = await db.query(
      "UPDATE lugar SET imagen_lugar = ? WHERE id_lugar = ?",
      [imagen_lugar, id]
    );
    return { affectedRows: result.affectedRows };
  },

  // 🔹 Eliminar un lugar
  eliminarLugar: async (id) => {
    const [result] = await db.query(
      "DELETE FROM lugar WHERE id_lugar = ?",
      [id]
    );
    return { affectedRows: result.affectedRows };
  },

  // 🔹 Buscar lugares por localidad específica
  buscarPorLocalidad: async (localidad) => {
    const [rows] = await db.query(
      "SELECT * FROM lugar WHERE localidad_lugar = ?",
      [localidad]
    );
    return rows;
  },

  // 🔹 Buscar lugares por tipo de entrada
  buscarPorTipoEntrada: async (tipo_entrada) => {
    const [rows] = await db.query(
      "SELECT * FROM lugar WHERE tipo_entrada_lugar = ?",
      [tipo_entrada]
    );
    return rows;
  },
};