// controllers/userAdminController.js
import { db } from "../Server.js";

// ✅ Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id_usuario, num_doc_usuario, nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, edad_usuario, genero_usuario, estado_usuario, id_tipo_rolfk 
      FROM usuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ✅ Actualizar usuario (solo admin)
export const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, estado_usuario, id_tipo_rolfk } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE usuario 
       SET nombre_usuario=?, apellido_usuario=?, correo_usuario=?, telefono_usuario=?, estado_usuario=?, id_tipo_rolfk=? 
       WHERE id_usuario=?`,
      [nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, estado_usuario, id_tipo_rolfk, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ✅ Eliminar usuario (solo admin)
export const deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
