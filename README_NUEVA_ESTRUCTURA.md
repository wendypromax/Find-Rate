# 🌟 Find & Rate - Proyecto Reestructurado

## 📋 Descripción General

**Find & Rate** es una plataforma web que permite a usuarios buscar, calificar y comentar sobre diversos lugares en Bogotá. El proyecto ha sido completamente reestructurado para mejorar la mantenibilidad, escalabilidad y separación de responsabilidades.

## 📁 Estructura del Proyecto

```
find-rate/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── DashboardHeader.jsx       # Encabezado del dashboard
│   │   │   ├── DashboardSidebar.jsx      # Menú lateral
│   │   │   ├── SearchBar.jsx             # Barra de búsqueda
│   │   │   ├── LugarGridCard.jsx         # Tarjeta de lugar
│   │   │   ├── ReviewForm.jsx            # Formulario de reseñas
│   │   │   ├── ReviewItem.jsx            # Item individual de reseña
│   │   │   ├── LugarCard.jsx             # Tarjeta de lugar (antiguo)
│   │   │   └── PrivateRoute.jsx          # Rutas protegidas
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Dashboard.jsx             # Panel principal (REFACTORIZADO)
│   │   │   ├── Home.jsx                  # Página de inicio
│   │   │   ├── Login.jsx                 # Formulario de login
│   │   │   ├── Registro.jsx              # Formulario de registro
│   │   │   ├── Profile.jsx               # Perfil de usuario
│   │   │   ├── EditarPerfil.jsx          # Editar perfil
│   │   │   ├── Favoritos.jsx             # Lugares favoritos
│   │   │   ├── DetalleLugar.jsx          # Detalle de lugar
│   │   │   ├── LugaresForm.jsx           # Formulario para crear lugares
│   │   │   ├── MisLugares.jsx            # Lugares del usuario
│   │   │   ├── EscribirResena.jsx        # Escribir reseña
│   │   │   ├── PublicarResenia.jsx       # Publicar reseña
│   │   │   ├── Categoria.jsx             # Categorías
│   │   │   ├── Conocenos.jsx             # Información de la empresa
│   │   │   ├── Privacidad.jsx            # Política de privacidad
│   │   │   ├── Terminos.jsx              # Términos de servicio
│   │   │   ├── RecuperarCuenta.jsx       # Recuperar contraseña
│   │   │   ├── ResetPassword.jsx         # Restablecer contraseña
│   │   │   ├── Breadcrumbs.jsx           # Migas de pan
│   │   │   └── categorias/               # Categorías específicas
│   │   │       ├── Hoteles.jsx
│   │   │       ├── Restaurantes.jsx
│   │   │       ├── Entretenimiento.jsx
│   │   │       └── Atracciones.jsx
│   │   ├── context/            # Contextos de React
│   │   │   └── FavoritosContext.jsx      # Gestión de favoritos
│   │   ├── services/           # Servicios API y lógica
│   │   │   ├── api.js                    # Cliente API
│   │   │   ├── lugares.js                # Lógica de lugares
│   │   │   └── posts.js                  # Lógica de posts
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utilidades
│   │   ├── assets/             # Imágenes y recursos estáticos
│   │   ├── App.jsx             # Componente raíz
│   │   ├── App.css             # Estilos globales
│   │   ├── index.css           # Estilos base
│   │   ├── main.jsx            # Punto de entrada
│   │   └── firebaseConfig.js   # Configuración de Firebase
│   ├── public/                 # Archivos estáticos públicos
│   ├── package.json            # Dependencias del frontend
│   ├── vite.config.js          # Configuración de Vite
│   ├── index.html              # HTML principal
│   ├── eslint.config.js        # Configuración de ESLint
│   ├── postcss.config.js       # Configuración de PostCSS
│   └── tailwind.config.js      # Configuración de Tailwind CSS
│
├── backend/                     # API Node.js + Express
│   ├── src/
│   │   ├── config/             # Configuración
│   │   │   └── db.js                    # Conexión a base de datos MySQL
│   │   ├── controllers/        # Controladores (lógica de negocio)
│   │   │   ├── authController.js
│   │   │   ├── lugarController.js
│   │   │   ├── reseniaController.js
│   │   │   ├── favoritosController.js
│   │   │   ├── calificacionController.js
│   │   │   └── ... (más controladores)
│   │   ├── models/             # Modelos de datos
│   │   │   ├── userModel.js
│   │   │   ├── lugarModel.js
│   │   │   ├── reseniaModel.js
│   │   │   ├── favoritosModel.js
│   │   │   └── ... (más modelos)
│   │   ├── routes/             # Rutas de API
│   │   │   ├── authRoutes.js
│   │   │   ├── lugarRoutes.js
│   │   │   ├── reseniaRoutes.js
│   │   │   ├── favoritosRoutes.js
│   │   │   └── ... (más rutas)
│   │   ├── services/           # Servicios (lógica reutilizable)
│   │   │   ├── authService.js
│   │   │   ├── lugarService.js
│   │   │   ├── reseniaService.js
│   │   │   ├── favoritosService.js
│   │   │   └── ... (más servicios)
│   │   ├── middleware/         # Middlewares
│   │   ├── utils/              # Utilidades
│   │   └── server.js           # Servidor principal
│   ├── uploads/                # Carpeta para imágenes subidas
│   ├── package.json            # Dependencias del backend
│   └── .env                    # Variables de entorno
│
├── .gitignore
├── README.md                   # Este archivo
└── Guia_EstandaresCodigo.md    # Guía de estándares de código
```

