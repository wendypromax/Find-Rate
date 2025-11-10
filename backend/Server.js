import dotenv from "dotenv";
dotenv.config(); // ✅ cargar variables de entorno al inicio

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

// ===== Importar routers =====
import authRoutes from "./routes/authRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";
import bitacoraRoutes from "./routes/bitacoraRoutes.js";
import calificacionRoutes from "./routes/calificacionRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";
import diasRoutes from "./routes/diasRoutes.js";
import estadisticaRoutes from "./routes/estadisticaRoutes.js";
import favoritosRoutes from "./routes/favoritosRoutes.js";
import horarioRoutes from "./routes/horarioRoutes.js";
import reseniaRoutes from "./routes/reseniaRoutes.js";
import sucursalRoutes from "./routes/sucursalRoutes.js";
import tipoNegocioRoutes from "./routes/tipoNegocioRoutes.js";
import tipoRolRoutes from "./routes/tipoRolRoutes.js";
import tipoServicioRoutes from "./routes/tipoServicioRoutes.js";
import recuperarCuentaRoutes from "./routes/recuperarCuenta.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import lugarRoutes from "./routes/lugarRoutes.js"; // ✅ Agregado

// 🔹 importar path para servir archivos estáticos
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// servir las imágenes subidas (carpeta uploads dentro de backend)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Conexión a MySQL =====
export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===== Rutas principales =====
app.use("/api/auth", authRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/bitacoras", bitacoraRoutes);
app.use("/api/calificaciones", calificacionRoutes);
app.use("/api/contactos", contactoRoutes);
app.use("/api/dias", diasRoutes);
app.use("/api/estadisticas", estadisticaRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/resenias", reseniaRoutes);
app.use("/api/sucursales", sucursalRoutes);
app.use("/api/tipoNegocio", tipoNegocioRoutes);
app.use("/api/tipoRol", tipoRolRoutes);
app.use("/api/tipoServicio", tipoServicioRoutes);
app.use("/api/recuperar-cuenta", recuperarCuentaRoutes);
app.use("/api/reset-password", resetPasswordRoutes);

// Rutas de lugares
app.use("/api/lugares", lugarRoutes);

// ===== Ruta raíz =====
app.get("/", (req, res) => {
  res.send(" Servidor FindyRate corriendo correctamente 💗");
});

// ===== Manejo de rutas no encontradas 
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ===== Servidor escuchando =====
app.listen(PORT, () => console.log(` Servidor ejecutándose en el puerto ${PORT}`));
