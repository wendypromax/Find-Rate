import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "findyrate",
};

// --- configuración multer ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//  obtener todos los lugares (con imagen)
router.get("/con-imagen", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM lugar");
    await connection.end();
    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("❌ Error al obtener lugares:", error);
    res.status(500).json({ success: false, message: "Error al obtener lugares" });
  }
});

// registrar lugar con imagen
router.post("/con-imagen", upload.single("imagen_lugar"), async (req, res) => {
  const {
    nit_lugar,
    nombre_lugar,
    localidad_lugar,
    direccion_lugar,
    red_social_lugar,
    tipo_entrada_lugar,
    id_usuariofk,
  } = req.body;

  if (!nit_lugar || !nombre_lugar || !direccion_lugar || !id_usuariofk) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await connection.execute(
      `INSERT INTO lugar 
      (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, imagen_lugar, id_usuariofk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar,
        direccion_lugar,
        red_social_lugar,
        tipo_entrada_lugar,
        imagen,
        id_usuariofk,
      ]
    );

    await connection.end();

    res.json({
      success: true,
      message: "✅ Lugar registrado correctamente con imagen",
      id_lugar: result.insertId,
      imagen_url: imagen,
    });
  } catch (error) {
    console.error("❌ Error al insertar lugar:", error);
    res.status(500).json({ success: false, message: "Error al insertar en la base de datos" });
  }
});

// Rutas originales

//  Obtener todos los lugares
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM lugar");
    await connection.end();

    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener lugares",
    });
  }
});

//  Obtener lugares por ID del empresario (para MisLugares.jsx)
router.get("/empresario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM lugar WHERE id_usuariofk = ?",
      [id_usuario]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron lugares para este empresario.",
      });
    }

    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("❌ Error al obtener lugares del empresario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los lugares del empresario.",
    });
  }
});

//  Agregar nuevo lugar
router.post("/", async (req, res) => {
  const {
    nit_lugar,
    nombre_lugar,
    localidad_lugar,
    direccion_lugar,
    red_social_lugar,
    tipo_entrada_lugar,
    id_usuariofk,
  } = req.body;

  if (!nit_lugar || !nombre_lugar || !direccion_lugar || !id_usuariofk) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `INSERT INTO lugar 
      (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, id_usuariofk)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar,
        direccion_lugar,
        red_social_lugar,
        tipo_entrada_lugar,
        id_usuariofk,
      ]
    );

    await connection.end();

    res.json({
      success: true,
      message: "Lugar registrado correctamente",
      id_lugar: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al insertar en la base de datos" });
  }
});

export default router;
