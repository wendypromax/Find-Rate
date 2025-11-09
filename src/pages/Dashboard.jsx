// src/pages/Dashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaHeart, FaSignOutAlt, FaUser, FaBars, FaSearch, 
  FaFilter, FaChartPie, FaPlus, FaStore, FaUsersCog, 
  FaClipboardList, FaMapMarkerAlt, FaStar 
} from "react-icons/fa";
const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } 
    catch { return null; }
  })();

  const [user, setUser] = useState(storedUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [profilePic, setProfilePic] = useState(storedUser?.foto_usuario || null);
  const [lugares, setLugares] = useState([]);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const rolNumber = Number(user?.id_tipo_rolfk ?? user?.id_tipo_rol ?? 0);
  const isUsuario = rolNumber === 1;
  const isEmpresario = rolNumber === 2;
  const isAdmin = rolNumber === 3;

  const categories = [
    "Restaurantes", "Museos", "Parques", "Hoteles",
    "Barberías", "Piscinas", "Cafeterías", "Centros Comerciales"
  ];

  // Clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subir foto de perfil
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      const updatedUser = { ...(user || {}), foto_usuario: reader.result };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    if (e) e.stopPropagation();
    setProfilePic(null);
    const updatedUser = { ...(user || {}) };
    delete updatedUser.foto_usuario;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Traer lugares desde backend
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lugares");
        setLugares(res.data.lugares || []);
      } catch (error) {
        console.error("Error al cargar lugares:", error);
      }
    };
    fetchLugares();
  }, []);

  // Buscador
  const handleSearch = () => {
    if (search.trim() === "") {
      setSearchResult(null);
      return;
    }
    const filtered = lugares.filter((lugar) =>
      lugar.nombre_lugar.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResult(filtered.length ? filtered : []);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 flex flex-col relative overflow-hidden">
      {/* Encabezado */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <button onClick={() => setMenuOpen((s) => !s)} className="text-gray-700 text-2xl focus:outline-none">
          <FaBars />
        </button>

        <h1 className="text-2xl font-bold text-pink-600">
          {isAdmin ? "Panel de Administración" : isEmpresario ? "Panel Empresario" : "Página Usuario"}
        </h1>

        <div className="relative group flex items-center gap-3">
          <div
            onClick={() => navigate("/profile")}
            className="w-12 h-12 rounded-full overflow-hidden border-4 border-pink-400 cursor-pointer hover:opacity-90 transition flex items-center justify-center"
          >
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                <FaUser />
              </div>
            )}
          </div>

          <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-xl px-3 py-2 text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <label className="block text-blue-600 cursor-pointer hover:underline">
              Cambiar foto
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {profilePic && (
              <button onClick={handleRemovePhoto} className="block text-red-500 mt-1 hover:underline">
                Eliminar foto
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menú lateral */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-20 p-6 rounded-r-3xl transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-6">Menú</h2>
            <nav className="flex flex-col gap-4">
              <button onClick={() => { setMenuOpen(false); navigate("/favoritos"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                <FaHeart /> Lugares Favoritos
              </button>
              <button onClick={() => { setMenuOpen(false); navigate("/reseñas"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                <FaStar /> Reseñas Realizadas
              </button>

              {isEmpresario && (
                <>
                  <button onClick={() => { setMenuOpen(false); navigate("/mis-lugares"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaStore /> Ver mis lugares
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate("/reseñas-empresario"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaClipboardList /> Reseñas Recibidas
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate("/graficas"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaChartPie /> Gráficas
                  </button>
                </>
              )}

              {isAdmin && (
                <>
                  <button onClick={() => { setMenuOpen(false); navigate("/admin/usuarios"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-400 to-blue-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaUsersCog /> Gestionar Usuarios
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate("/admin/lugares"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaStore /> Gestionar Lugares
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate("/admin/reseñas"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaClipboardList /> Gestionar Reseñas
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate("/admin/estadisticas"); }} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
                    <FaChartPie /> Estadísticas
                  </button>
                </>
              )}

              {!isAdmin && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <FaFilter className="text-pink-500" /> Filtros de lugares
                  </h3>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat, i) => (
                      <button key={i} onClick={() => { setMenuOpen(false); navigate(`/categoria/${cat.toLowerCase()}`); }} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-pink-100 transition">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start mt-6 space-y-6 px-4">
        {/* Buscador */}
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-2 w-full max-w-xl">
          <FaSearch className="text-gray-500 text-lg" />
          <input type="text" placeholder="Buscar lugares..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 outline-none text-gray-700"/>
          <button onClick={handleSearch} className="bg-pink-500 text-white px-4 py-1 rounded-full hover:bg-pink-600 transition">Buscar</button>
        </div>

        {/* Agregar lugar */}
        {isEmpresario && (
          <button onClick={() => navigate("/lugaresform")} className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-bold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
            <FaPlus /> Agregar nuevo lugar
          </button>
        )}

        {/* Tarjetas de lugares */}
        <div className="w-full max-w-5xl mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchResult || lugares).map((lugar) => (
            <div key={lugar.id_lugar} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-pink-600">{lugar.nombre_lugar}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <FaMapMarkerAlt className="text-pink-500"/> {lugar.direccion_lugar || "Dirección no disponible"}
              </p>
              {lugar.localidad_lugar && <p className="text-gray-500 text-sm">Localidad: {lugar.localidad_lugar}</p>}
              {lugar.tipo_entrada_lugar && <p className="text-gray-500 text-sm">Tipo: {lugar.tipo_entrada_lugar}</p>}
              {isUsuario && <button className="text-red-500 text-xl self-end hover:scale-110 transition"><FaHeart /></button>}
              {lugar.red_social_lugar && <a href={lugar.red_social_lugar} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline mt-1">Visitar redes sociales</a>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
