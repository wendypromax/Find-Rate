// backend/src/controllers/authController.js
import { pool as db } from "../config/db.js";
import bcrypt from "bcryptjs";

// 🧩 Registro de usuario
export const registerUser = async (req, res) => {
  const {
    num_doc_usuario,
    nombre_usuario,
    apellido_usuario,
    telefono_usuario,
    correo_usuario,
    password_usuario,
    edad_usuario,
    genero_usuario,
    id_tipo_rolfk,
  } = req.body;

  try {
    if (!num_doc_usuario || !nombre_usuario || !apellido_usuario || !correo_usuario || !password_usuario) {
      return res.status(400).json({ message: "Por favor completa todos los campos obligatorios." });
    }

    const [existing] = await db.query(
      "SELECT * FROM usuario WHERE num_doc_usuario = ? OR correo_usuario = ?",
      [num_doc_usuario, correo_usuario]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "El número de documento o correo ya están registrados." });
    }

    const hashedPassword = await bcrypt.hash(password_usuario, 10);

    await db.query(
      `INSERT INTO usuario 
        (num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, estado_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk, reset_token, reset_token_expiration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        num_doc_usuario,
        nombre_usuario,
        apellido_usuario,
        telefono_usuario,
        correo_usuario,
        "activo",
        hashedPassword,
        edad_usuario || null,
        genero_usuario || null,
        id_tipo_rolfk || 2,
        null,
        null,
      ]
    );

    res.status(201).json({ message: "Usuario registrado correctamente 🎉" });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// 🧩 Inicio de sesión
export const loginUser = async (req, res) => {
  const { correo_usuario, password_usuario } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo_usuario = ?", [correo_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password_usuario, user.password_usuario);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json({
      message: "Inicio de sesión exitoso ✅",
      user: {
        id_usuario: user.id_usuario,
        num_doc_usuario: user.num_doc_usuario,
        nombre_usuario: user.nombre_usuario,
        apellido_usuario: user.apellido_usuario,
        correo_usuario: user.correo_usuario,
        telefono_usuario: user.telefono_usuario,
        edad_usuario: user.edad_usuario,
        genero_usuario: user.genero_usuario,
        id_tipo_rolfk: user.id_tipo_rolfk,
        estado_usuario: user.estado_usuario,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// 🧩 Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// 🧩 Actualizar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, edad_usuario, genero_usuario, estado_usuario } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE usuario 
       SET num_doc_usuario = ?, nombre_usuario = ?, apellido_usuario = ?, telefono_usuario = ?, correo_usuario = ?, edad_usuario = ?, genero_usuario = ?, estado_usuario = ?
       WHERE id_usuario = ?`,
      [num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, edad_usuario, genero_usuario, estado_usuario, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// 🧩 Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};