// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  NavLink
} from "react-router-dom";
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
import ReporteResenas from "./pages/admin/ReporteResenas";
import ReporteGeneralResenas from "./pages/admin/ReporteGeneralResenas";
import Estadisticas from "./pages/admin/Estadisticas";

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // No mostrar breadcrumb en la página de inicio
  if (location.pathname === "/") return null;

  return (
    <div className="px-8 py-3 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center text-sm text-slate-600">
        <Link 
          to="/" 
          className="hover:text-indigo-600 hover:underline"
        >
          Inicio
        </Link>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <span key={name} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="font-semibold text-slate-900">
                  {formattedName}
                </span>
              ) : (
                <Link 
                  to={routeTo} 
                  className="hover:text-indigo-600 hover:underline"
                >
                  {formattedName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">★</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Find<span className="text-indigo-600">&</span>Rate
            </h1>
          </Link>

          <nav className="flex items-center space-x-2">
            {/* Solo Inicio, Conócenos, Registro y Login como en tu original */}
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:text-indigo-600'
                }`
              }
            >
              Inicio
            </NavLink>
            
            <NavLink 
              to="/conocenos" 
              className={({isActive}) => 
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-700 hover:text-indigo-600'
                }`
              }
            >
              Conócenos
            </NavLink>

            {!user && (
              <>
                <NavLink 
                  to="/registro" 
                  className={({isActive}) => 
                    `px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-700 hover:text-indigo-600'
                    }`
                  }
                >
                  Registro
                </NavLink>
                
                <NavLink 
                  to="/login"
                  className={({isActive}) => 
                    `px-6 py-2 rounded-lg font-semibold transition-colors ${
                      isActive 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800'
                    }`
                  }
                >
                  Login
                </NavLink>
              </>
            )}

            {user && (
              <NavLink
                to="/dashboard"
                className={({isActive}) => 
                  `ml-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800'
                  }`
                }
              >
                Mi Panel
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* ================= BREADCRUMBS ================= */}
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
          <Route path="/lugar/:id" element={<DetalleLugar />} />

          <Route
            path="*"
            element={
              <h1 className="text-center text-2xl mt-20 text-pink-600">
                Página no encontrada 💭
              </h1>
            }
          />
        </Routes>
      </main>

      {location.pathname !== "/" && (
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm opacity-90">
              © 2024 Find&Rate. Todos los derechos reservados.
            </p>

            <div className="flex justify-center gap-6 mt-4 text-sm">
              <Link to="/privacidad" className="hover:underline hover:text-indigo-400">
                Privacidad
              </Link>
              <Link to="/terminos" className="hover:underline hover:text-indigo-400">
                Términos
              </Link>
              <Link to="/conocenos" className="hover:underline hover:text-indigo-400">
                Contacto
              </Link>
            </div>
          </div>
        </footer>
      )}

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

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}