import { pool } from "../config/db.js";

/**
 * 📌 Registrar un nuevo lugar
 */
export const createLugarService = async (lugarData) => {
  const {
    nit_lugar,
    nombre_lugar,
    localidad_lugar,
    direccion_lugar,
    red_social_lugar,
    tipo_entrada_lugar,
    id_usuariofk,
  } = lugarData;

  if (!nit_lugar || !nombre_lugar || !direccion_lugar || !id_usuariofk) {
    throw new Error("Faltan datos obligatorios");
  }

  // Validar NIT único
  const [existingLugar] = await pool.query(
    "SELECT * FROM lugares WHERE nit_lugar = ?",
    [nit_lugar]
  );

  if (existingLugar.length > 0) {
    throw new Error("El NIT del lugar ya está registrado");
  }
// En la ruta PUT y DELETE, después de verificar que el lugar existe:
const lugar = lugarExistente[0];

// Verificar que el usuario sea el dueño del lugar
if (lugar.id_usuariofk !== req.user.id_usuario) {
  await connection.end();
  return res.status(403).json({ 
    success: false, 
    message: "No tienes permiso para modificar este lugar" 
  });
}
  await pool.query(
    `INSERT INTO lugares 
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

  return { message: "Lugar registrado correctamente" };
};