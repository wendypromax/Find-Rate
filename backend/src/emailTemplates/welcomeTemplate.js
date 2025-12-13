export const generateWelcomeEmail = (nombreUsuario, emailUsuario) => {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a FindyRate!</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8fafc; 
        }
        .container { 
            background-color: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .logo { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px; 
        }
        .content { 
            padding: 30px; 
        }
        .welcome { 
            color: #4f46e5; 
            font-size: 24px; 
            margin-bottom: 20px; 
        }
        .user-info { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #4f46e5; 
            margin: 20px 0; 
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #4f46e5, #7c3aed); 
            color: white; 
            padding: 14px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            text-align: center; 
            margin: 25px 0; 
            transition: all 0.3s; 
        }
        .btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 12px rgba(79, 70, 229, 0.3); 
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            color: #6b7280; 
            font-size: 14px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📍 FindyRate</div>
            <p>Descubre y califica los mejores lugares</p>
        </div>
        
        <div class="content">
            <h2 class="welcome">¡Hola ${nombreUsuario}! 👋</h2>
            
            <p>🎉 <strong>¡Bienvenido a nuestra comunidad!</strong></p>
            
            <div class="user-info">
                <p style="margin: 0;"><strong>Tu cuenta:</strong> ${emailUsuario}</p>
            </div>
            
            <p>Ya puedes comenzar a explorar los mejores lugares de Bogotá.</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173/dashboard" class="btn">
                    🚀 Comenzar a Explorar
                </a>
            </div>
            
            <div class="footer">
                <p>📍 Bogotá, Colombia</p>
                <p>© ${currentYear} FindyRate</p>
                <p><small>Email automático - No responder</small></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};