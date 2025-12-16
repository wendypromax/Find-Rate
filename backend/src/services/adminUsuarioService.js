import { pool } from "../config/db.js";

// 🔹 Obtener todos los usuarios
export const obtenerUsuariosService = async () => {
  const [rows] = await pool.query(`
    SELECT 
      u.id_usuario,
      u.nombre_usuario,
      u.apellido_usuario,
      u.correo_usuario,
      u.estado_usuario,
      u.id_tipo_rolfk
    FROM usuario u
  `);
  return rows;
};

// 🔹 Cambiar estado (activar / desactivar)
export const cambiarEstadoUsuarioService = async (id, estado) => {
  await pool.query(
    "UPDATE usuario SET estado_usuario = ? WHERE id_usuario = ?",
    [estado, id]
  );
};

// 🔹 Cambiar rol
export const cambiarRolUsuarioService = async (id, idRol) => {
  await pool.query(
    "UPDATE usuario SET id_tipo_rolfk = ? WHERE id_usuario = ?",
    [idRol, id]
  );
};

// 🔹 Eliminar usuario
export const eliminarUsuarioService = async (id) => {
  await pool.query(
    "DELETE FROM usuario WHERE id_usuario = ?",
    [id]
  );
};
