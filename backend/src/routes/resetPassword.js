import express from "express";
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token o contraseña faltante" });
  }

  try {
    // Buscar usuario por token y verificar expiración
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expiration > NOW()",
      [token]
    );

    if (rows.length === 0) {
      console.log("Token inválido o expirado:", token);
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const userId = rows[0].id_usuario;

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y limpiar token
    const [updateResult] = await pool.query(
      "UPDATE usuario SET password_usuario = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id_usuario = ?",
      [hashedPassword, userId]
    );

    console.log("Contraseña actualizada para usuario:", userId);

    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    console.error("❌ Error en /api/reset-password:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
