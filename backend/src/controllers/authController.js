// backend/src/controllers/authController.js - VERSIÓN COMPLETA CON JWT
import { pool as db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // <-- NUEVO: Importar JWT
import emailController from "./emailController.js";

// Configuración JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'findyrate_super_secret_key_2024_change_me',
  accessTokenExpiresIn: '15m',    // Token de acceso expira en 15 minutos
  refreshTokenExpiresIn: '7d',    // Refresh token expira en 7 días
  resetTokenExpiresIn: '1h'       // Token de reseteo expira en 1 hora
};

// Función auxiliar para crear columnas si no existen
const ensureSecurityColumns = async () => {
  try {
    // Verificar y crear columnas si no existen
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'usuario'
        AND COLUMN_NAME IN ('login_attempts', 'account_locked', 'lock_until', 'refresh_token')
    `);
    
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    
    if (!existingColumns.includes('login_attempts')) {
      await db.query(`ALTER TABLE usuario ADD COLUMN login_attempts INT DEFAULT 0`);
      console.log('✅ Columna login_attempts creada');
    }
    
    if (!existingColumns.includes('account_locked')) {
      await db.query(`ALTER TABLE usuario ADD COLUMN account_locked BOOLEAN DEFAULT FALSE`);
      console.log('✅ Columna account_locked creada');
    }
    
    if (!existingColumns.includes('lock_until')) {
      await db.query(`ALTER TABLE usuario ADD COLUMN lock_until DATETIME NULL`);
      console.log('✅ Columna lock_until creada');
    }
    
    if (!existingColumns.includes('refresh_token')) {
      await db.query(`ALTER TABLE usuario ADD COLUMN refresh_token TEXT NULL`);
      console.log('✅ Columna refresh_token creada');
    }
    
    return true;
  } catch (error) {
    console.warn('⚠️ Advertencia en ensureSecurityColumns:', error.message);
    return false;
  }
};

// 🧩 Registro de usuario
export const registerUser = async (req, res) => {
  console.log('📝 REGISTER: Iniciando registro de usuario...');
  
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

  console.log('📨 REGISTER: Datos recibidos:', { 
    nombre: nombre_usuario, 
    email: correo_usuario 
  });

  try {
    // Validación de campos obligatorios
    if (!num_doc_usuario || !nombre_usuario || !apellido_usuario || !correo_usuario || !password_usuario) {
      return res.status(400).json({ message: "Por favor completa todos los campos obligatorios." });
    }

    // Verificar si el usuario ya existe
    const [existing] = await db.query(
      "SELECT * FROM usuario WHERE num_doc_usuario = ? OR correo_usuario = ?",
      [num_doc_usuario, correo_usuario]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "El número de documento o correo ya están registrados." });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password_usuario, 10);
    console.log('🔐 REGISTER: Contraseña hasheada');

    // Asegurar columnas de seguridad
    await ensureSecurityColumns();

    // Insertar usuario en la base de datos
    const [result] = await db.query(
      `INSERT INTO usuario 
        (num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, estado_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk, reset_token, reset_token_expiration, login_attempts, account_locked, lock_until, refresh_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        0,      // login_attempts inicial
        false,  // account_locked inicial
        null,   // lock_until inicial
        null    // refresh_token inicial
      ]
    );

    console.log('✅ REGISTER: Usuario insertado en DB, ID:', result.insertId);

    // Obtener el usuario recién creado
    const [newUserRows] = await db.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [result.insertId]
    );

    if (newUserRows.length === 0) {
      return res.status(500).json({ message: "Error al recuperar usuario creado" });
    }

    const newUser = newUserRows[0];
    console.log('👤 REGISTER: Usuario creado:', newUser.correo_usuario);

    // ✅ ENVIAR EMAIL DE BIENVENIDA
    console.log('📧 REGISTER: Intentando enviar email de bienvenida...');
    
    emailController.sendWelcomeEmail(newUser)
      .then(emailResult => {
        if (emailResult.success) {
          console.log(`🎉 REGISTER: Email enviado exitosamente a ${newUser.correo_usuario}`);
        } else {
          console.warn(`⚠️ REGISTER: No se pudo enviar email: ${emailResult.error}`);
        }
      })
      .catch(err => {
        console.error('💥 REGISTER: Error inesperado enviando email:', err);
      });

    // Responder al cliente
    res.status(201).json({ 
      message: "Usuario registrado correctamente 🎉. Revisa tu email para el mensaje de bienvenida.",
      user: {
        id_usuario: newUser.id_usuario,
        num_doc_usuario: newUser.num_doc_usuario,
        nombre_usuario: newUser.nombre_usuario,
        apellido_usuario: newUser.apellido_usuario,
        correo_usuario: newUser.correo_usuario,
        telefono_usuario: newUser.telefono_usuario,
        estado_usuario: newUser.estado_usuario
      }
    });

  } catch (error) {
    console.error("❌ REGISTER: Error completo:", error);
    res.status(500).json({ 
      message: "Error al registrar usuario",
      error: error.message 
    });
  }
};

