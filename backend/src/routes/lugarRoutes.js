import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// --- CONFIGURACIÓN DEL POOL DE CONEXIONES (CORREGIDO) ---
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "findyrate",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- CONFIGURACIÓN MULTER (CORREGIDO) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// La carpeta debe estar en la raíz del backend, no dentro de src
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Carpeta uploads creada:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// --- MIDDLEWARE PARA LOGGING ---
router.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.originalUrl}`);
  next();
});

// 1. ✅ Obtener todos los lugares (SIN imagen - GET general)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM lugar");
    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("❌ Error al obtener lugares:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener lugares",
      error: error.message 
    });
  }
});

// 2. ✅ Obtener lugares CON imagen (ruta específica)
router.get("/con-imagenes", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM lugar WHERE imagen_lugar IS NOT NULL");
    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("❌ Error al obtener lugares con imagen:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener lugares con imagen" 
    });
  }
});

// 3. ✅ Registrar lugar CON imagen (POST)
router.post("/con-imagen", upload.single("imagen_lugar"), async (req, res) => {
  console.log("📥 POST /con-imagen recibido");
  console.log("📋 Body:", req.body);
  console.log("🖼️ Archivo:", req.file ? req.file.filename : "No hay archivo");
  
  const {
    nit_lugar,
    nombre_lugar,
    localidad_lugar,
    direccion_lugar,
    red_social_lugar,
    tipo_entrada_lugar,
    id_usuariofk,
  } = req.body;

  // Validación mejorada
  if (!nit_lugar || !nombre_lugar || !direccion_lugar || !id_usuariofk) {
    return res.status(400).json({ 
      success: false, 
      message: "Faltan campos obligatorios: NIT, nombre, dirección o ID usuario" 
    });
  }

  try {
    // Verificar si el NIT ya existe
    const [existing] = await pool.execute(
      "SELECT id_lugar FROM lugar WHERE nit_lugar = ?",
      [nit_lugar]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un lugar con este NIT"
      });
    }

    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("📊 Insertando en BD...");
    
    const [result] = await pool.execute(
      `INSERT INTO lugar 
      (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, 
       red_social_lugar, tipo_entrada_lugar, imagen_lugar, id_usuariofk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar || null,
        direccion_lugar,
        red_social_lugar || null,
        tipo_entrada_lugar || null,
        imagenUrl,
        id_usuariofk
      ]
    );

    console.log("✅ Insert exitoso. ID:", result.insertId);

    res.json({
      success: true,
      message: "✅ Lugar registrado correctamente con imagen",
      id_lugar: result.insertId,
      imagen_url: imagenUrl,
    });
  } catch (error) {
    console.error("❌ Error al insertar lugar:", error.message);
    console.error("🔍 Stack trace:", error.stack);
    
    // Si hay archivo pero falla la BD, eliminarlo
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑️ Archivo temporal eliminado:", filePath);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error en la base de datos: " + error.message,
      error: error.message
    });
  }
});

// 4. ✅ Registrar lugar SIN imagen
router.post("/", async (req, res) => {
  console.log("📥 POST / recibido");
  console.log("📋 Body:", req.body);
  
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
    return res.status(400).json({ 
      success: false, 
      message: "Faltan campos obligatorios" 
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO lugar 
      (nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, 
       red_social_lugar, tipo_entrada_lugar, id_usuariofk)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nit_lugar,
        nombre_lugar,
        localidad_lugar || null,
        direccion_lugar,
        red_social_lugar || null,
        tipo_entrada_lugar || null,
        id_usuariofk
      ]
    );

    res.json({
      success: true,
      message: "Lugar registrado correctamente",
      id_lugar: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error en BD: " + error.message 
    });
  }
});

// 5. ✅ Obtener lugares por empresario (CORREGIDO)
router.get("/empresario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  console.log("👤 Obteniendo lugares para empresario:", id_usuario);

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM lugar WHERE id_usuariofk = ? ORDER BY created_at DESC",
      [id_usuario]
    );

    if (rows.length === 0) {
      return res.json({ 
        success: true, 
        lugares: [],
        message: "No se encontraron lugares para este empresario." 
      });
    }

    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error: " + error.message
    });
  }
});

// 6. ✅ Actualizar lugar por ID
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
    // Verificar si el lugar existe
    const [lugarExistente] = await pool.execute(
      "SELECT * FROM lugar WHERE id_lugar = ?",
      [id]
    );

    if (lugarExistente.length === 0) {
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
        const oldImagePath = path.join(process.cwd(), lugarExistente[0].imagen_lugar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("🗑️ Imagen anterior eliminada:", oldImagePath);
        }
      }
    }

    console.log("🔄 Actualizando lugar en BD...");
    
    // Actualizar el lugar
    const [result] = await pool.execute(
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

// 7. ✅ Eliminar lugar por ID (AGREGADO)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("🗑️ DELETE /api/lugares/" + id);

  try {
    // Verificar si el lugar existe
    const [lugarExistente] = await pool.execute(
      "SELECT * FROM lugar WHERE id_lugar = ?",
      [id]
    );

    if (lugarExistente.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Lugar no encontrado" 
      });
    }

    // Eliminar la imagen si existe
    if (lugarExistente[0].imagen_lugar) {
      const imagePath = path.join(process.cwd(), lugarExistente[0].imagen_lugar);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Imagen eliminada:", imagePath);
      }
    }

    // Eliminar el lugar
    const [result] = await pool.execute(
      "DELETE FROM lugar WHERE id_lugar = ?",
      [id]
    );

    console.log("✅ Lugar eliminado de BD. Resultado:", result);

    res.json({
      success: true,
      message: "✅ Lugar eliminado correctamente",
      id_lugar: id
    });
  } catch (error) {
    console.error("❌ Error al eliminar lugar:", error.message);
    console.error("🔍 Stack trace:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar el lugar: " + error.message,
      error: error.message
    });
  }
});

// 8. ✅ Ruta de diagnóstico
router.get("/diagnostico", async (req, res) => {
  try {
    // Verificar conexión a BD
    const [tables] = await pool.execute("SHOW TABLES");
    
    // Verificar tabla lugar
    const [columns] = await pool.execute("DESCRIBE lugar");
    
    // Contar lugares
    const [[{count}]] = await pool.execute("SELECT COUNT(*) as count FROM lugar");
    
    res.json({
      success: true,
      mensaje: "Diagnóstico del sistema",
      tablas: tables.map(t => t[Object.keys(t)[0]]),
      columnas_lugar: columns.map(c => c.Field),
      total_lugares: count,
      uploads_dir: uploadDir,
      exists_uploads: fs.existsSync(uploadDir)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en diagnóstico: " + error.message
    });
  }
});

export default router;