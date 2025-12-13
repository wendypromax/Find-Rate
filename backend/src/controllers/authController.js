// backend/src/controllers/authController.js
import { pool as db } from "../config/db.js";
import bcrypt from "bcryptjs";
import emailController from "./emailController.js";

// 🧩 Registro de usuario
export const registerUser = async (req, res) => {
  console.log('📝 REGISTER: Iniciando registro de usuario...');
  
  const {
    num_doc_usuario,
    nombre_usuario,
    apellido_usuario,
    telefono_usuario,
    correo_usuario,
    password_usuario,
    edad_usuario,
    genero_usuario,
    id_tipo_rolfk,
  } = req.body;

  console.log('📨 REGISTER: Datos recibidos:', { 
    nombre: nombre_usuario, 
    email: correo_usuario 
  });

  try {
    // Validación de campos obligatorios
    if (!num_doc_usuario || !nombre_usuario || !apellido_usuario || !correo_usuario || !password_usuario) {
      return res.status(400).json({ message: "Por favor completa todos los campos obligatorios." });
    }

    // Verificar si el usuario ya existe
    const [existing] = await db.query(
      "SELECT * FROM usuario WHERE num_doc_usuario = ? OR correo_usuario = ?",
      [num_doc_usuario, correo_usuario]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "El número de documento o correo ya están registrados." });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password_usuario, 10);
    console.log('🔐 REGISTER: Contraseña hasheada');

    // Insertar usuario en la base de datos
    const [result] = await db.query(
      `INSERT INTO usuario 
        (num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, estado_usuario, password_usuario, edad_usuario, genero_usuario, id_tipo_rolfk, reset_token, reset_token_expiration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        num_doc_usuario,
        nombre_usuario,
        apellido_usuario,
        telefono_usuario,
        correo_usuario,
        "activo",
        hashedPassword,
        edad_usuario || null,
        genero_usuario || null,
        id_tipo_rolfk || 2,
        null,
        null,
      ]
    );

    console.log('✅ REGISTER: Usuario insertado en DB, ID:', result.insertId);

    // Obtener el usuario recién creado
    const [newUserRows] = await db.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [result.insertId]
    );

    if (newUserRows.length === 0) {
      return res.status(500).json({ message: "Error al recuperar usuario creado" });
    }

    const newUser = newUserRows[0];
    console.log('👤 REGISTER: Usuario creado:', newUser.correo_usuario);

    // ✅ ENVIAR EMAIL DE BIENVENIDA (asíncrono - no bloquea la respuesta)
    console.log('📧 REGISTER: Intentando enviar email de bienvenida...');
    
    emailController.sendWelcomeEmail(newUser)
      .then(emailResult => {
        if (emailResult.success) {
          console.log(`🎉 REGISTER: Email enviado exitosamente a ${newUser.correo_usuario}`);
        } else {
          console.warn(`⚠️ REGISTER: No se pudo enviar email: ${emailResult.error}`);
        }
      })
      .catch(err => {
        console.error('💥 REGISTER: Error inesperado enviando email:', err);
      });

    // Responder al cliente inmediatamente
    res.status(201).json({ 
      message: "Usuario registrado correctamente 🎉. Revisa tu email para el mensaje de bienvenida.",
      user: {
        id_usuario: newUser.id_usuario,
        num_doc_usuario: newUser.num_doc_usuario,
        nombre_usuario: newUser.nombre_usuario,
        apellido_usuario: newUser.apellido_usuario,
        correo_usuario: newUser.correo_usuario,
        telefono_usuario: newUser.telefono_usuario,
        estado_usuario: newUser.estado_usuario
      }
    });

  } catch (error) {
    console.error("❌ REGISTER: Error completo:", error);
    res.status(500).json({ 
      message: "Error al registrar usuario",
      error: error.message 
    });
  }
};

// 🧩 Inicio de sesión
export const loginUser = async (req, res) => {
  console.log('🔑 LOGIN: Intentando inicio de sesión...');
  
  const { correo_usuario, password_usuario } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo_usuario = ?", [correo_usuario]);

    if (rows.length === 0) {
      console.log('❌ LOGIN: Usuario no encontrado:', correo_usuario);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    console.log('👤 LOGIN: Usuario encontrado:', user.nombre_usuario);

    const passwordMatch = await bcrypt.compare(password_usuario, user.password_usuario);

    if (!passwordMatch) {
      console.log('❌ LOGIN: Contraseña incorrecta para:', correo_usuario);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    console.log('✅ LOGIN: Inicio de sesión exitoso para:', user.nombre_usuario);
    
    res.json({
      message: "Inicio de sesión exitoso ✅",
      user: {
        id_usuario: user.id_usuario,
        num_doc_usuario: user.num_doc_usuario,
        nombre_usuario: user.nombre_usuario,
        apellido_usuario: user.apellido_usuario,
        correo_usuario: user.correo_usuario,
        telefono_usuario: user.telefono_usuario,
        edad_usuario: user.edad_usuario,
        genero_usuario: user.genero_usuario,
        id_tipo_rolfk: user.id_tipo_rolfk,
        estado_usuario: user.estado_usuario,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN: Error completo:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// 🧩 Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log('👤 GET USER BY ID: Buscando usuario ID:', id);
  
  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    
    if (rows.length === 0) {
      console.log('❌ GET USER BY ID: Usuario no encontrado ID:', id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    console.log('✅ GET USER BY ID: Usuario encontrado:', rows[0].nombre_usuario);
    res.json(rows[0]);
    
  } catch (error) {
    console.error("❌ GET USER BY ID: Error completo:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// 🧩 Actualizar usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { 
    num_doc_usuario, 
    nombre_usuario, 
    apellido_usuario, 
    telefono_usuario, 
    correo_usuario, 
    edad_usuario, 
    genero_usuario, 
    estado_usuario 
  } = req.body;

  console.log('✏️ UPDATE USER: Actualizando usuario ID:', id);
  console.log('📝 UPDATE USER: Datos a actualizar:', { 
    nombre: nombre_usuario, 
    email: correo_usuario 
  });

  try {
    const [result] = await db.query(
      `UPDATE usuario 
       SET num_doc_usuario = ?, nombre_usuario = ?, apellido_usuario = ?, telefono_usuario = ?, correo_usuario = ?, edad_usuario = ?, genero_usuario = ?, estado_usuario = ?
       WHERE id_usuario = ?`,
      [num_doc_usuario, nombre_usuario, apellido_usuario, telefono_usuario, correo_usuario, edad_usuario, genero_usuario, estado_usuario, id]
    );

    if (result.affectedRows === 0) {
      console.log('❌ UPDATE USER: Usuario no encontrado ID:', id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log('✅ UPDATE USER: Usuario actualizado correctamente ID:', id);
    res.json({ message: "Usuario actualizado correctamente ✅" });
    
  } catch (error) {
    console.error("❌ UPDATE USER: Error completo:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// 🧩 Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log('🗑️ DELETE USER: Eliminando usuario ID:', id);
  
  try {
    const [result] = await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ DELETE USER: Usuario no encontrado ID:', id);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    console.log('✅ DELETE USER: Usuario eliminado correctamente ID:', id);
    res.json({ message: "Usuario eliminado correctamente ✅" });
    
  } catch (error) {
    console.error("❌ DELETE USER: Error completo:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};