// 🧩 Inicio de sesión CON BLOQUEO TEMPORAL Y JWT
export const loginUser = async (req, res) => {
  console.log('🔑 LOGIN: Iniciando proceso de login...');
  console.log('📧 Email recibido:', req.body.correo_usuario);
  
  const { correo_usuario, password_usuario } = req.body;

  try {
    // Validar datos de entrada
    if (!correo_usuario || !password_usuario) {
      console.log('❌ LOGIN: Faltan credenciales');
      return res.status(400).json({ 
        message: "Email y contraseña son requeridos",
        errorType: "missing_credentials"
      });
    }

    // Asegurar que las columnas de seguridad existen
    await ensureSecurityColumns();

    // Buscar usuario en la base de datos
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE correo_usuario = ?", 
      [correo_usuario]
    );

    if (rows.length === 0) {
      console.log(`❌ LOGIN: Usuario no encontrado - ${correo_usuario}`);
      return res.status(404).json({ 
        message: "Usuario no encontrado. Verifica tu email.",
        errorType: "user_not_found"
      });
    }

    const user = rows[0];
    console.log('👤 LOGIN: Usuario encontrado - ID:', user.id_usuario, 'Nombre:', user.nombre_usuario);
    console.log('📊 LOGIN: Estado actual - Intentos:', user.login_attempts || 0, 'Bloqueado:', user.account_locked || false);

    // ========== VERIFICACIÓN DE BLOQUEO TEMPORAL ==========
    if (user.account_locked && user.lock_until) {
      const now = new Date();
      const lockUntil = new Date(user.lock_until);
      
      console.log('🔒 LOGIN: Verificando bloqueo - Ahora:', now, 'Bloqueo hasta:', lockUntil);
      
      if (now < lockUntil) {
        // Cuenta aún está bloqueada
        const remainingMilliseconds = lockUntil - now;
        const remainingMinutes = Math.ceil(remainingMilliseconds / (1000 * 60));
        
        console.log(`🔒 LOGIN: Cuenta BLOQUEADA - Tiempo restante: ${remainingMinutes} minutos`);
        
        return res.status(423).json({ 
          message: `Tu cuenta está bloqueada por seguridad. Intenta nuevamente en ${remainingMinutes} minutos.`,
          errorType: "account_locked",
          locked: true,
          lock_until: user.lock_until,
          remaining_minutes: remainingMinutes,
          attempts: user.login_attempts || 0
        });
      } else {
        // Tiempo de bloqueo ha expirado - desbloquear cuenta
        console.log('🔓 LOGIN: Desbloqueando cuenta - Tiempo de bloqueo expirado');
        await db.query(
          `UPDATE usuario 
           SET account_locked = FALSE, 
               lock_until = NULL, 
               login_attempts = 0 
           WHERE id_usuario = ?`,
          [user.id_usuario]
        );
        // Actualizar objeto usuario local
        user.account_locked = false;
        user.lock_until = null;
        user.login_attempts = 0;
      }
    }

    // ========== VERIFICACIÓN DE CONTRASEÑA ==========
    console.log('🔐 LOGIN: Verificando contraseña...');
    const passwordMatch = await bcrypt.compare(password_usuario, user.password_usuario);

    if (!passwordMatch) {
      console.log('❌ LOGIN: Contraseña INCORRECTA');
      
      // Obtener intentos actuales (con valor por defecto si no existe)
      const currentAttempts = user.login_attempts || 0;
      const newAttempts = currentAttempts + 1;
      
      console.log(`📈 LOGIN: Intento fallido ${newAttempts} de 3`);
      
      // ========== BLOQUEO POR 3 INTENTOS FALLIDOS ==========
      if (newAttempts >= 3) {
        console.log(`🚨 LOGIN: 3 INTENTOS FALLIDOS - BLOQUEANDO CUENTA`);
        
        // Configurar bloqueo por 15 minutos
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        
        console.log(`🔒 LOGIN: Bloqueando cuenta hasta: ${lockUntil}`);
        
        try {
          await db.query(
            `UPDATE usuario 
             SET login_attempts = ?, 
                 account_locked = TRUE, 
                 lock_until = ? 
             WHERE id_usuario = ?`,
            [newAttempts, lockUntil, user.id_usuario]
          );
          
          console.log('✅ LOGIN: Cuenta BLOQUEADA exitosamente en la base de datos');
          
          return res.status(401).json({ 
            message: "Demasiados intentos fallidos. Por seguridad, tu cuenta ha sido bloqueada por 15 minutos.",
            errorType: "account_locked",
            attempts: newAttempts,
            locked: true,
            lock_until: lockUntil,
            remaining_minutes: 15
          });
        } catch (updateError) {
          console.error('💥 LOGIN: Error al bloquear cuenta:', updateError);
          return res.status(500).json({ 
            message: "Error interno al procesar el bloqueo de cuenta",
            errorType: "server_error"
          });
        }
      } else {
        // ========== INCREMENTAR INTENTOS FALLIDOS ==========
        console.log(`📊 LOGIN: Incrementando intentos a ${newAttempts}`);
        
        try {
          await db.query(
            `UPDATE usuario SET login_attempts = ? WHERE id_usuario = ?`,
            [newAttempts, user.id_usuario]
          );
          
          const remainingAttempts = 3 - newAttempts;
          console.log(`⚠️ LOGIN: Intentos restantes: ${remainingAttempts}`);
          
          const errorMessages = {
            2: "Contraseña incorrecta. Te quedan 2 intentos antes de que tu cuenta sea bloqueada.",
            1: "Contraseña incorrecta. Último intento disponible antes del bloqueo de cuenta."
          };
          
          return res.status(401).json({ 
            message: errorMessages[remainingAttempts] || "Contraseña incorrecta.",
            errorType: "invalid_credentials",
            attempts: newAttempts,
            remaining: remainingAttempts
          });
        } catch (updateError) {
          console.error('💥 LOGIN: Error al actualizar intentos:', updateError);
          return res.status(401).json({ 
            message: "Contraseña incorrecta",
            errorType: "invalid_credentials"
          });
        }
      }
    }

    // ========== LOGIN EXITOSO ==========
    console.log('✅ LOGIN: Contraseña CORRECTA - Acceso concedido');
    
    // Resetear intentos fallidos si existían
    if (user.login_attempts > 0) {
      console.log('🔄 LOGIN: Reseteando intentos fallidos previos');
      await db.query(
        `UPDATE usuario SET login_attempts = 0 WHERE id_usuario = ?`,
        [user.id_usuario]
      );
    }

    // ========== GENERAR TOKENS JWT ==========
    console.log('🔐 LOGIN: Generando tokens JWT...');

    // 1. Generar Access Token (expira en 15 minutos)
    const accessToken = jwt.sign(
      {
        userId: user.id_usuario,
        email: user.correo_usuario,
        name: user.nombre_usuario,
        role: user.id_tipo_rolfk
      },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.accessTokenExpiresIn }
    );

    // 2. Generar Refresh Token (expira en 7 días)
    const refreshToken = jwt.sign(
      { userId: user.id_usuario },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.refreshTokenExpiresIn }
    );

    console.log('✅ LOGIN: Tokens generados exitosamente');

    // 3. Guardar refresh token en la base de datos
    try {
      await db.query(
        `UPDATE usuario SET refresh_token = ? WHERE id_usuario = ?`,
        [refreshToken, user.id_usuario]
      );
      console.log('💾 LOGIN: Refresh token guardado en base de datos');
    } catch (tokenError) {
      console.warn('⚠️ LOGIN: No se pudo guardar refresh token en BD:', tokenError.message);
    }

    // Preparar datos del usuario para respuesta
    const userResponse = {
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
      login_attempts: 0,
      account_locked: false
    };

    console.log(`🎉 LOGIN: Sesión iniciada exitosamente para ${user.nombre_usuario}`);

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso. ¡Bienvenido!",
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
        accessTokenExpiresIn: JWT_CONFIG.accessTokenExpiresIn,
        refreshTokenExpiresIn: JWT_CONFIG.refreshTokenExpiresIn,
        accessTokenExpiresAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutos
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString() // 7 días
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("💥 LOGIN: Error crítico en el proceso:", error);
    return res.status(500).json({ 
      message: "Error interno del servidor al procesar tu solicitud",
      errorType: "server_error",
      timestamp: new Date().toISOString()
    });
  }
};

