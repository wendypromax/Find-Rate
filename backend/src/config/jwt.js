// src/config/jwt.js
import dotenv from 'dotenv';
dotenv.config();

export const JWT_CONFIG = {
  // Usa una variable de entorno o una clave segura
  secret: process.env.JWT_SECRET || 'findyrate_super_secret_key_2024_change_me',
  
  // Token de acceso expira en 15 minutos (para seguridad)
  accessTokenExpiresIn: '15m',
  
  // Refresh token expira en 7 días
  refreshTokenExpiresIn: '7d',
  
  // Token de reseteo expira en 1 hora
  resetTokenExpiresIn: '1h'
};

// Función para generar token
export const generateToken = (payload, expiresIn = JWT_CONFIG.accessTokenExpiresIn) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, JWT_CONFIG.secret, { expiresIn });
};

// Función para verificar token
export const verifyToken = (token) => {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    return null;
  }
};