## 🚀 Cambios Principales de la Reestructuración

### ✅ Frontend

#### Dashboard Refactorizado
El archivo `Dashboard.jsx` (1134 líneas) ha sido dividido en **componentes reutilizables más pequeños**:

1. **DashboardHeader.jsx** - Encabezado con foto de perfil
2. **DashboardSidebar.jsx** - Menú lateral con navegación
3. **SearchBar.jsx** - Barra de búsqueda y filtros
4. **LugarGridCard.jsx** - Tarjeta individual de lugar
5. **ReviewForm.jsx** - Formulario para escribir reseñas
6. **ReviewItem.jsx** - Item individual de reseña con edición/eliminación

#### Beneficios:
- ✨ Componentes más legibles y mantenibles
- 🔄 Mayor reutilización de código
- 🧪 Más fáciles de testear
- 📦 Mejor separación de responsabilidades
- 🚀 Mejor rendimiento (componentes más pequeños)

### ✅ Backend

#### Estructura Mejorada
- Todos los controladores, modelos y rutas están en `src/`
- Nueva carpeta `src/config/` para configuración centralizada
- Base de datos configurada en `src/config/db.js`
- Servidor principal en `src/server.js`

#### Beneficios:
- 📁 Estructura clara y escalable
- 🔒 Mejor separación de responsabilidades
- 🛡️ Configuración centralizada
- 🔌 Fácil de expandir con nuevos módulos

## 🏗️ Requisitos

### Frontend
- Node.js v18+ 
- npm o yarn
- React 18.3.1
- Vite 7.1.7
- Tailwind CSS 4.1.14

### Backend
- Node.js v18+
- npm
- Express 4.19.2
- MySQL 8.0+
- Nodemailer 7.0.6

## ⚙️ Instalación y Configuración

### 1. Frontend

```bash
cd frontend
npm install
```

**Archivo .env (si lo necesitas):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Ejecutar en desarrollo:**
```bash
npm run dev
```

**Build para producción:**
```bash
npm run build
```

### 2. Backend

```bash
cd backend
npm install
```

