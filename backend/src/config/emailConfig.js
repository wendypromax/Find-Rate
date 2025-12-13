import nodemailer from 'nodemailer';
import 'dotenv/config.js';

console.log('🔧 Iniciando configuración de email...');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? 'CONFIGURADO' : 'NO CONFIGURADO');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ ERROR al verificar conexión de email:', error.message);
  } else {
    console.log('✅ Servidor de email configurado correctamente');
  }
});

export default transporter;