// backend/routes/lugarRoutes.js
import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "findyrate",
};

// ✅ Obtener todos los lugares
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM lugar");
    await connection.end();

    res.json({ success: true, lugares: rows });
  } catch (error) {
    console.error("Error al obtener lugares:", error);
    res.status(500).json({ success: false, message: "Error al obtener lugares" });
  }
});

// ✅ Agregar nuevo lugar
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
      [nit_lugar, nombre_lugar, localidad_lugar, direccion_lugar, red_social_lugar, tipo_entrada_lugar, id_usuariofk]
    );

    await connection.end();

    res.json({ success: true, message: "Lugar registrado correctamente", id_lugar: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al insertar en la base de datos" });
  }
});

export default router;
