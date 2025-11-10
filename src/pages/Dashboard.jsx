import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { Star } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener usuario almacenado en localStorage
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  // Estados principales
  const [user, setUser] = useState(storedUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [profilePic, setProfilePic] = useState(storedUser?.foto_usuario || null);
  const [lugares, setLugares] = useState([]);
  
  // Estados para vista detalle
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [resenias, setResenias] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Formulario de reseña
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Referencias
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Roles
  const rolNumber = Number(user?.id_tipo_rolfk ?? user?.id_tipo_rol ?? 0);
  const isUsuario = rolNumber === 1;
  const isEmpresario = rolNumber === 2;
  const isAdmin = rolNumber === 3;

  // Cerrar menú al hacer clic fuera
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

  // Eliminar foto de perfil
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

  // Cargar lugares
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

  // Filtrar lugares
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

  // Ver detalle del lugar
  const verDetalle = async (lugar) => {
    setLoadingDetalle(true);
    setVistaDetalle(true);
    setLugarSeleccionado(lugar);
    setMostrarFormulario(false);
    setComentario("");
    setCalificacion(0);
    setMensaje("");

    try {
      const resResenias = await axios.get(
        `http://localhost:5000/api/resenias/lugar/${lugar.id_lugar}`
      );
      setResenias(resResenias.data.resenias || []);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      setResenias([]);
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Volver al listado
  const volverAlListado = () => {
    setVistaDetalle(false);
    setLugarSeleccionado(null);
    setResenias([]);
    setMostrarFormulario(false);
  };

  // Enviar reseña
  const handleEnviarResenia = async (e) => {
    e.preventDefault();

    if (!comentario || calificacion === 0) {
      setMensaje("Por favor escribe un comentario y selecciona una calificación.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5000/api/resenias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_resenia: comentario,
          calificacion_resenia: calificacion,
          id_usuariofk: user.id_usuario,
          id_lugarfk: lugarSeleccionado.id_lugar,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña publicada correctamente");
        setComentario("");
        setCalificacion(0);
        setMostrarFormulario(false);

        // Recargar reseñas
        const resResenias = await axios.get(
          `http://localhost:5000/api/resenias/lugar/${lugarSeleccionado.id_lugar}`
        );
        setResenias(resResenias.data.resenias || []);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  // Calcular promedio de calificación
  const calcularPromedio = () => {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((acc, r) => acc + r.calificacion_resenia, 0);
    return (suma / resenias.length).toFixed(1);
  };

  // Si está en vista detalle, mostrar esa pantalla
  if (vistaDetalle && lugarSeleccionado) {
    const promedio = calcularPromedio();

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-8">
        {/* Botón volver */}
        <button
          onClick={volverAlListado}
          className="flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-800 transition"
        >
          <FaArrowLeft /> Volver atrás
        </button>

        {/* Información del lugar */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {lugarSeleccionado.imagen_lugar && (
            <img
              src={`http://localhost:5000${lugarSeleccionado.imagen_lugar}`}
              alt={lugarSeleccionado.nombre_lugar}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-pink-600 mb-2">
                {lugarSeleccionado.nombre_lugar}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <FaMapMarkerAlt className="text-pink-500" />
                {lugarSeleccionado.direccion_lugar}
              </p>
              <p className="text-gray-500 mt-1">
                Localidad: {lugarSeleccionado.localidad_lugar}
              </p>
            </div>
            {isUsuario && (
              <button className="text-red-500 text-3xl hover:scale-110 transition">
                <FaHeart />
              </button>
            )}
          </div>

          {/* Calificación promedio */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(promedio)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-700">{promedio}</span>
            <span className="text-gray-500">({resenias.length} reseñas)</span>
          </div>
        </div>

        {/* Botón agregar reseña (solo para usuarios) */}
        {isUsuario && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 
                         text-white font-bold rounded-full shadow-lg hover:scale-105 transform 
                         transition duration-300"
            >
              {mostrarFormulario ? "Cancelar" : "✍ Escribir Reseña"}
            </button>
          </div>
        )}

        {/* Formulario de reseña */}
        {mostrarFormulario && isUsuario && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-pink-600 mb-4">
              Compartir tu experiencia
            </h3>

            <form onSubmit={handleEnviarResenia} className="flex flex-col gap-4">
              {/* Estrellas */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Calificación
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={32}
                      className={`cursor-pointer transition ${
                        calificacion >= n
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setCalificacion(n)}
                    />
                  ))}
                </div>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tu comentario
                </label>
                <textarea
                  placeholder="Cuéntanos sobre tu experiencia en este lugar..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  rows={5}
                />
              </div>

              {/* Mensaje */}
              {mensaje && (
                <p
                  className={`text-sm ${
                    mensaje.startsWith("❌") ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {mensaje}
                </p>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 
                           text-white font-bold rounded-full shadow-lg hover:opacity-90 transition"
              >
                {enviando ? "Publicando..." : "Publicar Reseña"}
              </button>
            </form>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">
            Reseñas de clientes
          </h2>

          {resenias.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resenias.map((resenia) => (
                <div
                  key={resenia.id_resenia}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {resenia.nombre_usuario || "Usuario anónimo"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-5 h-5 ${
                            star <= resenia.calificacion_resenia
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {resenia.comentario_resenia}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista principal del dashboard
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

        {/* Foto de perfil */}
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
        {/* Buscador */}
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

        {/* Contador */}
        <div className="w-full max-w-5xl mt-4 text-gray-700 font-medium">
          {(searchResult ?? lugares).length}{" "}
          {(searchResult ?? lugares).length === 1 ? "tienda" : "tiendas"} disponibles
        </div>

        {/* Grid de lugares */}
        <div className="w-full max-w-5xl mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {(searchResult ?? lugares).length > 0 ? (
            (searchResult ?? lugares).map((lugar) => (
              <div
                key={lugar.id_lugar}
                onClick={() => verDetalle(lugar)}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                {/* Imagen */}
                <div className="w-full h-40 bg-gray-100">
                  <img
                    src={
                      lugar.imagen_lugar
                        ? `http://localhost:5000${lugar.imagen_lugar}`
                        : "https://cdn-icons-png.flaticon.com/512/685/685352.png"
                    }
                    alt={lugar.nombre_lugar}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-pink-600">
                    {lugar.nombre_lugar}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt className="text-pink-500" /> {lugar.direccion_lugar}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Localidad: {lugar.localidad_lugar}
                  </p>
                  {isUsuario && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí iría la lógica de favoritos
                      }}
                      className="text-red-500 text-xl self-end hover:scale-110 transition"
                    >
                      <FaHeart />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-10 col-span-full text-center">
              No se encontraron lugares.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;