**Crear archivo .env:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=findyrate
JWT_SECRET=mi_secreto_super_seguro
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_app
```

**Ejecutar en desarrollo (con nodemon):**
```bash
npm run dev
```

**Ejecutar en producción:**
```bash
npm start
```

## 📊 Tecnologías Utilizadas

### Frontend
- **React 18** - Librería UI
- **React Router v7** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Utilidades CSS
- **React Icons** - Iconos
- **Lucide React** - Más iconos
- **Firebase** - Autenticación y almacenamiento
- **React Hot Toast** - Notificaciones
- **Vite** - Constructor de módulos

### Backend
- **Express** - Framework web
- **MySQL2/Promise** - Cliente MySQL
- **BCryptJS** - Hashing de contraseñas
- **JWT (jsonwebtoken)** - Autenticación
- **Nodemailer** - Envío de correos
- **Multer** - Carga de archivos
- **CORS** - Control de origen cruzado
- **Dotenv** - Variables de entorno

## 🔌 Endpoints de API

```
GET  /api/lugares                          # Obtener todos los lugares
POST /api/lugares                          # Crear lugar
GET  /api/lugares/:id                      # Obtener lugar por ID
PUT  /api/lugares/:id                      # Actualizar lugar
DELETE /api/lugares/:id                    # Eliminar lugar

POST /api/resenias                         # Crear reseña
GET  /api/resenias/lugar/:id_lugar         # Obtener reseñas de un lugar
PUT  /api/resenias/:id                     # Actualizar reseña
DELETE /api/resenias/:id                   # Eliminar reseña

POST /api/favoritos/:idUsuario/:idLugar    # Agregar a favoritos
DELETE /api/favoritos/:idUsuario/:idLugar  # Quitar de favoritos
GET  /api/favoritos/:idUsuario             # Obtener favoritos de usuario

POST /api/auth/register                    # Registro de usuario
POST /api/auth/login                       # Login
GET  /api/auth/usuario/:id                 # Obtener usuario
PUT  /api/auth/usuario/:id                 # Actualizar usuario
DELETE /api/auth/usuario/:id               # Eliminar usuario
```

## 🔐 Autenticación

El proyecto utiliza **localStorage** para almacenar la sesión del usuario. Los datos se guardan al iniciar sesión y se recuperan en el Dashboard.

```javascript
// Formato del usuario en localStorage
{
  id_usuario: 1,
  nombre_usuario: "Juan",
  apellido_usuario: "Pérez",
  correo_usuario: "juan@example.com",
  id_tipo_rolfk: 1, // 1: Usuario, 2: Empresario, 3: Admin
  foto_usuario: "data:image/..."
}
```

## 🎯 Roles de Usuario

1. **Usuario (1)** - Puede buscar lugares, escribir reseñas, ver favoritos
2. **Empresario (2)** - Puede crear y gestionar sus propios lugares
3. **Administrador (3)** - Acceso total al sistema

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos
1. Verifica que MySQL esté corriendo: `mysql -u root`
2. Crea la base de datos: `CREATE DATABASE findyrate;`
3. Revisa las credenciales en `.env`

### El frontend no conecta con el backend
1. Verifica que el backend esté ejecutándose en `http://localhost:5000`
2. Revisa la consola del navegador para errores CORS
3. Asegúrate de que CORS está habilitado en `server.js`

### Las imágenes no se cargan
1. Verifica que la carpeta `backend/uploads` exista
2. Comprueba que las rutas sean correctas en los controladores

## 📝 Notas Importantes

- ✅ Las funcionalidades NO han sido alteradas, solo reorganizadas
- ✅ Todos los endpoints siguen siendo los mismos
- ✅ La base de datos no ha sufrido cambios
- ✅ El Dashboard ahora es más mantenible y escalable
- ⚠️ Asegúrate de actualizar las rutas de imports si mueves archivos

## 🚀 Próximos Pasos

1. **Implementar tests** unitarios y de integración
2. **Añadir validaciones** más robustas
3. **Mejorar la seguridad** (HTTPS, rate limiting, etc.)
4. **Optimizar imágenes** con compresión
5. **Implementar caching** con Redis
6. **Agregar análytics** para entender el uso

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización:** 3 de diciembre de 2025
**Versión:** 1.0.1 (Reestructurada)
