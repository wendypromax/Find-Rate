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

// 🔹 Actualizar lugar por ID (CORREGIDO)
router.put("/:id", upload.single("imagen_lugar"), async (req, res) => {
  const { id } = req.params;
  const {
    nit_lugar,
    nombre_lugar,
    localidad_lugar,
    direccion_lugar,
    red_social_lugar,
    tipo_entrada_lugar,
  } = req.body;

  console.log("📝 PUT /api/lugares/" + id);
  console.log("📦 Body recibido:", req.body);
  console.log("🖼️ Archivo recibido:", req.file ? req.file.filename : "No hay archivo");

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si el lugar existe
    const [lugarExistente] = await connection.execute(
      "SELECT * FROM lugar WHERE id_lugar = ?",
      [id]
    );

    if (lugarExistente.length === 0) {
      await connection.end();
      return res.status(404).json({ 
        success: false, 
        message: "Lugar no encontrado" 
      });
    }

    // Manejar la imagen
    let imagenUrl = lugarExistente[0].imagen_lugar;
    if (req.file) {
      // Si hay una nueva imagen, actualizarla
      imagenUrl = `/uploads/${req.file.filename}`;
      
      // Eliminar la imagen anterior si existe
      if (lugarExistente[0].imagen_lugar && lugarExistente[0].imagen_lugar !== imagenUrl) {
        const oldImagePath = path.join(__dirname, '..', lugarExistente[0].imagen_lugar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("🗑️ Imagen anterior eliminada:", oldImagePath);
        }
      }
    }

    console.log("🔄 Actualizando lugar en BD...");
    
    // Actualizar el lugar
    const [result] = await connection.execute(
      `UPDATE lugar SET
        nit_lugar = ?,
        nombre_lugar = ?,
        localidad_lugar = ?,
        direccion_lugar = ?,
        red_social_lugar = ?,
        tipo_entrada_lugar = ?,
        imagen_lugar = ?
      WHERE id_lugar = ?`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar,
        direccion_lugar,
        red_social_lugar || "",
        tipo_entrada_lugar || "",
        imagenUrl,
        id
      ]
    );

    await connection.end();

    console.log("✅ Lugar actualizado correctamente en BD");
    console.log("📊 Resultado de actualización:", result);

    res.json({
      success: true,
      message: "✅ Lugar actualizado correctamente",
      imagen_url: imagenUrl,
      id_lugar: id
    });
  } catch (error) {
    console.error("❌ Error al actualizar lugar:", error);
    console.error("📄 Detalles del error:", error.message);
    console.error("🔍 Stack trace:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar el lugar: " + error.message,
      error: error.message
    });
  }
});

// 🔹 Eliminar lugar por ID (CORREGIDO)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("🗑️ DELETE /api/lugares/" + id);

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si el lugar existe
    const [lugarExistente] = await connection.execute(
      "SELECT * FROM lugar WHERE id_lugar = ?",
      [id]
    );

    if (lugarExistente.length === 0) {
      await connection.end();
      return res.status(404).json({ 
        success: false, 
        message: "Lugar no encontrado" 
      });
    }

    // Eliminar la imagen si existe
    if (lugarExistente[0].imagen_lugar) {
      const imagePath = path.join(__dirname, '..', lugarExistente[0].imagen_lugar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Imagen eliminada:", imagePath);
      }
    }

    // Eliminar el lugar
    const [result] = await connection.execute(
      "DELETE FROM lugar WHERE id_lugar = ?",
      [id]
    );

    await connection.end();

    console.log("✅ Lugar eliminado de BD. Resultado:", result);

    res.json({
      success: true,
      message: "✅ Lugar eliminado correctamente",
      id_lugar: id
    });
  } catch (error) {
    console.error("❌ Error al eliminar lugar:", error);
    console.error("📄 Detalles del error:", error.message);
    
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar el lugar: " + error.message,
      error: error.message
    });
  }
});

export default router;