// src/routes/authRoutes.js - VERSIÓN COMPLETA CON TODAS LAS RUTAS
import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  unlockAccount,
  getLockStatus,
  refreshAccessToken,
  logoutUser,
  logoutAllSessions,
  verifyTokenMiddleware,
  checkAuthStatus,
  checkTokenBlacklist,
  resetLoginAttempts
} from "../controllers/authController.js";

import { verifyAdmin, verifyEmpresario } from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar nuevo usuario
 * @access  Público
 * @body    {num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk}
 */
router.post("/registro", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 * @body    {correo_usuario, password_usuario}
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refrescar token de acceso
 * @access  Público (pero requiere refresh token válido)
 * @body    {refreshToken}
 */
router.post("/refresh-token", refreshAccessToken);

/**
 * @route   GET /api/auth/check-status
 * @desc    Verificar estado de autenticación
 * @access  Público (pero requiere token para verificar)
 * @header  Authorization: Bearer {token}
 */
router.get("/check-status", checkAuthStatus);

// ============================================
// RUTAS DE AUTENTICACIÓN Y TOKENS
// ============================================

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (invalida tokens)
 * @access  Público (pero requiere tokens)
 * @body    {userId, refreshToken, accessToken}
 */
router.post("/logout", logoutUser);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Cerrar TODAS las sesiones del usuario
 * @access  Privado (requiere autenticación)
 * @header  Authorization: Bearer {token}
 * @body    {userId}
 */
router.post("/logout-all", verifyTokenMiddleware, logoutAllSessions);

// ============================================
// RUTAS PARA DEBUGGING (opcional, se pueden remover en producción)
// ============================================

/**
 * @route   POST /api/auth/check-blacklist
 * @desc    Verificar si un token está en la blacklist (para debugging)
 * @access  Público
 * @body    {token}
 */
router.post("/check-blacklist", checkTokenBlacklist);

// ============================================
// RUTAS CRUD DE USUARIO (requieren autenticación)
// ============================================

/**
 * @route   GET /api/auth/:id
 * @desc    Obtener información de usuario por ID
 * @access  Privado (solo el mismo usuario o admin)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 */
router.get("/:id", verifyTokenMiddleware, getUserById);

/**
 * @route   PUT /api/auth/:id
 * @desc    Actualizar información de usuario
 * @access  Privado (solo el mismo usuario o admin)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 * @body    Datos a actualizar
 */
router.put("/:id", verifyTokenMiddleware, updateUser);

/**
 * @route   DELETE /api/auth/:id
 * @desc    Eliminar usuario
 * @access  Privado (solo administrador)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 */
router.delete("/:id", verifyTokenMiddleware, verifyAdmin, deleteUser);

// ============================================
// RUTAS DE SEGURIDAD Y BLOQUEO (requieren autenticación)
// ============================================

/**
 * @route   PUT /api/auth/:id/unlock
 * @desc    Desbloquear cuenta de usuario
 * @access  Privado (solo administrador)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 */
router.put("/:id/unlock", verifyTokenMiddleware, verifyAdmin, unlockAccount);

/**
 * @route   GET /api/auth/:id/lock-status
 * @desc    Ver estado de bloqueo de cuenta
 * @access  Privado (solo administrador)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 */
router.get("/:id/lock-status", verifyTokenMiddleware, verifyAdmin, getLockStatus);

/**
 * @route   POST /api/auth/:id/reset-attempts
 * @desc    Resetear intentos de login fallidos
 * @access  Privado (solo administrador)
 * @header  Authorization: Bearer {token}
 * @params  {id} - ID del usuario
 */
router.post("/:id/reset-attempts", verifyTokenMiddleware, verifyAdmin, resetLoginAttempts);

// ============================================
// RUTAS ADICIONALES DE VERIFICACIÓN
// ============================================

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Privado
 * @header  Authorization: Bearer {token}
 */
router.get("/me", verifyTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await db.query(
      "SELECT id_usuario, nombre_usuario, apellido_usuario, correo_usuario, id_tipo_rolfk, estado_usuario FROM usuario WHERE id_usuario = ?",
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    res.json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener información del usuario"
    });
  }
});

/**
 * @route   GET /api/auth/all
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Privado (solo administrador)
 * @header  Authorization: Bearer {token}
 */
router.get("/all", verifyTokenMiddleware, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id_usuario, num_doc_usuario, nombre_usuario, apellido_usuario, correo_usuario, estado_usuario, id_tipo_rolfk FROM usuario ORDER BY id_usuario DESC"
    );
    
    res.json({
      success: true,
      users: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error en /all:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios"
    });
  }
});

// ============================================
// RUTAS DE VALIDACIÓN DE ROLES
// ============================================

/**
 * @route   GET /api/auth/validate-admin
 * @desc    Validar si usuario es administrador
 * @access  Privado
 * @header  Authorization: Bearer {token}
 */
router.get("/validate-admin", verifyTokenMiddleware, verifyAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Usuario es administrador",
    user: req.user
  });
});

/**
 * @route   GET /api/auth/validate-empresario
 * @desc    Validar si usuario es empresario
 * @access  Privado
 * @header  Authorization: Bearer {token}
 */
router.get("/validate-empresario", verifyTokenMiddleware, verifyEmpresario, (req, res) => {
  res.json({
    success: true,
    message: "Usuario es empresario",
    user: req.user
  });
});

export default router;