// 🧩 FUNCIÓN PARA REFRESCAR TOKEN
export const refreshAccessToken = async (req, res) => {
  console.log('🔄 REFRESH TOKEN: Refrescando token de acceso...');
  
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token es requerido",
      errorType: "missing_refresh_token"
    });
  }
  
  try {
    // Verificar el refresh token
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.secret);
    
    // Verificar si el token existe en la base de datos (seguridad adicional)
    const [rows] = await db.query(
      "SELECT id_usuario, correo_usuario, nombre_usuario, id_tipo_rolfk FROM usuario WHERE id_usuario = ? AND refresh_token = ?",
      [decoded.userId, refreshToken]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Refresh token inválido o expirado",
        errorType: "invalid_refresh_token"
      });
    }
    
    const user = rows[0];
    
    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id_usuario,
        email: user.correo_usuario,
        name: user.nombre_usuario,
        role: user.id_tipo_rolfk
      },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.accessTokenExpiresIn }
    );
    
    console.log('✅ REFRESH TOKEN: Nuevo access token generado para:', user.correo_usuario);
    
    res.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: JWT_CONFIG.accessTokenExpiresIn,
      expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutos
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ REFRESH TOKEN: Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Refresh token expirado. Por favor inicia sesión nuevamente.",
        errorType: "refresh_token_expired"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Refresh token inválido",
      errorType: "invalid_token"
    });
  }
};

