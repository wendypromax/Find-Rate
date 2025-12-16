// backend/src/server.js - VERSIÓN CORREGIDA
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from '../config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ===== FUNCIÓN PARA VERIFICAR CONEXIÓN A BD =====
const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    connection.release();
    return { success: true, message: 'Conexión exitosa' };
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    return { 
      success: false, 
      message: `Error de conexión: ${error.message}` 
    };
  }
};

// ===== FUNCIÓN PARA CONFIGURAR COLUMNAS DE SEGURIDAD =====
const setupSecurityColumns = async () => {
  let connection;
  try {
    console.log('🔧 Verificando columnas de seguridad en tabla "usuario"...');
    
    connection = await pool.getConnection();
    
    // 1. Verificar si la tabla "usuario" existe
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'usuario'"
    );
    
    if (tables.length === 0) {
      console.log('❌ La tabla "usuario" no existe.');
      console.log('💡 Ejecuta este comando SQL para crear la tabla:');
      console.log(`
        CREATE TABLE usuario (
          id_usuario INT PRIMARY KEY AUTO_INCREMENT,
          nombre_usuario VARCHAR(100) NOT NULL,
          apellido_usuario VARCHAR(100) NOT NULL,
          tipo_documento VARCHAR(50) NOT NULL,
          numero_documento VARCHAR(50) UNIQUE NOT NULL,
          correo_usuario VARCHAR(100) UNIQUE NOT NULL,
          password_usuario VARCHAR(255) NOT NULL,
          telefono_usuario VARCHAR(20),
          fecha_nacimiento DATE,
          foto_perfil VARCHAR(255),
          rol_usuario ENUM('usuario', 'administrador') DEFAULT 'usuario',
          estado_usuario ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      return { success: false, message: 'Tabla "usuario" no existe' };
    }
    
    console.log('✅ Tabla "usuario" encontrada');
    
    // 2. Verificar columnas existentes
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM usuario"
    );
    
    const existingColumns = columns.map(col => col.Field);
    console.log('📋 Columnas existentes:', existingColumns);
    
    // 3. Definir columnas de seguridad que necesitamos
    const securityColumns = [
      { name: 'login_attempts', type: 'INT DEFAULT 0' },
      { name: 'locked_until', type: 'TIMESTAMP NULL' },
      { name: 'last_failed_attempt', type: 'TIMESTAMP NULL' },
      { name: 'last_login', type: 'TIMESTAMP NULL' }
    ];
    
    // 4. Agregar columnas faltantes
    let columnsAdded = 0;
    for (const col of securityColumns) {
      if (!existingColumns.includes(col.name)) {
        console.log(`   ➕ Agregando columna: ${col.name}`);
        try {
          await connection.execute(`
            ALTER TABLE usuario 
            ADD COLUMN ${col.name} ${col.type}
          `);
          columnsAdded++;
          console.log(`     ✅ Columna ${col.name} agregada`);
        } catch (alterError) {
          console.log(`     ⚠️  No se pudo agregar ${col.name}: ${alterError.message}`);
        }
      } else {
        console.log(`   ✓ Columna ${col.name} ya existe`);
      }
    }
    
    if (columnsAdded > 0) {
      console.log(`✅ Se agregaron ${columnsAdded} columnas de seguridad`);
    } else {
      console.log('✅ Todas las columnas de seguridad ya existen');
    }
    
    return { success: true, message: 'Configuración completada' };
    
  } catch (error) {
    console.error('❌ Error en setupSecurityColumns:', error.message);
    return { success: false, message: error.message };
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ===== INICIAR SERVIDOR =====
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // 1. Verificar conexión a la base de datos
    console.log('🔌 Verificando conexión a la base de datos...');
    const dbCheck = await checkDatabaseConnection();
    
    // ✅ CORREGIDO: Verificar correctamente el resultado
    if (!dbCheck || !dbCheck.success) {
      console.error('❌ No se puede continuar sin conexión a la base de datos');
      console.log('💡 Verifica:');
      console.log('   1. Que MySQL esté corriendo');
      console.log('   2. Las credenciales en .env');
      console.log('   3. Que la base de datos "findyrate" exista');
      process.exit(1);
    }
    
    console.log(dbCheck.message);
    
    // 2. Configurar columnas de seguridad
    console.log('🛡️  Configurando seguridad...');
    const securitySetup = await setupSecurityColumns();
    
    // ✅ CORREGIDO: Verificar correctamente el resultado
    if (securitySetup && !securitySetup.success) {
      console.warn('⚠️  Advertencia en configuración de seguridad:', securitySetup.message);
      console.log('💡 Puedes continuar, pero algunas funciones de seguridad podrían no estar disponibles');
    } else if (securitySetup) {
      console.log(securitySetup.message);
    }
    
    // 3. Configurar rutas
    app.use('/api/auth', authRoutes);
    
    // 4. Ruta de prueba
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Backend funcionando',
        timestamp: new Date().toISOString()
      });
    });
    
    // 5. Ruta de prueba de base de datos
    app.get('/api/db-test', async (req, res) => {
      try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        connection.release();
        res.json({ 
          success: true, 
          message: 'Conexión a BD OK',
          result: rows[0].result 
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: 'Error en BD',
          error: error.message 
        });
      }
    });
    
    // 6. Ruta para verificar tabla usuario
    app.get('/api/check-user-table', async (req, res) => {
      try {
        const connection = await pool.getConnection();
        const [tables] = await connection.execute("SHOW TABLES LIKE 'usuario'");
        const [columns] = await connection.execute("SHOW COLUMNS FROM usuario");
        connection.release();
        
        res.json({ 
          success: true, 
          tableExists: tables.length > 0,
          columns: columns.map(col => ({
            name: col.Field,
            type: col.Type,
            nullable: col.Null === 'YES'
          }))
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: error.message 
        });
      }
    });
    
    // 7. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🎉 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  DB test: http://localhost:${PORT}/api/db-test`);
      console.log(`👤 User table check: http://localhost:${PORT}/api/check-user-table`);
    });
    
  } catch (error) {
    console.error('❌ Error crítico al iniciar servidor:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();