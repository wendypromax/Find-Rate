# 🚀 Guía de Migración y Uso de la Nueva Estructura

## 📍 Índice
1. [Cambios de Rutas](#cambios-de-rutas)
2. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
3. [Estructura de Componentes](#estructura-de-componentes)
4. [Agregar Nuevas Funciones](#agregar-nuevas-funciones)
5. [Troubleshooting](#troubleshooting)

---

## 🗂️ Cambios de Rutas

### Rutas de Importación en el Frontend

**Antes:**
```javascript
import Dashboard from "./pages/Dashboard";
import { useFavoritos } from "./context/FavoritosContext";
import API from "./Data/api";
```

**Después:**
```javascript
// Las rutas siguen siendo iguales desde App.jsx
import Dashboard from "./pages/Dashboard";
import { useFavoritos } from "./context/FavoritosContext";
import API from "./services/api";  // Data cambió a services
```

### Rutas de Importación en el Backend

**Antes:**
```javascript
import { pool } from "../db.js";
```

**Después:**
```javascript
import { pool } from "../config/db.js";
```

---

## 🏃 Cómo Ejecutar el Proyecto

### Opción 1: Dos Terminales (Recomendado)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
# Se abrirá en http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install  # Solo la primera vez
npm run dev
# Se ejecutará en http://localhost:5000
```

### Opción 2: Una Terminal (Concurrente)

Instala `concurrently`:
```bash
npm install -g concurrently
```

En la raíz del proyecto:
```bash
concurrently "cd frontend && npm run dev" "cd backend && npm run dev"
```

---

## 🧩 Estructura de Componentes

### Dashboard (Antes - Monolítico)
```jsx
const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  // ... 30+ más estados
  
  return (
    <div>
      {/* Header */}
      {/* Sidebar */}
      {/* SearchBar */}
      {/* LugarGrid */}
      {/* Vista Detalle */}
    </div>
  );
};
```

### Dashboard (Después - Modular)
```jsx
const Dashboard = () => {
  // Solo estados de alto nivel
  const [menuOpen, setMenuOpen] = useState(false);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  // ... estados principales
  
  return (
    <div>
      <DashboardHeader {...props} />
      <DashboardSidebar {...props} />
      <main>
        <SearchBar {...props} />
        <LugarGridCard {...props} />
        {vistaDetalle && <ReviewForm {...props} />}
      </main>
    </div>
  );
};
```

### Componente Reutilizable - Ejemplo: LugarGridCard

```jsx
// frontend/src/components/LugarGridCard.jsx
const LugarGridCard = ({
  lugar,           // Datos del lugar
  isUsuario,       // Si es usuario normal
  esFavorito,      // Función para verificar favorito
  onCardClick,     // Callback al hacer clic
  onToggleFavorito // Callback al agregar/quitar favorito
}) => {
  return (
    <div onClick={onCardClick}>
      {/* Contenido de la tarjeta */}
    </div>
  );
};

export default LugarGridCard;
```

### Cómo Usar el Componente

```jsx
// En Dashboard.jsx
<LugarGridCard
  lugar={lugar}
  isUsuario={isUsuario}
  esFavorito={esFavorito}
  onCardClick={() => verDetalle(lugar)}
  onToggleFavorito={toggleFavoritoDashboard}
/>
```

---

## 🛠️ Agregar Nuevas Funciones

### 1. Agregar un Nuevo Endpoint Backend

**1.1. Crear el Modelo (`backend/src/models/nuevoModel.js`):**
```javascript
import { pool } from "../config/db.js";

export class NuevoModel {
  static async obtenerTodos() {
    const [rows] = await pool.query("SELECT * FROM nueva_tabla");
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await pool.query(
      "SELECT * FROM nueva_tabla WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}
```

**1.2. Crear el Controlador (`backend/src/controllers/nuevoController.js`):**
```javascript
import { NuevoModel } from "../models/nuevoModel.js";

export const obtenerTodos = async (req, res) => {
  try {
    const datos = await NuevoModel.obtenerTodos();
    res.json({ success: true, datos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await NuevoModel.obtenerPorId(id);
    res.json({ success: true, dato });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**1.3. Crear las Rutas (`backend/src/routes/nuevoRoutes.js`):**
```javascript
import { Router } from "express";
import { obtenerTodos, obtenerPorId } from "../controllers/nuevoController.js";

const router = Router();

router.get("/", obtenerTodos);
router.get("/:id", obtenerPorId);

export default router;
```

**1.4. Registrar Rutas en `backend/src/server.js`:**
```javascript
import nuevoRoutes from "./routes/nuevoRoutes.js";

// ...
app.use("/api/nuevo", nuevoRoutes);
```

### 2. Agregar un Nuevo Componente Frontend

**2.1. Crear el Componente (`frontend/src/components/NuevoComponent.jsx`):**
```jsx
import React from "react";

const NuevoComponent = ({ datos, onAccion }) => {
  return (
    <div className="componente">
      {datos.map((item) => (
        <div key={item.id} onClick={() => onAccion(item)}>
          {item.nombre}
        </div>
      ))}
    </div>
  );
};

export default NuevoComponent;
```

**2.2. Usar en una Página:**
```jsx
// frontend/src/pages/NuevaPage.jsx
import NuevoComponent from "../components/NuevoComponent";

const NuevaPage = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    // Cargar datos del API
    axios.get("http://localhost:5000/api/nuevo")
      .then(res => setDatos(res.data.datos))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Nueva Página</h1>
      <NuevoComponent 
        datos={datos} 
        onAccion={(item) => console.log(item)}
      />
    </div>
  );
};

export default NuevaPage;
```

---

## 🔍 Troubleshooting

### ❌ Error: "Cannot find module '../db.js'"

**Causa:** El archivo está importando de la ubicación antigua

**Solución:**
```javascript
// ❌ Incorrecto:
import { pool } from "../db.js";

// ✅ Correcto:
import { pool } from "../config/db.js";
```

### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa:** Backend no tiene CORS habilitado

**Solución:** Verifica que `server.js` tenga:
```javascript
app.use(cors());
```

### ❌ Error: "Cannot GET /api/nuevo"

**Causa:** La ruta no está registrada en el servidor

**Solución:**
1. Verifica que el archivo de rutas existe
2. Verifica que está importado en `server.js`
3. Verifica que está registrado con `app.use("/api/nuevo", ...)`

### ❌ Error: "localhost:5173 refused to connect"

**Causa:** El frontend no está ejecutándose

**Solución:**
1. Asegúrate de estar en la carpeta `frontend`
2. Ejecuta `npm run dev`
3. Verifica el puerto en la salida de npm

### ❌ Dashboard no se ve correctamente

**Causa:** Componentes no están siendo importados

**Solución:**
1. Verifica que los archivos existen en `frontend/src/components/`
2. Verifica los imports en `Dashboard.jsx`
3. Recarga la página (Ctrl+Shift+R)

---

## 📦 Estructura Recomendada para Nuevas Funciones

Cuando agregues una nueva funcionalidad, sigue este patrón:

```
frontend/src/
├── components/
│   └── Nueva Componente/
│       ├── NuevaComponente.jsx
│       └── NuevaComponente.module.css
├── pages/
│   └── NuevaPage.jsx
├── services/
│   └── nuevaService.js
└── hooks/
    └── useNuevaLogica.js

backend/src/
├── models/
│   └── nuevaModel.js
├── controllers/
│   └── nuevaController.js
├── routes/
│   └── nuevaRoutes.js
└── services/
    └── nuevaService.js
```

---

## 🎯 Checklist para Agregar una Nueva Funcionalidad

### Backend:
- [ ] Crear modelo en `backend/src/models/`
- [ ] Crear controlador en `backend/src/controllers/`
- [ ] Crear rutas en `backend/src/routes/`
- [ ] Registrar rutas en `backend/src/server.js`
- [ ] Probar endpoints con Postman/Thunder Client
- [ ] Actualizar documentación de API

### Frontend:
- [ ] Crear componente en `frontend/src/components/`
- [ ] Crear página si es necesario en `frontend/src/pages/`
- [ ] Crear servicio en `frontend/src/services/`
- [ ] Integrar componente en página principal
- [ ] Probar en navegador
- [ ] Actualizar README

---

## 💡 Mejores Prácticas

1. **Componentes pequeños y reutilizables**
   - Máximo 200 líneas de código
   - Una responsabilidad por componente
   - Props bien definidas

2. **Nombres descriptivos**
   ```javascript
   // ❌ Malo
   const comp = () => {};
   
   // ✅ Bueno
   const LugarGridCard = () => {};
   ```

3. **Separación de responsabilidades**
   ```javascript
   // ❌ Malo: Lógica y renderizado mezclados
   const Dashboard = () => {
     const [data, setData] = useState();
     useEffect(() => {
       // Lógica compleja aquí
     }, []);
     return <div>...</div>;
   };
   
   // ✅ Bueno: Lógica en custom hook
   const useDashboardLogic = () => { /* ... */ };
   const Dashboard = () => {
     const { data } = useDashboardLogic();
     return <div>...</div>;
   };
   ```

4. **Manejo de errores**
   ```javascript
   try {
     const res = await axios.get("/api/endpoint");
     setData(res.data);
   } catch (error) {
     console.error("Error:", error);
     setMensaje("Error al cargar datos");
   }
   ```

---

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

---

**Última actualización:** 3 de diciembre de 2025
**Versión:** 1.0.0