// 🧩 FUNCIÓN PARA LOGOUT
export const logoutUser = async (req, res) => {
  const { userId, refreshToken } = req.body;
  
  console.log('🚪 LOGOUT: Cerrando sesión para usuario ID:', userId);
  
  try {
    if (refreshToken && userId) {
      // Invalidar el refresh token en la base de datos
      await db.query(
        "UPDATE usuario SET refresh_token = NULL WHERE id_usuario = ? AND refresh_token = ?",
        [userId, refreshToken]
      );
      console.log('✅ LOGOUT: Refresh token invalidado');
    }
    
    res.json({
      success: true,
      message: "Sesión cerrada exitosamente",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ LOGOUT: Error:', error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
      errorType: "server_error"
    });
  }
};

// 🧩 Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log('👤 GET USER BY ID: Buscando usuario ID:', id);
  
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    
    if (rows.length === 0) {
      console.log('❌ GET USER BY ID: Usuario no encontrado ID:', id);
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }
    
    // Ocultar información sensible
    const user = rows[0];
    const { password_usuario, reset_token, refresh_token, ...safeUser } = user;
    
    console.log('✅ GET USER BY ID: Usuario encontrado:', safeUser.nombre_usuario);
    res.json({
      success: true,
      user: safeUser
    });
    
  } catch (error) {
    console.error("❌ GET USER BY ID: Error completo:", error);
    res.status(500).json({ 
      message: "Error al obtener información del usuario",
      errorType: "server_error"
    });
  }
};

