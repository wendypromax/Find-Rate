import express from "express";
import { pool as db } from "../config/db.js";
import emailController from '../controllers/emailController.js';

const router = express.Router();

// POST - Crear nueva reseña CON NOTIFICACIÓN AL ADMINISTRADOR
router.post('/', async (req, res) => {
  console.log("📨 POST /api/resenias - Datos recibidos:", req.body);

  try {
    // ACEPTAR AMBAS FORMAS: compatibilidad con el frontend
    const { 
      // Formato nuevo (Dashboard.jsx)
      id_lugarfk, 
      id_usuariofk, 
      comentario, 
      calificacion,
      // Formato antiguo (por si acaso)
      comentario_resenia, 
      calificacion_resenia 
    } = req.body;

    // Usar los nombres correctos (con compatibilidad)
    const comentarioFinal = comentario || comentario_resenia;
    const calificacionFinal = calificacion || calificacion_resenia;

    console.log("🔍 Datos procesados:", {
      comentarioFinal,
      calificacionFinal,
      id_usuariofk,
      id_lugarfk
    });

    // Validaciones básicas
    if (!comentarioFinal?.trim()) {
      console.log("❌ Error: Comentario vacío");
      return res.status(400).json({ 
        success: false, 
        message: "El comentario es obligatorio" 
      });
    }

    if (!calificacionFinal) {
      console.log("❌ Error: Calificación vacía");
      return res.status(400).json({ 
        success: false, 
        message: "La calificación es obligatoria" 
      });
    }

    if (!id_usuariofk) {
      console.log("❌ Error: ID usuario vacío");
      return res.status(400).json({ 
        success: false, 
        message: "El ID de usuario es obligatorio" 
      });
    }

    if (!id_lugarfk) {
      console.log("❌ Error: ID lugar vacío");
      return res.status(400).json({ 
        success: false, 
        message: "El ID de lugar es obligatorio" 
      });
    }

    // Parsear IDs
    const usuarioId = parseInt(id_usuariofk);
    const lugarId = parseInt(id_lugarfk);
    
    if (isNaN(usuarioId) || isNaN(lugarId)) {
      console.log("❌ Error: IDs no numéricos");
      return res.status(400).json({ 
        success: false, 
        message: "Los IDs deben ser numéricos" 
      });
    }

    console.log("🔍 IDs parseados:", { usuarioId, lugarId });

    // Verificar si el usuario ya tiene una reseña para este lugar
    try {
      const [existingReview] = await db.execute(
        "SELECT id_resenia FROM resenia WHERE id_usuariofk = ? AND id_lugarfk = ?",
        [usuarioId, lugarId]
      );

      if (existingReview.length > 0) {
        console.log("⚠️ Usuario ya tiene reseña para este lugar");
        return res.status(400).json({ 
          success: false, 
          message: "Ya has publicado una reseña para este lugar" 
        });
      }
    } catch (error) {
      console.log("⚠️ No se pudo verificar reseña existente:", error.message);
      // Continuar si hay error en la verificación
    }

    // 1. Insertar la reseña en la base de datos - VERSIÓN MÁS SIMPLE
    console.log("🚀 Insertando reseña en la base de datos...");
    
    let result;
    try {
      // Intentar con fecha_resenia como DATETIME
      [result] = await db.execute(
        `INSERT INTO resenia 
         (comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk, fecha_resenia, hora_resenia) 
         VALUES (?, ?, ?, ?, NOW(), CURTIME())`,
        [
          comentarioFinal.trim().substring(0, 50), // Limitar a 50 caracteres según tu estructura
          calificacionFinal.toString(),
          usuarioId,
          lugarId
        ]
      );
    } catch (insertError) {
      console.error("💥 Error en INSERT:", insertError);
      
      // Intentar versión alternativa sin hora_resenia
      try {
        console.log("🔄 Intentando INSERT sin hora_resenia...");
        [result] = await db.execute(
          `INSERT INTO resenia 
           (comentario_resenia, calificacion_resenia, id_usuariofk, id_lugarfk, fecha_resenia) 
           VALUES (?, ?, ?, ?, NOW())`,
          [
            comentarioFinal.trim().substring(0, 50),
            calificacionFinal.toString(),
            usuarioId,
            lugarId
          ]
        );
      } catch (secondError) {
        console.error("💥 Error en segundo INSERT:", secondError);
        throw secondError;
      }
    }

    console.log("📊 Resultado del INSERT:", result);
    
    if (!result || !result.insertId) {
      console.error("❌ No se obtuvo insertId del resultado");
      throw new Error("Error al obtener el ID de la reseña insertada");
    }

    const reseniaId = result.insertId;
    console.log(`✅ Reseña ${reseniaId} creada exitosamente`);

    // 2. Obtener información del usuario y lugar para el email
    console.log("📧 Obteniendo datos para notificación...");
    
    let usuario = { nombre_usuario: "Usuario", correo_usuario: "no@especificado.com" };
    let lugar = { nombre_lugar: "Lugar", direccion_lugar: "Dirección no disponible", localidad_lugar: "Localidad no disponible" };
    
    try {
      const [usuarioRows] = await db.execute(
        'SELECT nombre_usuario, correo_usuario FROM usuario WHERE id_usuario = ?',
        [usuarioId]
      );

      if (usuarioRows.length > 0) {
        usuario = usuarioRows[0];
      } else {
        console.warn("⚠️ Usuario no encontrado en BD");
      }
    } catch (userError) {
      console.error("❌ Error obteniendo usuario:", userError.message);
    }

    try {
      const [lugarRows] = await db.execute(
        'SELECT nombre_lugar, direccion_lugar, localidad_lugar FROM lugar WHERE id_lugar = ?',
        [lugarId]
      );

      if (lugarRows.length > 0) {
        lugar = lugarRows[0];
      } else {
        console.warn("⚠️ Lugar no encontrado en BD");
      }
    } catch (placeError) {
      console.error("❌ Error obteniendo lugar:", placeError.message);
    }

    const fecha = new Date().toLocaleString('es-ES');

    // 3. Enviar notificación al administrador (EN SEGUNDO PLANO)
    console.log("📤 Enviando notificación al administrador...");
    
    emailController.sendReviewNotification({
      usuario_nombre: usuario.nombre_usuario || "Usuario",
      usuario_email: usuario.correo_usuario || "no@especificado.com",
      lugar_nombre: lugar.nombre_lugar || "Lugar",
      lugar_direccion: lugar.direccion_lugar || "Dirección no disponible",
      lugar_localidad: lugar.localidad_lugar || "Localidad no disponible",
      calificacion: parseInt(calificacionFinal) || 0,
      comentario: comentarioFinal.trim(),
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

    // 4. Obtener la reseña recién creada con datos del usuario
    let nuevaResenia = null;
    try {
      const [reseniaRows] = await db.execute(
        `SELECT 
          r.id_resenia,
          r.comentario_resenia,
          r.calificacion_resenia,
          DATE_FORMAT(r.fecha_resenia, '%d/%m/%Y') as fecha_resenia,
          TIME_FORMAT(r.hora_resenia, '%H:%i') as hora_resenia,
          r.id_usuariofk,
          r.id_lugarfk,
          COALESCE(u.nombre_usuario, 'Usuario') as nombre_usuario
         FROM resenia r 
         LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
         WHERE r.id_resenia = ?`,
        [reseniaId]
      );
      
      nuevaResenia = reseniaRows[0];
    } catch (selectError) {
      console.error("❌ Error obteniendo reseña creada:", selectError.message);
      // Crear objeto básico si falla la consulta
      nuevaResenia = {
        id_resenia: reseniaId,
        comentario_resenia: comentarioFinal.trim().substring(0, 50),
        calificacion_resenia: calificacionFinal.toString(),
        id_usuariofk: usuarioId,
        id_lugarfk: lugarId,
        nombre_usuario: usuario.nombre_usuario || "Usuario"
      };
    }

    console.log("🎉 Reseña completada exitosamente");
    
    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente. El administrador ha sido notificado.",
      id_resenia: reseniaId,
      resenia: nuevaResenia
    });

  } catch (error) {
    console.error("💥 Error en POST /api/resenias:", error);
    
    // Manejar error de duplicado si existe la restricción única
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya has publicado una reseña para este lugar" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message,
      details: error.code || 'No code'
    });
  }
});

