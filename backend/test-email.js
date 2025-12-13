// test-email.mjs (o .js con ES modules)
import nodemailer from 'nodemailer';
import 'dotenv/config.js'; // Para cargar variables de entorno

console.log('🔧 TEST: Configurando email...');
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

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ TEST ERROR:', error.message);
  } else {
    console.log('✅ TEST: Conexión OK');
    
    // Enviar email de prueba
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'wendymora525@gmail.com',
      subject: 'TEST FindyRate',
      text: 'Esto es una prueba de email'
    }, (err, info) => {
      if (err) {
        console.error('❌ TEST Send Error:', err.message);
      } else {
        console.log('✅ TEST Email enviado:', info.messageId);
      }
      process.exit();
    });
  }
});