// 🧩 Actualizar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { 
    num_doc_usuario, 
    nombre_usuario, 
    apellido_usuario, 
    telefono_usuario, 
    correo_usuario, 
    edad_usuario, 
    genero_usuario, 
    estado_usuario 
  } = req.body;

  console.log('✏️ UPDATE USER: Actualizando usuario ID:', id);
  console.log('📝 UPDATE USER: Datos a actualizar:', { 
    nombre: nombre_usuario, 
    email: correo_usuario 
  });

  try {
    const [result] = await db.query(
      `UPDATE usuario 
       SET num_doc_usuario = ?, 
           nombre_usuario = ?, 
           apellido_usuario = ?, 
           telefono_usuario = ?, 
           correo_usuario = ?, 
           edad_usuario = ?, 
           genero_usuario = ?, 
           estado_usuario = ?
       WHERE id_usuario = ?`,
      [num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, edad_usuario, genero_usuario, estado_usuario, id]
    );

    if (result.affectedRows === 0) {
      console.log('❌ UPDATE USER: Usuario no encontrado ID:', id);
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }

    console.log('✅ UPDATE USER: Usuario actualizado correctamente ID:', id);
    res.json({ 
      success: true,
      message: "Perfil actualizado correctamente ✅",
      updatedId: id
    });
    
  } catch (error) {
    console.error("❌ UPDATE USER: Error completo:", error);
    res.status(500).json({ 
      message: "Error al actualizar el perfil del usuario",
      errorType: "server_error"
    });
  }
};

// 🧩 Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log('🗑️ DELETE USER: Eliminando usuario ID:', id);
  
  try {
    const [result] = await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ DELETE USER: Usuario no encontrado ID:', id);
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }
    
    console.log('✅ DELETE USER: Usuario eliminado correctamente ID:', id);
    res.json({ 
      success: true,
      message: "Usuario eliminado del sistema correctamente ✅"
    });
    
  } catch (error) {
    console.error("❌ DELETE USER: Error completo:", error);
    res.status(500).json({ 
      message: "Error al eliminar el usuario",
      errorType: "server_error"
    });
  }
};

// 🧩 FUNCIÓN ADICIONAL: Desbloquear cuenta manualmente (para admin)
export const unlockAccount = async (req, res) => {
  const { id } = req.params;
  console.log('🔓 UNLOCK ACCOUNT: Desbloqueando cuenta ID:', id);
  
  try {
    // Asegurar columnas de seguridad
    await ensureSecurityColumns();
    
    const [result] = await db.query(
      `UPDATE usuario 
       SET account_locked = FALSE, 
           lock_until = NULL, 
           login_attempts = 0 
       WHERE id_usuario = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      console.log('❌ UNLOCK ACCOUNT: Usuario no encontrado ID:', id);
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }
    
    console.log('✅ UNLOCK ACCOUNT: Cuenta desbloqueada ID:', id);
    res.json({ 
      success: true,
      message: "Cuenta desbloqueada correctamente ✅",
      unlocked: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ UNLOCK ACCOUNT: Error completo:", error);
    res.status(500).json({ 
      message: "Error al desbloquear la cuenta",
      errorType: "server_error"
    });
  }
};

// 🧩 FUNCIÓN ADICIONAL: Ver estado de bloqueo
export const getLockStatus = async (req, res) => {
  const { id } = req.params;
  console.log('🔒 GET LOCK STATUS: Consultando estado ID:', id);
  
  try {
    // Asegurar columnas de seguridad
    await ensureSecurityColumns();
    
    const [rows] = await db.query(
      `SELECT 
         id_usuario, 
         correo_usuario, 
         nombre_usuario,
         login_attempts, 
         account_locked, 
         lock_until,
         estado_usuario
       FROM usuario WHERE id_usuario = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }
    
    const status = rows[0];
    
    // Calcular tiempo restante si está bloqueado
    let remaining_minutes = 0;
    let is_currently_locked = false;
    
    if (status.account_locked && status.lock_until) {
      const now = new Date();
      const lockUntil = new Date(status.lock_until);
      
      if (now < lockUntil) {
        remaining_minutes = Math.ceil((lockUntil - now) / (1000 * 60));
        is_currently_locked = true;
      } else {
        // Desbloquear automáticamente si el tiempo ya pasó
        await db.query(
          `UPDATE usuario 
           SET account_locked = FALSE, lock_until = NULL, login_attempts = 0 
           WHERE id_usuario = ?`,
          [id]
        );
        status.account_locked = false;
        status.lock_until = null;
        status.login_attempts = 0;
      }
    }
    
    res.json({
      success: true,
      user_id: status.id_usuario,
      email: status.correo_usuario,
      name: status.nombre_usuario,
      login_attempts: status.login_attempts || 0,
      account_locked: status.account_locked || false,
      lock_until: status.lock_until,
      remaining_minutes: remaining_minutes,
      is_currently_locked: is_currently_locked,
      account_status: status.estado_usuario,
      checked_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ GET LOCK STATUS: Error completo:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener estado de seguridad de la cuenta",
      errorType: "server_error"
    });
  }
};