// GET - Obtener reseñas por lugar
router.get("/lugar/:id_lugar", async (req, res) => {
  const { id_lugar } = req.params;

  try {
    const [resenias] = await db.execute(
      `SELECT 
        r.id_resenia,
        r.comentario_resenia,
        r.calificacion_resenia,
        DATE_FORMAT(r.fecha_resenia, '%d/%m/%Y') as fecha_resenia,
        TIME_FORMAT(r.hora_resenia, '%H:%i') as hora_resenia,
        r.id_usuariofk,
        r.id_lugarfk,
        COALESCE(u.nombre_usuario, 'Usuario') as nombre_usuario
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       WHERE r.id_lugarfk = ? 
       ORDER BY r.fecha_resenia DESC, r.hora_resenia DESC`,
      [parseInt(id_lugar)]
    );

    res.json({ success: true, resenias });

  } catch (error) {
    console.error("💥 Error en GET /api/resenias/lugar:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
});

// GET - Obtener reseñas por usuario
router.get("/usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [resenias] = await db.execute(
      `SELECT 
        r.id_resenia,
        r.comentario_resenia,
        r.calificacion_resenia,
        DATE_FORMAT(r.fecha_resenia, '%d/%m/%Y') as fecha_resenia,
        TIME_FORMAT(r.hora_resenia, '%H:%i') as hora_resenia,
        r.id_usuariofk,
        r.id_lugarfk,
        l.nombre_lugar,
        COALESCE(u.nombre_usuario, 'Usuario') as nombre_usuario
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar 
       WHERE r.id_usuariofk = ? 
       ORDER BY r.fecha_resenia DESC, r.hora_resenia DESC`,
      [parseInt(id_usuario)]
    );

    res.json({ success: true, resenias });

  } catch (error) {
    console.error("💥 Error en GET /api/resenias/usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor" 
    });
  }
});

