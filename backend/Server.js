import express from "express";
import cors from "cors";

// ===== Importar Rutas =====
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

// ===== Inicialización =====
const app = express();
const PORT = 5000;

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Rutas principales =====
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

// ===== Ruta raíz =====
app.get("/", (req, res) => {
  res.send("💗 Servidor FindyRate corriendo correctamente 💗");
});

// ===== Servidor escuchando =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
