// backend/src/controllers/emailController.js
import transporter from '../config/emailConfig.js';

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
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; background: white; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; 
                       color: white; text-decoration: none; border-radius: 5px; 
                       margin-top: 20px; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f1f1f1; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 ¡Bienvenido a FindyRate!</h1>
                <p>Tu plataforma de reseñas de confianza</p>
              </div>
              
              <div class="content">
                <h2>Hola ${nombre_usuario},</h2>
                <p>¡Estamos muy contentos de que te hayas unido a nuestra comunidad!</p>
                <p>Con FindyRate puedes:</p>
                <ul>
                  <li>📝 Escribir reseñas de tus lugares favoritos</li>
                  <li>⭐ Calificar establecimientos</li>
                  <li>❤️ Guardar tus lugares preferidos</li>
                  <li>🔍 Descubrir nuevos sitios recomendados</li>
                </ul>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                     class="button">
                    🚀 Comenzar a Explorar
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} FindyRate. Todos los derechos reservados.</p>
                <p>Si tienes alguna pregunta, contáctanos en soporte@findyrate.com</p>
              </div>
            </div>
          </body>
          </html>
        `
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
  },

  // Función para enviar notificación de nueva reseña al administrador
  sendReviewNotification: async (reviewData) => {
    try {
      console.log('📤 EMAIL CONTROLLER: Enviando notificación de nueva reseña...');
      console.log('📝 EMAIL CONTROLLER: Datos reseña:', reviewData);
      
      const { 
        usuario_nombre, 
        usuario_email, 
        lugar_nombre, 
        lugar_direccion,
        lugar_localidad,
        calificacion, 
        comentario,
        fecha,
        reseniaId 
      } = reviewData;
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@findyrate.com';
      
      // Generar estrellas visuales
      const estrellasLlenas = '★'.repeat(calificacion);
      const estrellasVacias = '☆'.repeat(5 - calificacion);
      
      const mailOptions = {
        from: `"FindyRate - Sistema de Reseñas" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `⭐ Nueva reseña publicada - ${lugar_nombre}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; background: white; }
              .review-card { background: #f8f9fa; border-left: 4px solid #667eea; 
                            padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
              .stars { color: #FFD700; font-size: 24px; margin: 10px 0; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; 
                       color: white; text-decoration: none; border-radius: 5px; 
                       margin-top: 20px; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f1f1f1; }
              .info-row { display: flex; margin-bottom: 10px; }
              .info-label { font-weight: bold; width: 120px; color: #555; }
              .info-value { color: #333; }
              .review-text { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⭐ Nueva Reseña Publicada</h1>
                <p>Sistema de notificaciones FindyRate</p>
              </div>
              
              <div class="content">
                <h2>¡Hola Administrador!</h2>
                <p>Se ha publicado una nueva reseña en la plataforma:</p>
                
                <div class="review-card">
                  <h3>${lugar_nombre}</h3>
                  <div class="info-row">
                    <div class="info-label">📍 Dirección:</div>
                    <div class="info-value">${lugar_direccion}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">🏙️ Localidad:</div>
                    <div class="info-value">${lugar_localidad}</div>
                  </div>
                  
                  <div class="stars">
                    ${estrellasLlenas}${estrellasVacias}
                    <span style="color: #666; margin-left: 10px;">(${calificacion}/5)</span>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-label">👤 Usuario:</div>
                    <div class="info-value">${usuario_nombre}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">📧 Email:</div>
                    <div class="info-value">${usuario_email}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">📅 Fecha:</div>
                    <div class="info-value">${fecha}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">🆔 ID Reseña:</div>
                    <div class="info-value">${reseniaId}</div>
                  </div>
                  
                  <p style="margin-top: 15px; font-weight: bold;">💬 Comentario:</p>
                  <div class="review-text">
                    <em>"${comentario}"</em>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/resenias" 
                     class="button">
                    📊 Ver en Panel de Administración
                  </a>
                  <p style="margin-top: 10px; font-size: 14px; color: #666;">
                    O ingresa directamente con: <strong>ID ${reseniaId}</strong>
                  </p>
                </div>
                
                <p style="margin-top: 30px; color: #666; font-size: 14px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                  <strong>📋 Acción sugerida:</strong> 
                  <br>1. Verificar que el comentario cumple con las políticas de la comunidad
                  <br>2. Revisar si hay respuestas del negocio necesarias
                  <br>3. Monitorizar posibles comentarios inapropiados
                </p>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} FindyRate. Todos los derechos reservados.</p>
                <p>📍 Sistema de gestión de reseñas y calificaciones</p>
                <p style="font-size: 11px; color: #888; margin-top: 10px;">
                  Esta es una notificación automática, por favor no responder a este email.
                  <br>Puedes configurar las notificaciones en el panel de administración.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      console.log('📨 EMAIL CONTROLLER: Enviando a administrador:', adminEmail);
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ EMAIL CONTROLLER: Notificación enviada al administrador`);
      console.log('📩 EMAIL CONTROLLER: Message ID:', info.messageId);
      
      return { 
        success: true, 
        messageId: info.messageId,
        to: adminEmail 
      };
      
    } catch (error) {
      console.error('❌ EMAIL CONTROLLER: Error enviando notificación:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default emailController;