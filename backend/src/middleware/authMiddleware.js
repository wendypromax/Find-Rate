// src/middleware/authMiddleware.js - VERSIÓN COMPLETA CON BLACKLIST
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';
import { pool as db } from '../config/db.js';
import crypto from 'crypto';

// Middleware para verificar token de acceso CON BLACKLIST
export const verifyToken = async (req, res, next) => {
  console.log('🔐 MIDDLEWARE: Verificando token...');
  
  // Obtener token del header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ MIDDLEWARE: Token no proporcionado');
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no proporcionado.",
      errorType: "no_token_provided"
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // ========== PASO 1: Verificar token JWT ==========
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    console.log('✅ MIDDLEWARE: Token JWT válido para usuario:', decoded.email);
    
    // ========== PASO 2: Verificar si token está en blacklist ==========
    console.log('🔍 MIDDLEWARE: Verificando blacklist...');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const [invalidatedRows] = await db.query(
      "SELECT id, invalidated_at, reason FROM invalidated_tokens WHERE token_hash = ?",
      [tokenHash]
    );
    
    if (invalidatedRows.length > 0) {
      const invalidated = invalidatedRows[0];
      console.log(`❌ MIDDLEWARE: Token invalidado el ${invalidated.invalidated_at} - Razón: ${invalidated.reason}`);
      
      return res.status(401).json({
        success: false,
        message: "Token ha sido invalidado. Por favor inicia sesión nuevamente.",
        errorType: "token_invalidated",
        invalidated_at: invalidated.invalidated_at,
        reason: invalidated.reason
      });
    }
    
    // ========== PASO 3: Verificar si usuario existe ==========
    console.log('👤 MIDDLEWARE: Verificando usuario en base de datos...');
    const [userRows] = await db.query(
      "SELECT id_usuario, estado_usuario, account_locked FROM usuario WHERE id_usuario = ?",
      [decoded.userId]
    );
    
    if (userRows.length === 0) {
      console.log('❌ MIDDLEWARE: Usuario no encontrado en BD');
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado en el sistema.",
        errorType: "user_not_found"
      });
    }
    
    const user = userRows[0];
    
    // Verificar si la cuenta está bloqueada
    if (user.account_locked) {
      console.log('❌ MIDDLEWARE: Cuenta bloqueada');
      return res.status(423).json({
        success: false,
        message: "Tu cuenta está bloqueada por seguridad.",
        errorType: "account_locked"
      });
    }
    
    // Verificar si la cuenta está activa
    if (user.estado_usuario !== 'activo') {
      console.log('❌ MIDDLEWARE: Cuenta inactiva');
      return res.status(403).json({
        success: false,
        message: "Tu cuenta no está activa.",
        errorType: "account_inactive"
      });
    }
    
    // ========== PASO 4: Token válido - continuar ==========
    console.log('✅ MIDDLEWARE: Todas las verificaciones pasadas');
    
    // Agregar información del usuario al request
    req.user = {
      ...decoded,
      dbUser: {
        id_usuario: user.id_usuario,
        estado_usuario: user.estado_usuario,
        account_locked: user.account_locked
      }
    };
    
    next();
    
  } catch (error) {
    console.error('❌ MIDDLEWARE: Error verificando token:', error.message);
    
    // Manejar diferentes tipos de errores JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado. Usa el refresh token para obtener uno nuevo.",
        errorType: "token_expired",
        expiredAt: error.expiredAt
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido o malformado.",
        errorType: "invalid_token"
      });
    }
    
    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: "Token no válido aún.",
        errorType: "token_not_active"
      });
    }
    
    // Error de base de datos o otro error
    console.error('💥 MIDDLEWARE: Error inesperado:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno al verificar autenticación.",
      errorType: "server_error"
    });
  }
};

// Middleware para verificar rol de administrador
export const verifyAdmin = (req, res, next) => {
  console.log('👑 MIDDLEWARE: Verificando rol de administrador...');
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
      errorType: "not_authenticated"
    });
  }
  
  // Asumiendo que role 3 es administrador (según tu tabla tipo_rol)
  if (req.user.role !== 3) {
    console.log('❌ MIDDLEWARE: Usuario no es administrador. Role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador.",
      errorType: "insufficient_permissions",
      requiredRole: 3,
      userRole: req.user.role
    });
  }
  
  console.log('✅ MIDDLEWARE: Usuario es administrador');
  next();
};

// Middleware para verificar rol de empresario
export const verifyEmpresario = (req, res, next) => {
  console.log('🏢 MIDDLEWARE: Verificando rol de empresario...');
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
      errorType: "not_authenticated"
    });
  }
  
  // Role 2 es empresario (según tu tabla tipo_rol)
  if (req.user.role !== 2) {
    console.log('❌ MIDDLEWARE: Usuario no es empresario. Role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de empresario.",
      errorType: "insufficient_permissions",
      requiredRole: 2,
      userRole: req.user.role
    });
  }
  
  console.log('✅ MIDDLEWARE: Usuario es empresario');
  next();
};

// Middleware para limpiar tokens expirados de la blacklist (opcional, para mantenimiento)
export const cleanupExpiredTokens = async () => {
  try {
    // Eliminar tokens invalidados hace más de 7 días
    const [result] = await db.query(
      "DELETE FROM invalidated_tokens WHERE invalidated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    
    if (result.affectedRows > 0) {
      console.log(`🧹 MIDDLEWARE: Limpiados ${result.affectedRows} tokens expirados de la blacklist`);
    }
    
    return result.affectedRows;
  } catch (error) {
    console.error('❌ MIDDLEWARE: Error limpiando tokens expirados:', error);
    return 0;
  }
};

// Ejecutar limpieza periódica (opcional)
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000); // Cada 24 horas