// GET todas las reseñas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        r.id_resenia,
        r.comentario_resenia,
        r.calificacion_resenia,
        DATE_FORMAT(r.fecha_resenia, '%d/%m/%Y') as fecha_resenia,
        TIME_FORMAT(r.hora_resenia, '%H:%i') as hora_resenia,
        r.id_usuariofk,
        r.id_lugarfk,
        u.nombre_usuario,
        l.nombre_lugar
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar 
       ORDER BY r.fecha_resenia DESC, r.hora_resenia DESC`
    );

    res.json({ 
      success: true, 
      resenias: rows, 
      total: rows.length 
    });

  } catch (error) {
    console.error("Error en GET /api/resenias:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al cargar reseñas" 
    });
  }
});

// GET - Obtener una reseña específica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT 
        r.id_resenia,
        r.comentario_resenia,
        r.calificacion_resenia,
        DATE_FORMAT(r.fecha_resenia, '%d/%m/%Y') as fecha_resenia,
        TIME_FORMAT(r.hora_resenia, '%H:%i') as hora_resenia,
        r.id_usuariofk,
        r.id_lugarfk,
        u.nombre_usuario,
        l.nombre_lugar,
        l.direccion_lugar,
        l.localidad_lugar
       FROM resenia r 
       LEFT JOIN usuario u ON r.id_usuariofk = u.id_usuario 
       LEFT JOIN lugar l ON r.id_lugarfk = l.id_lugar 
       WHERE r.id_resenia = ?`,
      [parseInt(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Reseña no encontrada" 
      });
    }

    res.json({ success: true, resenia: rows[0] });

  } catch (error) {
    console.error("Error en GET /api/resenias/:id:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener la reseña" 
    });
  }
});

// PUT - Actualizar reseña
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aceptar ambos formatos para edición
    const { 
      comentario_resenia, 
      calificacion_resenia,
      comentario,  // Formato nuevo
      calificacion // Formato nuevo
    } = req.body;

    const comentarioFinal = comentario || comentario_resenia;
    const calificacionFinal = calificacion || calificacion_resenia;

    if (!comentarioFinal?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "El comentario es obligatorio" 
      });
    }

    if (!calificacionFinal) {
      return res.status(400).json({ 
        success: false, 
        message: "La calificación es obligatoria" 
      });
    }

    const [result] = await db.execute(
      "UPDATE resenia SET comentario_resenia = ?, calificacion_resenia = ? WHERE id_resenia = ?",
      [
        comentarioFinal.trim().substring(0, 50), // Limitar a 50 caracteres
        calificacionFinal.toString(),
        parseInt(id)
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Reseña no encontrada" 
      });
    }

    res.json({ 
      success: true, 
      message: "Reseña actualizada correctamente" 
    });

  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar reseña" 
    });
  }
});

// DELETE - Eliminar reseña
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM resenia WHERE id_resenia = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Reseña no encontrada" 
      });
    }

    res.json({ 
      success: true, 
      message: "Reseña eliminada correctamente" 
    });

  } catch (error) {
    console.error("DELETE error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar reseña" 
    });
  }
});

// GET - Estadísticas de reseñas por lugar (calculadas en tiempo real)
router.get("/estadisticas/lugar/:id_lugar", async (req, res) => {
  const { id_lugar } = req.params;

  try {
    const [stats] = await db.execute(
      `SELECT 
        COUNT(*) as total_resenias,
        AVG(CAST(calificacion_resenia AS DECIMAL(10,2))) as promedio,
        SUM(CASE WHEN calificacion_resenia = '5' THEN 1 ELSE 0 END) as cinco_estrellas,
        SUM(CASE WHEN calificacion_resenia = '4' THEN 1 ELSE 0 END) as cuatro_estrellas,
        SUM(CASE WHEN calificacion_resenia = '3' THEN 1 ELSE 0 END) as tres_estrellas,
        SUM(CASE WHEN calificacion_resenia = '2' THEN 1 ELSE 0 END) as dos_estrellas,
        SUM(CASE WHEN calificacion_resenia = '1' THEN 1 ELSE 0 END) as una_estrella
       FROM resenia 
       WHERE id_lugarfk = ?`,
      [parseInt(id_lugar)]
    );

    res.json({ 
      success: true, 
      estadisticas: stats[0] || {
        total_resenias: 0,
        promedio: 0,
        cinco_estrellas: 0,
        cuatro_estrellas: 0,
        tres_estrellas: 0,
        dos_estrellas: 0,
        una_estrella: 0
      }
    });

  } catch (error) {
    console.error("Error en GET /api/resenias/estadisticas/lugar:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener estadísticas" 
    });
  }
});

export default router;