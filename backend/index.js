import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { pool } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Ruta de prueba para saber si el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente ✅");
});

// ✅ Ruta para recuperación de contraseña
app.post("/recuperar-cuenta", async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: "El correo es obligatorio" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Correo no registrado" });
    }

    // Generar código aleatorio (6 dígitos)
    const codigo = Math.floor(100000 + Math.random() * 900000);

    // Guardar el código temporal (puedes usar otra tabla si quieres)
    // await pool.query("UPDATE usuarios SET codigo_recuperacion = ? WHERE email = ?", [codigo, correo]);

    // Configuración de Nodemailer (usa tu correo y una contraseña de aplicación)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tu_correo@gmail.com", // ⚠️ tu correo
        pass: "tu_contraseña_de_aplicacion", // ⚠️ no tu contraseña normal
      },
    });

    await transporter.sendMail({
      from: "Find & Rate <tu_correo@gmail.com>",
      to: correo,
      subject: "Recuperación de contraseña",
      text: `Tu código de recuperación es: ${codigo}`,
    });

    res.json({ message: "Correo de recuperación enviado exitosamente" });
  } catch (error) {
    console.error("Error en /recuperar-cuenta:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

// Servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});


// ✅ Ruta para obtener reseñas por lugar
app.get("/resenias/:id_lugar", async (req, res) => {
  const { id_lugar } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         r.id_resenia, 
         r.comentario_resenia, 
         r.calificacion_resenia, 
         r.fecha_resenia, 
         r.hora_resenia, 
         u.nombre_usuario, 
         u.apellido_usuario
       FROM resenia r
       JOIN usuario u ON r.id_usuariofk = u.id_usuario
       WHERE r.id_lugarfk = ?
       ORDER BY r.fecha_resenia DESC;`,
      [id_lugar]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
});
