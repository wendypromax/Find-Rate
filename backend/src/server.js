// Server.js
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
import lugarRoutes from "./routes/lugarRoutes.js";
import adminUsuarioRoutes from "./routes/adminUsuarioRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middlewares =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// servir imágenes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===== Rutas =====
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
app.use("/api/lugares", lugarRoutes);
app.use("/api/admin/usuarios", adminUsuarioRoutes);

// ===== Ruta raíz =====
app.get("/", (req, res) => {
  res.send("Servidor FindyRate corriendo correctamente 💗");
});

// ===== Middleware 404 =====
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ===== Middleware de manejo global de errores =====
app.use((error, req, res, next) => {
  console.error("Error global:", error);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor"
  });
});

// ===== Iniciar servidor =====
app.listen(PORT, () =>
  console.log(`Servidor ejecutándose en el puerto ${PORT}`)
);
