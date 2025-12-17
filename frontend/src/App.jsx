import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  FaBars, 
  FaUser, 
  FaHome, 
  FaHeart, 
  FaStar,
  FaStore, 
  FaUsersCog, 
  FaChartLine,
  FaSignOutAlt,
  FaTimes,
  FaSearch,
  FaMapMarkerAlt,
  FaPlus,
  FaCloudUploadAlt
} from "react-icons/fa";
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
import CargaMasiva from "./pages/admin/CargaMasiva";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Cargar sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfilePic(userData.foto_usuario || null);
    }
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guardar sesión al iniciar
  const handleLogin = (userData) => {
    setUser(userData);
    setProfilePic(userData.foto_usuario || null);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/"); // Redirigir al inicio
  };

  // Cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setProfilePic(null);
    setShowProfileMenu(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Función para obtener iniciales del nombre
  const getInitials = (nombre) => {
    if (!nombre || nombre === "Usuario") return "U";
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determinar rol del usuario
  const getRoleInfo = () => {
    if (!user) return { isAdmin: false, isEmpresario: false, isUsuario: false };
    
    const rolNumber = Number(user.id_tipo_rolfk || user.idTipoRolfk || 0);
    return {
      isAdmin: rolNumber === 3,
      isEmpresario: rolNumber === 2,
      isUsuario: rolNumber === 1,
    };
  };

  const { isAdmin, isEmpresario, isUsuario } = getRoleInfo();

  return (
    <>
      {/* Header principal - Aparece SIEMPRE */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white border-b border-slate-200 shadow-sm">
        {/* Logo y nombre de la app - Izquierda */}
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm md:text-lg font-bold">★</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Find<span className="text-indigo-600">&</span>Rate
          </h1>
        </div>

        {/* Navegación central - Solo muestra links cuando NO hay usuario */}
        {!user && (
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">
              Inicio
            </Link>
            <Link to="/conocenos" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">
              Conócenos
            </Link>
            <Link to="/registro" className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition duration-200 font-medium">
              Registro
            </Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition duration-200 font-semibold">
              Iniciar Sesión
            </Link>
          </nav>
        )}

        {/* Navegación derecha - Solo cuando HAY usuario */}
        {user && (
          <div className="flex items-center space-x-4">
            {/* Menú hamburguesa - Solo visible en móvil */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-gray-700 text-xl focus:outline-none hover:text-indigo-600 transition p-2 rounded-lg hover:bg-gray-100"
              aria-label="Abrir menú"
            >
              <FaBars />
            </button>

            {/* Mensaje de bienvenida - Oculto en móvil */}
            <div className="hidden md:block text-right">
              <p className="font-semibold text-gray-900">
                ¡Hola, {user.nombre_usuario || user.nombre || "Usuario"}!
              </p>
              <p className="text-xs text-gray-500">
                {isUsuario ? "Usuario" : isEmpresario ? "Empresario" : "Administrador"}
              </p>
            </div>

            {/* Foto de perfil con menú desplegable */}
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 md:border-4 border-indigo-200 cursor-pointer hover:border-indigo-400 transition flex items-center justify-center shadow-md"
                role="button"
                aria-label="Menú de perfil"
              >
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm md:text-base font-sans font-bold">
                    {getInitials(user.nombre_usuario || user.nombre)}
                  </div>
                )}
              </div>

              {/* Menú desplegable del perfil */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-xl p-4 text-sm z-30 min-w-56 border border-gray-200">
                  {/* Información del usuario */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">
                      {user.nombre_usuario || "Usuario"}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {user.correo_usuario || user.email}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium mt-2">
                      {isUsuario ? "👤 Usuario" : isEmpresario ? "🏢 Empresario" : "🛠️ Administrador"}
                    </p>
                  </div>

                  {/* Opciones del menú según el rol */}
                  <div className="space-y-2">
                    {/* Opciones para TODOS los usuarios */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/dashboard");
                      }}
                      className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <FaHome className="text-indigo-500" />
                      <span>Mi Panel</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <FaUser className="text-indigo-500" />
                      <span>Mi Perfil</span>
                    </button>

                    {/* Opciones ESPECÍFICAS para USUARIOS */}
                    {isUsuario && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/favoritos");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
                        >
                          <FaHeart className="text-pink-500" />
                          <span>Lugares Favoritos</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/reseñas");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <FaStar className="text-amber-500" />
                          <span>Mis Reseñas</span>
                        </button>
                      </>
                    )}

                    {/* Opciones ESPECÍFICAS para EMPRESARIOS */}
                    {isEmpresario && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/mis-lugares");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FaStore className="text-blue-500" />
                          <span>Mis Lugares</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/lugaresform");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <FaPlus className="text-emerald-500" />
                          <span>Agregar Nuevo Lugar</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/admin/carga-masiva");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                        >
                          <FaCloudUploadAlt className="text-cyan-500" />
                          <span>Carga Masiva de Lugares</span>
                        </button>
                      </>
                    )}

                    {/* Opciones ESPECÍFICAS para ADMINISTRADORES */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/admin/usuarios");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        >
                          <FaUsersCog className="text-purple-500" />
                          <span>Gestionar Usuarios</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/admin/reportes-resenas");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                        >
                          <FaChartLine className="text-violet-500" />
                          <span>Reporte de Reseñas</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/admin/estadisticas");
                          }}
                          className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                        >
                          <FaChartLine className="text-violet-500" />
                          <span>Estadísticas</span>
                        </button>
                      </>
                    )}

                    {/* Separador */}
                    <div className="border-t border-gray-100 pt-2 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Menú lateral hamburguesa - Solo para usuarios logueados en móvil */}
      {user && menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {user && (
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 p-6 transform transition-transform duration-300 ease-in-out md:hidden ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              {/* Encabezado del sidebar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <FaHome className="text-white text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-sans">Menú</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Opciones del menú según rol */}
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                >
                  <FaHome className="text-lg" /> Mi Panel
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                >
                  <FaUser className="text-lg" /> Mi Perfil
                </button>

                {/* Opciones para USUARIOS */}
                {isUsuario && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/favoritos");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaHeart className="text-lg" /> Lugares Favoritos
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/reseñas");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaStar className="text-lg" /> Mis Reseñas
                    </button>
                  </>
                )}

                {/* Opciones para EMPRESARIOS */}
                {isEmpresario && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/mis-lugares");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaStore className="text-lg" /> Mis Lugares
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/lugaresform");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaPlus className="text-lg" /> Agregar Lugar
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/admin/carga-masiva");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaCloudUploadAlt className="text-lg" /> Carga Masiva
                    </button>
                  </>
                )}

                {/* Opciones para ADMINISTRADORES */}
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/admin/usuarios");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaUsersCog className="text-lg" /> Gestionar Usuarios
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/admin/reportes-resenas");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaChartLine className="text-lg" /> Reportes
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/admin/estadisticas");
                      }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition transform hover:-translate-y-0.5 shadow-md font-sans text-left"
                    >
                      <FaChartLine className="text-lg" /> Estadísticas
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Pie del sidebar */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1 font-sans">Sesión activa como:</p>
                <p className="font-semibold text-gray-900 font-sans">
                  {user.nombre_usuario || "Usuario"}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  {user.correo_usuario || user.email}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition transform hover:-translate-y-0.5 shadow-md w-full font-sans"
              >
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Navegación inferior para móviles cuando NO hay usuario */}
      {!user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <nav className="flex justify-around items-center py-3">
            <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
              <FaHome className="text-xl" />
              <span className="text-xs mt-1">Inicio</span>
            </Link>
            <Link to="/conocenos" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
              <FaUser className="text-xl" />
              <span className="text-xs mt-1">Conócenos</span>
            </Link>
            <Link to="/registro" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
              <span className="text-xl">📝</span>
              <span className="text-xs mt-1">Registro</span>
            </Link>
            <Link to="/login" className="flex flex-col items-center text-gray-600 hover:text-indigo-600 transition">
              <FaSignOutAlt className="text-xl" />
              <span className="text-xs mt-1">Ingresar</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Contenido principal con padding para evitar superposición */}
      <div className={`pb-16 ${user ? 'md:pb-0' : ''}`}>
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

          {/* ✅ NUEVA RUTA: Detalle del lugar con reseñas */}
          <Route path="/lugar/:id" element={<DetalleLugar />} />

          {/* Página no encontrada */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <h1 className="text-center text-2xl text-pink-600">
                  Página no encontrada 💭
                </h1>
              </div>
            }
          />
        </Routes>
      </div>

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

// Envolver App dentro del Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}