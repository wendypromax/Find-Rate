// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Conocenos from "./pages/Conocenos";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import RecuperarCuenta from "./pages/RecuperarCuenta";
import ResetPassword from "./pages/ResetPassword";
import EscribirResena from "./pages/EscribirResena";
import Hoteles from "./pages/categorias/Hoteles";
import Restaurantes from "./pages/categorias/Restaurantes";
import Entretenimiento from "./pages/categorias/Entretenimiento";
import Atracciones from "./pages/categorias/Atracciones";
import Dashboard from "./pages/Dashboard";
import LugaresForm from "./pages/LugaresForm";
import Favoritos from "./pages/Favoritos";
import Profile from "./pages/Profile";
import EditarPerfil from "./pages/EditarPerfil";
import DetalleLugar from "./pages/DetalleLugar";
import MisLugares from "./pages/MisLugares";
import MisResenias from "./pages/MisResenias";
import { Toaster } from "react-hot-toast";
import GestionUsuarios from "./pages/admin/GestionUsuarios";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Cargar sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Guardar sesión al iniciar
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/"); // Redirigir al inicio
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">★</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Find<span className="text-indigo-600">&</span>Rate
          </h1>
        </div>

        <nav className="flex space-x-1 md:space-x-2 items-center">
          {/* Siempre visibles */}
          <Link to="/" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">Inicio</Link>
          <Link to="/conocenos" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">Conócenos</Link>

          {/* Si NO hay sesión → mostrar login y registro */}
          {!user && (
            <>
              <Link to="/registro" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">Registro</Link>
              <Link to="/login" className="ml-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition duration-200 font-semibold">Login</Link>
            </>
          )}

          {/* Si hay sesión → mostrar solo "Mi Panel" */}
          {user && (
            <>
              <Link to="/dashboard" className="ml-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition duration-200 font-semibold">Mi Panel</Link>
            </>
          )}
        </nav>
      </header>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/escribir-resena" element={<EscribirResena />} />
        <Route path="/hoteles" element={<Hoteles />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/entretenimiento" element={<Entretenimiento />} />
        <Route path="/atracciones" element={<Atracciones />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/lugaresform" element={<LugaresForm />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/mis-lugares" element={<MisLugares />} />
        <Route path="/reseñas" element={<MisResenias />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />

        {/* ✅ NUEVA RUTA: Detalle del lugar con reseñas */}
        <Route path="/lugar/:id" element={<DetalleLugar />} />

        {/* Página no encontrada */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-2xl mt-20 text-pink-600">
              Página no encontrada 💭
            </h1>
          }
        />
      </Routes>

      {/* Notificaciones */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
          style: {
            background: "#fff0f6",
            color: "#d63384",
            border: "1px solid #f0a6c5",
            fontWeight: "bold",
            padding: "12px 18px",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          },
          iconTheme: { primary: "#ec4899", secondary: "#fff" },
        }}
      />
    </>
  );
}

// Envolver App dentro del Router (sin FavoritosProvider aquí, ya está en main.jsx)
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