// 🧩 FUNCIÓN ADICIONAL: Resetear intentos fallidos
export const resetLoginAttempts = async (req, res) => {
  const { id } = req.params;
  console.log('🔄 RESET LOGIN ATTEMPTS: Reseteando intentos para ID:', id);
  
  try {
    // Asegurar columnas de seguridad
    await ensureSecurityColumns();
    
    const [result] = await db.query(
      `UPDATE usuario 
       SET login_attempts = 0, 
           account_locked = FALSE, 
           lock_until = NULL 
       WHERE id_usuario = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) {
      console.log('❌ RESET LOGIN ATTEMPTS: Usuario no encontrado ID:', id);
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado",
        errorType: "user_not_found"
      });
    }
    
    console.log('✅ RESET LOGIN ATTEMPTS: Intentos reseteados ID:', id);
    res.json({ 
      success: true,
      message: "Contador de intentos fallidos reiniciado correctamente ✅",
      reset: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ RESET LOGIN ATTEMPTS: Error completo:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al reiniciar el contador de intentos",
      errorType: "server_error"
    });
  }
};

// 🧩 FUNCIÓN ADICIONAL: Verificar token (para middleware)
export const verifyTokenMiddleware = (req, res, next) => {
  console.log('🔐 TOKEN MIDDLEWARE: Verificando token...');
  
  // Obtener token del header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ TOKEN MIDDLEWARE: Token no proporcionado');
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no proporcionado.",
      errorType: "no_token_provided"
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    console.log('✅ TOKEN MIDDLEWARE: Token válido para usuario:', decoded.email);
    
    // Agregar información del usuario al request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('❌ TOKEN MIDDLEWARE: Error verificando token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado. Usa el refresh token para obtener uno nuevo.",
        errorType: "token_expired"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
        errorType: "invalid_token"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Token de autenticación inválido.",
      errorType: "authentication_failed"
    });
  }
};

// 🧩 FUNCIÓN ADICIONAL: Verificar si usuario está autenticado
export const checkAuthStatus = async (req, res) => {
  console.log('🔍 CHECK AUTH STATUS: Verificando estado de autenticación...');
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({
      authenticated: false,
      message: "No autenticado"
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    
    // Verificar si el usuario aún existe en la base de datos
    const [rows] = await db.query(
      "SELECT id_usuario, nombre_usuario, correo_usuario, id_tipo_rolfk FROM usuario WHERE id_usuario = ?",
      [decoded.userId]
    );
    
    if (rows.length === 0) {
      return res.status(200).json({
        authenticated: false,
        message: "Usuario no encontrado en la base de datos"
      });
    }
    
    const user = rows[0];
    
    res.json({
      authenticated: true,
      user: {
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        correo_usuario: user.correo_usuario,
        id_tipo_rolfk: user.id_tipo_rolfk
      },
      tokenInfo: {
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        issuedAt: new Date(decoded.iat * 1000).toISOString()
      }
    });
    
  } catch (error) {
    console.log('⚠️ CHECK AUTH STATUS: Token inválido o expirado:', error.message);
    res.status(200).json({
      authenticated: false,
      message: "Token inválido o expirado"
    });
  }
};