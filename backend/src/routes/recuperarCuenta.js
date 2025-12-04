/* eslint-env node */
import express from "express";
import nodemailer from "nodemailer";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    // Verificar si el correo existe
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE correo_usuario = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString("hex");

    // Guardar el token y fecha de expiración
    await pool.query(
      `UPDATE usuario 
       SET reset_token = ?, 
           reset_token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR)
       WHERE correo_usuario = ?`,
      [token, correo]
    );

    console.log("Token generado:", token);

    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enlace de recuperación
    const enlace = `http://localhost:5173/reset-password/${token}`;

    // Enviar correo
    await transporter.sendMail({
      from: `"Find & Rate" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Recuperación de contraseña 🔐",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${enlace}" target="_blank">${enlace}</a>
      `,
    });

    res.json({ message: "Correo de recuperación enviado con éxito 📩" });
  } catch (error) {
    console.error("❌ Error en /api/recuperar-cuenta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
