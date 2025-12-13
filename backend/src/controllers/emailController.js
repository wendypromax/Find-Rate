// backend/src/controllers/emailController.js
import transporter from '../config/emailConfig.js';
import { generateWelcomeEmail } from '../emailTemplates/welcomeTemplate.js';

console.log('📧 EMAIL CONTROLLER: Cargado correctamente');

const emailController = {
  sendWelcomeEmail: async (userData) => {
    try {
      console.log('📤 EMAIL CONTROLLER: Procesando envío de email...');
      console.log('👤 EMAIL CONTROLLER: Datos usuario:', {
        nombre: userData.nombre_usuario,
        email: userData.correo_usuario
      });
      
      const { nombre_usuario, correo_usuario } = userData;
      
      const mailOptions = {
        from: `"FindyRate" <${process.env.EMAIL_USER}>`,
        to: correo_usuario,
        subject: '🎉 ¡Bienvenido a FindyRate!',
        html: generateWelcomeEmail(nombre_usuario, correo_usuario)
      };

      console.log('📨 EMAIL CONTROLLER: Configuración email:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ EMAIL CONTROLLER: Email enviado exitosamente a: ${correo_usuario}`);
      console.log('📩 EMAIL CONTROLLER: Message ID:', info.messageId);
      
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('❌ EMAIL CONTROLLER: Error crítico:', error.message);
      console.error('🔍 EMAIL CONTROLLER: Stack trace:', error.stack);
      return { success: false, error: error.message };
    }
  }
};

export default emailController;