// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';

// Middleware para verificar token de acceso
export const verifyToken = (req, res, next) => {
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
    // Verificar token
    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    console.log('✅ MIDDLEWARE: Token válido para usuario:', decoded.email);
    
    // Agregar información del usuario al request
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('❌ MIDDLEWARE: Error verificando token:', error.message);
    
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
  
  // Asumiendo que role 1 es administrador
  if (req.user.role !== 1) {
    console.log('❌ MIDDLEWARE: Usuario no es administrador. Role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador.",
      errorType: "insufficient_permissions"
    });
  }
  
  console.log('✅ MIDDLEWARE: Usuario es administrador');
  next();
};