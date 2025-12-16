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

    // Insertar usuario en DB (con nuevas columnas por defecto)
    const [result] = await pool.query(
      `INSERT INTO usuario 
        (num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, estado_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk, login_attempts, account_locked, lock_until) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        0,        // login_attempts inicial en 0
        false,    // account_locked inicial en false
        null      // lock_until inicial en null
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

    // ===== VERIFICAR SI LA CUENTA ESTÁ BLOQUEADA =====
    if (user.account_locked && user.lock_until) {
      const now = new Date();
      const lockUntil = new Date(user.lock_until);
      
      if (now < lockUntil) {
        // Calcular tiempo restante en minutos
        const remainingMinutes = Math.ceil((lockUntil - now) / (1000 * 60));
        throw new Error(`Cuenta bloqueada temporalmente. Intenta nuevamente en ${remainingMinutes} minutos.`);
      } else {
        // Desbloquear cuenta si ya pasó el tiempo
        await pool.query(
          `UPDATE usuario 
           SET account_locked = FALSE, lock_until = NULL, login_attempts = 0 
           WHERE id_usuario = ?`,
          [user.id_usuario]
        );
      }
    }

    // ===== VERIFICAR CONTRASEÑA =====
    const isMatch = await bcrypt.compare(password_usuario, user.password_usuario);
    
    if (!isMatch) {
      // Incrementar intentos fallidos
      const newAttempts = user.login_attempts + 1;
      
      if (newAttempts >= 3) {
        // Bloquear cuenta por 15 minutos
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        
        await pool.query(
          `UPDATE usuario 
           SET login_attempts = ?, account_locked = TRUE, lock_until = ? 
           WHERE id_usuario = ?`,
          [newAttempts, lockUntil, user.id_usuario]
        );
        
        throw new Error("Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.");
      } else {
        // Solo incrementar intentos
        await pool.query(
          `UPDATE usuario SET login_attempts = ? WHERE id_usuario = ?`,
          [newAttempts, user.id_usuario]
        );
        
        throw new Error(`Contraseña incorrecta. Intentos restantes: ${3 - newAttempts}`);
      }
    }

    // ===== LOGIN EXITOSO =====
    // Resetear intentos fallidos
    if (user.login_attempts > 0) {
      await pool.query(
        `UPDATE usuario SET login_attempts = 0 WHERE id_usuario = ?`,
        [user.id_usuario]
      );
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
       SET password_usuario = ?, reset_token = NULL, reset_token_expiration = NULL,
           login_attempts = 0, account_locked = FALSE, lock_until = NULL 
       WHERE id_usuario = ?`,
      [hashedPassword, userId]
    );
  },

  // ===== FUNCIÓN PARA DESBLOQUEAR CUENTA MANUALMENTE (opcional) =====
  async unlockAccount(userId) {
    await pool.query(
      `UPDATE usuario 
       SET account_locked = FALSE, lock_until = NULL, login_attempts = 0 
       WHERE id_usuario = ?`,
      [userId]
    );
  },

  // ===== FUNCIÓN PARA OBTENER ESTADO DE BLOQUEO =====
  async getLockStatus(userId) {
    const [rows] = await pool.query(
      `SELECT login_attempts, account_locked, lock_until FROM usuario WHERE id_usuario = ?`,
      [userId]
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
};