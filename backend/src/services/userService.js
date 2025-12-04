import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

/**
 * 📌 Registrar un nuevo usuario
 */
export const registerUserService = async (userData) => {
  const {
    num_doc_usuario,
    nombre_usuario,
    apellido_usuario,
    correo_usuario,
    password_usuario,
    id_tipo_rolfk,
  } = userData;

  if (!correo_usuario || !password_usuario) {
    throw new Error("Correo y contraseña requeridos");
  }

  // Verificar correo único
  const [existingEmail] = await pool.query(
    "SELECT * FROM usuario WHERE correo_usuario = ?",
    [correo_usuario]
  );

  if (existingEmail.length > 0) {
    throw new Error("El correo ya está registrado");
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password_usuario, 10);

  // Insertar usuario
  const [result] = await pool.query(
    `INSERT INTO usuario 
    (num_doc_usuario, nombre_usuario, apellido_usuario, correo_usuario, password_usuario, id_tipo_rolfk)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      num_doc_usuario,
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      hashedPassword,
      id_tipo_rolfk,
    ]
  );

  return {
    id_usuario: result.insertId,
    message: "Usuario registrado correctamente",
  };
};

/**
 * 📌 Login de usuario
 */
export const loginUserService = async (correo_usuario, password_usuario) => {
  if (!correo_usuario || !password_usuario) {
    throw new Error("Correo y contraseña requeridos");
  }

  const [rows] = await pool.query(
    "SELECT * FROM usuario WHERE correo_usuario = ?",
    [correo_usuario]
  );

  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password_usuario, user.password_usuario);

  if (!isMatch) {
    throw new Error("Contraseña incorrecta");
  }

  return {
    id_usuario: user.id_usuario,
    nombre_usuario: user.nombre_usuario,
    correo_usuario: user.correo_usuario,
    id_tipo_rolfk: user.id_tipo_rolfk,
  };
};
