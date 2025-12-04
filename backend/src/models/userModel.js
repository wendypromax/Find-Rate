import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const UserModel = {
  // ===== Registro de usuario =====
  async register(data) {
    const {
      num_doc_usuario,
      nombre_usuario,
      apellido_usuario,
      telefono_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario = "activo",
      edad_usuario = 0,
      genero_usuario,
      id_tipo_rolfk = null,
    } = data;

    if (!correo_usuario || !password_usuario) {
      throw new Error("Correo y contraseña requeridos");
    }

    // Verificar si el correo ya existe
    const [existingEmail] = await pool.query(
      "SELECT * FROM usuario WHERE correo_usuario = ?",
      [correo_usuario]
    );
    if (existingEmail.length > 0) {
      throw new Error("El correo ya está registrado");
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password_usuario, 10);

    // Insertar usuario en DB
    const [result] = await pool.query(
      `INSERT INTO usuario 
        (num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, estado_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        num_doc_usuario,
        nombre_usuario,
        apellido_usuario,
        telefono_usuario,
        correo_usuario,
        estado_usuario,
        hashedPassword,
        edad_usuario,
        genero_usuario,
        id_tipo_rolfk,
      ]
    );

    return { id_usuario: result.insertId };
  },

  // ===== Login de usuario =====
  async login(correo_usuario, password_usuario) {
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
      num_doc_usuario: user.num_doc_usuario,
      nombre_usuario: user.nombre_usuario,
      apellido_usuario: user.apellido_usuario,
      telefono_usuario: user.telefono_usuario,
      correo_usuario: user.correo_usuario,
      estado_usuario: user.estado_usuario,
      edad_usuario: user.edad_usuario,
      genero_usuario: user.genero_usuario,
      id_tipo_rolfk: user.id_tipo_rolfk,
    };
  },

  // ===== Generar token seguro para reset password =====
  async setResetToken(correo_usuario) {
    const token = crypto.randomBytes(32).toString("hex");
    await pool.query(
      `UPDATE usuario 
       SET reset_token = ?, reset_token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) 
       WHERE correo_usuario = ?`,
      [token, correo_usuario]
    );
    return token;
  },

  // ===== Obtener usuario por token de recuperación =====
  async getUserByToken(token) {
    const [rows] = await pool.query(
      `SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expiration > NOW()`,
      [token]
    );
    if (rows.length === 0) return null;
    return rows[0];
  },

  // ===== Actualizar contraseña =====
  async updatePassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `UPDATE usuario 
       SET password_usuario = ?, reset_token = NULL, reset_token_expiration = NULL 
       WHERE id_usuario = ?`,
      [hashedPassword, userId]
    );
  },
};
