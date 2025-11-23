// backend/controllers/favoritosController.js
import { pool as db } from "../db.js";

// Obtener TODOS los favoritos (global)
export const getFavoritos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM favoritos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};

export const getFavoritoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM favoritos WHERE id_favorito = ?", [id]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favorito" });
  }
};

export const createFavorito = async (req, res) => {
  try {
    const { id_usuario, id_lugar } = req.body;
    await db.query(
      "INSERT INTO favoritos (id_usuariofk, id_lugarfk) VALUES (?, ?)", // Cambié los nombres de columnas
      [id_usuario, id_lugar]
    );
    res.json({ message: "Favorito creado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear favorito" });
  }
};

export const updateFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_lugar } = req.body;
    await db.query(
      "UPDATE favoritos SET id_usuariofk=?, id_lugarfk=? WHERE id_favorito=?", // Cambié los nombres de columnas
      [id_usuario, id_lugar, id]
    );
    res.json({ message: "Favorito actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
};

export const deleteFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM favoritos WHERE id_favorito=?", [id]);
    res.json({ message: "Favorito eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
};

// =====================================================
// === CONTROLADORES ESPECIALES POR USUARIO/LUGAR ======
// =====================================================

// Obtener favoritos de un usuario
export const getFavoritosByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const [rows] = await db.query(`
      SELECT l.* 
      FROM lugar l  -- ✅ CAMBIÉ "lugares" por "lugar"
      INNER JOIN favoritos f ON l.id_lugar = f.id_lugarfk  -- ✅ CAMBIÉ "id_lugar" por "id_lugarfk"
      WHERE f.id_usuariofk = ?  -- ✅ CAMBIÉ "id_usuario" por "id_usuariofk"
    `, [idUsuario]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritos del usuario" });
  }
};

// Verificar si un lugar es favorito
export const verificarFavorito = async (req, res) => {
  try {
    const { idUsuario, idLugar } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM favoritos WHERE id_usuariofk = ? AND id_lugarfk = ?", // ✅ CAMBIÉ nombres de columnas
      [idUsuario, idLugar]
    );

    res.json({ esFavorito: rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar favorito" });
  }
};

// Agregar a favoritos
export const agregarFavorito = async (req, res) => {
  try {
    const { idUsuario, idLugar } = req.params;

    await db.query(
      "INSERT INTO favoritos (id_usuariofk, id_lugarfk) VALUES (?, ?)", // ✅ CAMBIÉ nombres de columnas
      [idUsuario, idLugar]
    );

    res.json({ message: "Lugar agregado a favoritos" });
  } catch (error) {
    console.error(error);
    
    // Si es error de duplicado (código MySQL para entrada duplicada)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El lugar ya está en favoritos" });
    }
    
    res.status(500).json({ error: "Error al agregar favorito" });
  }
};

// Eliminar de favoritos
export const eliminarFavorito = async (req, res) => {
  try {
    const { idUsuario, idLugar } = req.params;

    const [result] = await db.query(
      "DELETE FROM favoritos WHERE id_usuariofk = ? AND id_lugarfk = ?", // ✅ CAMBIÉ nombres de columnas
      [idUsuario, idLugar]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    res.json({ message: "Lugar eliminado de favoritos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
};