import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaSearch,
  FaPlus,
  FaStore,
  FaUsersCog,
  FaMapMarkerAlt,
  FaStar
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState(storedUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [profilePic, setProfilePic] = useState(storedUser?.foto_usuario || null);
  const [lugares, setLugares] = useState([]);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const rolNumber = Number(user?.id_tipo_rolfk ?? user?.id_tipo_rol ?? 0);
  const isUsuario = rolNumber === 1;
  const isEmpresario = rolNumber === 2;
  const isAdmin = rolNumber === 3;

  // 🔹 Clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Subir foto de perfil
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

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Traer lugares desde backend
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

  // 🔹 Buscador con filtro de localidad
  const handleSearch = () => {
    let resultado = lugares;

    if (search.trim() !== "") {
      resultado = resultado.filter((lugar) =>
        lugar.nombre_lugar.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filtroLocalidad) {
      resultado = resultado.filter(
        (lugar) =>
          lugar.localidad_lugar?.toLowerCase() === filtroLocalidad.toLowerCase()
      );
    }

    setSearchResult(resultado);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 flex flex-col relative overflow-y-auto">
      {/* Encabezado */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="text-gray-700 text-2xl focus:outline-none"
        >
          <FaBars />
        </button>

        <h1 className="text-2xl font-bold text-pink-600">
          {isAdmin
            ? "Panel de Administración"
            : isEmpresario
            ? "Panel Empresario"
            : "Panel Usuario"}
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
              <button
                onClick={handleRemovePhoto}
                className="block text-red-500 mt-1 hover:underline"
              >
                Eliminar foto
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Menú lateral */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-20 p-6 rounded-r-3xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-6">Menú</h2>
            <nav className="flex flex-col gap-4">
              {/* CLIENTE */}
              {isUsuario && (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/favoritos");
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
                  >
                    <FaHeart /> Lugares Favoritos
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/reseñas");
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
                  >
                    <FaStar /> Reseñas Realizadas
                  </button>
                </>
              )}

              {/* EMPRESARIO */}
              {isEmpresario && (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/mis-lugares");
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
                  >
                    <FaStore /> Ver mis lugares
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/lugaresform");
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
                  >
                    <FaPlus /> Agregar Lugar
                  </button>
                </>
              )}

              {/* ADMIN */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/admin/usuarios");
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-400 to-blue-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
                >
                  <FaUsersCog /> Gestionar Usuarios
                </button>
              )}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start mt-6 space-y-6 px-4">
        {/* 🔍 Buscador con filtro de localidad */}
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-lg rounded-full px-4 py-3 w-full max-w-5xl">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />

          <select
            value={filtroLocalidad}
            onChange={(e) => setFiltroLocalidad(e.target.value)}
            className="bg-gray-100 rounded-lg px-3 py-1 text-gray-700 outline-none"
          >
            <option value="">Localidad</option>
            <option value="Suba">Suba</option>
            <option value="Teusaquillo">Teusaquillo</option>
            <option value="Usaquén">Usaquén</option>
            <option value="Chapinero">Chapinero</option>
            <option value="Kennedy">Kennedy</option>
            <option value="Engativá">Engativá</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition"
          >
            Buscar
          </button>
        </div>

        {/* Contador de tiendas */}
        <div className="w-full max-w-5xl mt-4 text-gray-700 font-medium">
          {(searchResult ?? lugares).length}{" "}
          {(searchResult ?? lugares).length === 1 ? "tienda" : "tiendas"} disponibles
        </div>

        {/* Resultados */}
        <div className="w-full max-w-5xl mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {(searchResult ?? lugares).length > 0 ? (
            (searchResult ?? lugares).map((lugar) => (
              <div
                key={lugar.id_lugar}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 transition transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-pink-600">{lugar.nombre_lugar}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaMapMarkerAlt className="text-pink-500" /> {lugar.direccion_lugar}
                </p>
                <p className="text-gray-500 text-sm">
                  Localidad: {lugar.localidad_lugar}
                </p>
                {isUsuario && (
                  <button className="text-red-500 text-xl self-end hover:scale-110 transition">
                    <FaHeart />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-10">No se encontraron lugares.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;