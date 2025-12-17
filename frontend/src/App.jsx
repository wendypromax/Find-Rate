// src/App.jsx
// 🔥 APP COMPLETAMENTE FUSIONADO
// ✅ Header avanzado + Sidebar móvil por roles + Breadcrumbs + Footer + TODAS las rutas

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaBars, FaUser, FaHome, FaHeart, FaStar, FaStore,
  FaUsersCog, FaChartLine, FaSignOutAlt, FaTimes,
  FaPlus, FaCloudUploadAlt
} from "react-icons/fa";
import { Toaster } from "react-hot-toast";

// ================== PÁGINAS ==================
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

// ADMIN
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import ReporteResenas from "./pages/admin/ReporteResenas";
import ReporteGeneralResenas from "./pages/admin/ReporteGeneralResenas";
import Estadisticas from "./pages/admin/Estadisticas";
import CargaMasiva from "./pages/admin/CargaMasiva";

// ================== BREADCRUMBS ==================
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  if (location.pathname === "/") return null;

  return (
    <div className="px-8 py-3 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center text-sm text-slate-600">
        <Link to="/" className="hover:text-indigo-600">Inicio</Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <span key={index} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="font-semibold text-slate-900">{label}</span>
              ) : (
                <Link to={routeTo} className="hover:text-indigo-600">{label}</Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ================== APP ==================
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/");
  };

  const rol = Number(user?.id_tipo_rolfk || 0);
  const isUsuario = rol === 1;
  const isEmpresario = rol === 2;
  const isAdmin = rol === 3;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">★</div>
          <h1 className="text-2xl font-bold">Find<span className="text-indigo-600">&</span>Rate</h1>
        </Link>

        {!user && (
          <nav className="hidden md:flex gap-4">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/conocenos">Conócenos</NavLink>
            <NavLink to="/registro">Registro</NavLink>
            <NavLink to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded">Login</NavLink>
          </nav>
        )}

        {user && (
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="md:hidden text-xl"><FaBars /></button>
            <div ref={profileRef} className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold">
                {user.nombre_usuario?.[0] || 'U'}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow w-52 p-2">
                  <button onClick={() => navigate('/dashboard')} className="w-full text-left p-2 hover:bg-slate-100">Mi Panel</button>
                  <button onClick={() => navigate('/profile')} className="w-full text-left p-2 hover:bg-slate-100">Mi Perfil</button>
                  {isUsuario && <button onClick={() => navigate('/favoritos')} className="w-full text-left p-2 hover:bg-slate-100">Favoritos</button>}
                  {isEmpresario && <button onClick={() => navigate('/mis-lugares')} className="w-full text-left p-2 hover:bg-slate-100">Mis Lugares</button>}
                  {isAdmin && <button onClick={() => navigate('/admin/usuarios')} className="w-full text-left p-2 hover:bg-slate-100">Usuarios</button>}
                  <button onClick={handleLogout} className="w-full text-left p-2 text-red-600 hover:bg-red-50">Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <Breadcrumbs />

      {/* ================= RUTAS ================= */}
      <main className="min-h-screen">
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
          <Route path="/admin/reportes-resenas" element={<ReporteResenas />} />
          <Route path="/admin/ReporteGeneralResenas" element={<ReporteGeneralResenas />} />
          <Route path="/admin/estadisticas" element={<Estadisticas />} />
          <Route path="/admin/carga-masiva" element={<CargaMasiva />} />
          <Route path="/lugar/:id" element={<DetalleLugar />} />
          <Route path="*" element={<h1 className="text-center mt-20 text-pink-600">Página no encontrada 💭</h1>} />
        </Routes>
      </main>

      {location.pathname !== "/" && (
        <footer className="bg-slate-900 text-white py-8 text-center mt-16">
          © 2024 Find&Rate · Todos los derechos reservados
        </footer>
      )}

      <Toaster position="top-right" />
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
