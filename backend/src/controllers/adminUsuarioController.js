import {
  obtenerUsuariosService,
  cambiarEstadoUsuarioService,
  cambiarRolUsuarioService,
  eliminarUsuarioService
} from "../services/adminUsuarioService.js";

import db from "../config/db.js"; // ✅ IMPORTANTE para el SET

// 🔹 Listar usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosService();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// 🔹 Activar / desactivar usuario (AUDITORÍA)
export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: "Estado requerido" });
    }

    // ✅ PASO 2 — definir admin que realiza la acción
    const idAdmin = req.user?.id || 1; // usa JWT o 1 para pruebas
    await db.query("SET @usuario_actual = ?", [idAdmin]);

    await cambiarEstadoUsuarioService(id, estado);

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar estado" });
  }
};

// 🔹 Cambiar rol (AUDITORÍA)
export const cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_tipo_rolfk } = req.body;

    if (!id_tipo_rolfk) {
      return res.status(400).json({ message: "Rol requerido" });
    }

    // ✅ PASO 2 — definir admin
    const idAdmin = req.user?.id || 1;
    await db.query("SET @usuario_actual = ?", [idAdmin]);

    await cambiarRolUsuarioService(id, id_tipo_rolfk);

    res.json({ message: "Rol actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar rol" });
  }
};

// 🔹 Eliminar usuario (AUDITORÍA)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ PASO 2 — definir admin
    const idAdmin = req.user?.id || 1;
    await db.query("SET @usuario_actual = ?", [idAdmin]);

    await eliminarUsuarioService(id);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
