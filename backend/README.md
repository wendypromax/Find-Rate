# 🔧 Backend - Find & Rate API

API REST de Node.js + Express para la plataforma Find & Rate.

## 📋 Requisitos

- Node.js v16+
- MySQL 8.0+
- npm

## 🚀 Instalación

```bash
npm install
```

## 📝 Configuración

Crear archivo `.env` en la raíz del backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=findyrate
JWT_SECRET=tu_secret_key_aleatorio
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
PORT=5000
```

### ⚠️ Nota sobre contraseña de Gmail:
- NO usar tu contraseña normal
- Usar [Contraseña de aplicación](https://myaccount.google.com/apppasswords) desde Google Account

## 🎯 Scripts

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Conexión MySQL
│   ├── controllers/           # Lógica de negocio
│   ├── models/                # Acceso a datos
│   ├── routes/                # Definición de endpoints
│   ├── services/              # Servicios reutilizables
│   └── server.js              # Servidor principal
├── uploads/                   # Archivos subidos
├── .env                       # Variables de entorno
├── index.js                   # Archivo legacy (no usar)
└── package.json
```

## 🔌 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/user/:id` - Obtener usuario

### Lugares
- `GET /api/lugares` - Listar todos los lugares
- `GET /api/lugares/:id` - Obtener lugar por ID
- `POST /api/lugares` - Crear lugar (requiere autenticación)

### Reseñas
- `GET /api/resenias/:lugarId` - Obtener reseñas de un lugar
- `POST /api/resenias` - Crear reseña
- `PUT /api/resenias/:id` - Editar reseña
- `DELETE /api/resenias/:id` - Eliminar reseña

### Favoritos
- `GET /api/favoritos` - Obtener favoritos del usuario
- `POST /api/favoritos` - Agregar a favoritos
- `DELETE /api/favoritos/:id` - Quitar de favoritos

Ver [README_NUEVA_ESTRUCTURA.md](../README_NUEVA_ESTRUCTURA.md) para documentación completa de endpoints.

## 🗄️ Base de Datos

### Tablas principales:
- `usuario` - Usuarios del sistema
- `lugar` - Lugares para reseñar
- `resenia` - Reseñas y comentarios
- `favorito` - Lugares favoritos
- `tipo_negocio` - Categorías de lugares
- `horario` - Horarios de atención

## 🔐 Autenticación

Utiliza JWT (JSON Web Tokens) con:
- Header: `Authorization: Bearer <token>`
- Token almacenado en localStorage en el frontend

## 📤 Subida de Archivos

- Endpoint: `POST /upload`
- Directorio: `backend/uploads/`
- Tipos permitidos: jpg, jpeg, png, gif

## 🐛 Solución de Problemas

### "Port 5000 already in use"
```bash
# Cambiar puerto en .env
PORT=5001
```

### "Cannot find module 'mysql2'"
```bash
npm install
```

### "Database connection failed"
- Verificar credenciales en `.env`
- Asegurar que MySQL esté corriendo
- Verificar que la base de datos existe

### "Module not found: db.js"
- Verificar que `src/config/db.js` existe
- Verificar las rutas de importación en los archivos

## 📚 Rutas Disponibles

Todas las rutas están registradas en `src/server.js`:

```javascript
import authRoutes from "./routes/authRoutes.js";
import lugarRoutes from "./routes/lugarRoutes.js";
import reseniaRoutes from "./routes/reseniaRoutes.js";
// ... más rutas
```

## 🧪 Testing

Para probar endpoints, usar:
- **Postman** - Importar colección de requests
- **curl** - Línea de comandos
- **Thunder Client** - Extensión VS Code

Ejemplo:
```bash
curl -X GET http://localhost:5000/api/lugares
```

## 📖 Documentación Adicional

- [README_NUEVA_ESTRUCTURA.md](../README_NUEVA_ESTRUCTURA.md) - Documentación técnica completa
- [GUIA_MIGRACION.md](../GUIA_MIGRACION.md) - Cómo agregar nuevas funciones
- [INDICE_DOCUMENTACION.md](../INDICE_DOCUMENTACION.md) - Índice de toda la documentación

## 🤝 Contribuciones

Seguir los estándares en [Guia_EstandaresCodigo.md](../Guia_EstandaresCodigo.md)

## 📝 Changelog

- **v1.0.0** - Reestructuración completa del backend
  - Separación en carpetas: config, controllers, models, routes, services
  - Imports corregidos
  - Database config centralizado
  - Cleanup de código legacy

## 📞 Soporte

Ver [INDICE_DOCUMENTACION.md](../INDICE_DOCUMENTACION.md) para más recursos.

---

**Estado:** ✅ Funcional y listo para producción

## 🛡️ SEGURIDAD IMPLEMENTADA

### 🔒 Protección en Base de Datos
La aplicación utiliza un usuario MySQL con permisos estrictamente limitados:

```sql
-- Usuario de aplicación con permisos limitados
GRANT SELECT, INSERT, UPDATE ON findyrate.* TO 'findyrate_app'@'localhost';

-- Permisos EXPLÍCITAMENTE DENEGADOS:
-- ❌ NO DELETE  → Eliminación física bloqueada
-- ❌ NO DROP    → Borrado de tablas bloqueado  
-- ❌ NO ALTER   → Modificación de estructura bloqueada
-- ❌ NO CREATE  → Creación de tablas bloqueada

