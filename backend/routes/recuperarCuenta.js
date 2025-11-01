/* eslint-env node */

import express from "express";
import nodemailer from "nodemailer";
import { pool } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    // Verificar si el correo existe en la base de datos
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE correo_usuario = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // Generar un token aleatorio
    const token = Math.random().toString(36).substring(2, 10);

    // Guardar el token temporalmente en la base de datos
    await pool.query(
      "UPDATE usuario SET token_recuperacion = ? WHERE correo_usuario = ?",
      [token, correo]
    );

    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // definido en .env
        pass: process.env.EMAIL_PASS, // contraseña de aplicación
      },
    });

    // Crear enlace de recuperación
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
