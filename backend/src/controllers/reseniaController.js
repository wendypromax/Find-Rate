// backend/src/controllers/reseniaController.js
import { pool as db } from "../config/db.js";
import emailController from './emailController.js'; // Importa el controlador de email

console.log('📝 RESENIA CONTROLLER: Cargado correctamente');

// ✅ Obtener todas las reseñas
export const getResenias = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      ORDER BY r.fecha_resenia DESC
    `);
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas" });
  }
};

// ✅ Obtener reseña por ID
export const getReseniaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      WHERE r.id_resenia = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }
    
    res.json({ success: true, resenia: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseña" });
  }
};

// ✅ Obtener reseñas por lugar
export const getReseniasByLugar = async (req, res) => {
  const { id_lugar } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, u.foto_usuario
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      WHERE r.id_lugarfk = ? 
      ORDER BY r.fecha_resenia DESC
    `, [id_lugar]);
    
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas del lugar" });
  }
};

// ✅ Obtener reseñas por usuario
export const getReseniasByUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.nombre_usuario, u.foto_usuario, l.nombre_lugar
      FROM resenia r 
      LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
      LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar
      WHERE r.id_usuariofk = ? 
      ORDER BY r.fecha_resenia DESC
    `, [id_usuario]);
    
    res.json({ success: true, resenias: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener reseñas del usuario" });
  }
};

// ✅ Crear reseña con notificación al administrador
export const createResenia = async (req, res) => {
  const { id_lugarfk, id_usuariofk, comentario, calificacion } = req.body;
  
  try {
    console.log('📝 Creando nueva reseña...');
    console.log('📊 Datos recibidos:', { id_lugarfk, id_usuariofk, comentario, calificacion });

    // Validar campos obligatorios
    if (!id_lugarfk || !id_usuariofk || !comentario || !calificacion) {
      return res.status(400).json({ 
        success: false, 
        message: "Todos los campos son obligatorios" 
      });
    }

    // Verificar si ya existe una reseña del usuario para este lugar
    const [existing] = await db.query(
      "SELECT * FROM resenia WHERE id_lugarfk = ? AND id_usuariofk = ?",
      [id_lugarfk, id_usuariofk]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya has escrito una reseña para este lugar" 
      });
    }

    // 1. Obtener información del usuario y lugar para el email
    const [usuarioRows] = await db.query(
      'SELECT nombre_usuario, correo_usuario FROM usuario WHERE id_usuario = ?',
      [id_usuariofk]
    );

    const [lugarRows] = await db.query(
      'SELECT nombre_lugar, direccion_lugar, localidad_lugar FROM lugar WHERE id_lugar = ?',
      [id_lugarfk]
    );

    if (!usuarioRows.length || !lugarRows.length) {
      console.error('❌ Usuario o lugar no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Usuario o lugar no encontrado'
      });
    }

    const usuario = usuarioRows[0];
    const lugar = lugarRows[0];
    const fecha = new Date().toLocaleString('es-ES');

    // 2. Insertar nueva reseña
    const [result] = await db.query(
      "INSERT INTO resenia (id_lugarfk, id_usuariofk, comentario, calificacion, fecha_resenia) VALUES (?, ?, ?, ?, NOW())",
      [id_lugarfk, id_usuariofk, comentario, calificacion]
    );

    const reseniaId = result.insertId;

    // 3. Enviar notificación al administrador (EN SEGUNDO PLANO)
    // No bloqueamos la respuesta al usuario esperando esto
    emailController.sendReviewNotification({
      usuario_nombre: usuario.nombre_usuario,
      usuario_email: usuario.correo_usuario,
      lugar_nombre: lugar.nombre_lugar,
      lugar_direccion: lugar.direccion_lugar,
      lugar_localidad: lugar.localidad_lugar,
      calificacion: parseInt(calificacion),
      comentario: comentario,
      fecha: fecha,
      reseniaId: reseniaId
    }).then(emailResult => {
      if (emailResult.success) {
        console.log(`✅ Notificación enviada al administrador para reseña ${reseniaId}`);
      } else {
        console.error(`❌ Error enviando notificación: ${emailResult.error}`);
      }
    }).catch(error => {
      console.error('❌ Error en proceso de notificación:', error);
    });

    // 4. Actualizar promedio del lugar
    await updateLugarRating(id_lugarfk);

    console.log(`✅ Reseña ${reseniaId} creada exitosamente`);

    // Obtener la reseña recién creada con datos del usuario
    const [reseniaCompleta] = await db.query(`
      SELECT r.*, u.nombre_usuario 
      FROM resenia r
      JOIN usuario u ON r.id_usuariofk = u.id_usuario
      WHERE r.id_resenia = ?
    `, [reseniaId]);

    res.status(201).json({ 
      success: true, 
      message: "Reseña creada correctamente. El administrador ha sido notificado.", 
      id_resenia: reseniaId,
      data: {
        ...reseniaCompleta[0],
        nombre_usuario: usuario.nombre_usuario
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al crear reseña" });
  }
};

// ✅ Actualizar reseña
export const updateResenia = async (req, res) => {
  const { id } = req.params;
  const { comentario, calificacion } = req.body;
  
  try {
    const [result] = await db.query(
      "UPDATE resenia SET comentario = ?, calificacion = ? WHERE id_resenia = ?",
      [comentario, calificacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    // Obtener id_lugarfk para actualizar el promedio
    const [reseniaData] = await db.query(
      'SELECT id_lugarfk FROM resenia WHERE id_resenia = ?',
      [id]
    );

    if (reseniaData.length > 0) {
      await updateLugarRating(reseniaData[0].id_lugarfk);
    }

    res.json({ success: true, message: "Reseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar reseña" });
  }
};

// ✅ Eliminar reseña
export const deleteResenia = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener id_lugarfk antes de eliminar para actualizar el promedio
    const [reseniaData] = await db.query(
      'SELECT id_lugarfk FROM resenia WHERE id_resenia = ?',
      [id]
    );

    const [result] = await db.query("DELETE FROM resenia WHERE id_resenia = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    if (reseniaData.length > 0) {
      await updateLugarRating(reseniaData[0].id_lugarfk);
    }

    res.json({ success: true, message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar reseña" });
  }
};

// ✅ Verificar si el usuario es propietario de la reseña
export const verificarPropietarioResenia = async (req, res) => {
  const { id_resenia } = req.params;
  const { id_usuario } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id_usuariofk FROM resenia WHERE id_resenia = ?",
      [id_resenia]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Reseña no encontrada" });
    }

    const esPropietario = rows[0].id_usuariofk === parseInt(id_usuario);
    
    res.json({ 
      success: true, 
      esPropietario,
      id_usuariofk: rows[0].id_usuariofk 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al verificar propietario" });
  }
};

// Función auxiliar para actualizar el promedio del lugar
async function updateLugarRating(lugarId) {
  try {
    const [ratings] = await db.query(
      `SELECT 
        COUNT(*) as total,
        AVG(calificacion) as promedio,
        SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) as cinco_estrellas,
        SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) as cuatro_estrellas,
        SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) as tres_estrellas,
        SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) as dos_estrellas,
        SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) as una_estrella
       FROM resenia 
       WHERE id_lugarfk = ?`,
      [lugarId]
    );

    const data = ratings[0];
    const promedio = data.promedio || 0;

    await db.query(
      `UPDATE lugar 
       SET 
        promedio_calificacion = ?,
        total_resenias = ?,
        cinco_estrellas = ?,
        cuatro_estrellas = ?,
        tres_estrellas = ?,
        dos_estrellas = ?,
        una_estrella = ?
       WHERE id_lugar = ?`,
      [
        promedio.toFixed(2),
        data.total || 0,
        data.cinco_estrellas || 0,
        data.cuatro_estrellas || 0,
        data.tres_estrellas || 0,
        data.dos_estrellas || 0,
        data.una_estrella || 0,
        lugarId
      ]
    );

    console.log(`⭐ Lugar ${lugarId} actualizado: promedio ${promedio.toFixed(2)}`);
  } catch (error) {
    console.error('Error actualizando promedio del lugar:', error);
  }
}