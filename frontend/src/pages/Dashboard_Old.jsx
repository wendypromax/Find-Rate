// frontend/src/pages/Dashboard.jsx - VERSIÓN REFACTORIZADA
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import SearchBar from "../components/SearchBar";
import LugarGridCard from "../components/LugarGridCard";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";

const Dashboard = () => {
  const navigate = useNavigate();
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  // ===== ESTADOS DE USUARIO =====
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  // ===== ESTADOS DE INTERFAZ =====
  const [menuOpen, setMenuOpen] = useState(false);
  const [vistaDetalle, setVistaDetalle] = useState(false);

  // ===== ESTADOS DE BÚSQUEDA =====
  const [search, setSearch] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // ===== ESTADOS DE DETALLE =====
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [resenias, setResenias] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // ===== ESTADOS DE FORMULARIO DE RESEÑA =====
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // ===== ESTADOS DE EDICIÓN DE RESEÑA =====
  const [editandoResenia, setEditandoResenia] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState("");
  const [calificacionEditada, setCalificacionEditada] = useState(0);
  const [eliminandoResenia, setEliminandoResenia] = useState(null);

  // ===== REFERENCIAS =====
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // ===== EFECTO: Cargar usuario =====
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const normalizedUser = {
            id_usuario: userData.id_usuario || userData.idUsuario,
            num_doc_usuario: userData.num_doc_usuario || userData.numDocUsuario,
            nombre_usuario: userData.nombre_usuario || userData.nombreUsuario,
            apellido_usuario: userData.apellido_usuario || userData.apellidoUsuario,
            correo_usuario: userData.correo_usuario || userData.correoUsuario,
            telefono_usuario: userData.telefono_usuario || userData.telefonoUsuario,
            edad_usuario: userData.edad_usuario || userData.edadUsuario,
            genero_usuario: userData.genero_usuario || userData.generoUsuario,
            id_tipo_rolfk: userData.id_tipo_rolfk || userData.idTipoRolfk,
            estado_usuario: userData.estado_usuario || userData.estadoUsuario,
            foto_usuario: userData.foto_usuario || userData.fotoUsuario,
            idUsuario: userData.id_usuario || userData.idUsuario,
            nombre: userData.nombre_usuario || userData.nombreUsuario,
            email: userData.correo_usuario || userData.correoUsuario,
          };
          
          setUser(normalizedUser);
          setProfilePic(normalizedUser.foto_usuario || null);
        } else {
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [navigate]);

  // ===== EFECTO: Cerrar menú al hacer clic fuera =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== EFECTO: Cargar lugares =====
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lugares");
        setLugares(res.data.lugares || []);
      } catch (error) {
        console.error("Error al cargar lugares:", error);
      }
    };
    
    if (user) fetchLugares();
  }, [user]);

  // ===== EFECTO: Filtrar lugares automáticamente =====
  useEffect(() => {
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
  }, [search, filtroLocalidad, lugares]);

  // ===== COMPUTADAS =====
  const rolNumber = user ? Number(user.id_tipo_rolfk || 0) : 0;
  const isUsuario = rolNumber === 1;
  const isEmpresario = rolNumber === 2;
  const isAdmin = rolNumber === 3;

  const panelTitle = isAdmin
    ? "Panel de Administración"
    : isEmpresario
    ? "Panel Empresario"
    : "Panel Usuario";

  // ===== FUNCIONES: Manejo de fotos de perfil =====
  const handleImageUpload = (e) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      const updatedUser = { ...user, foto_usuario: reader.result };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (!user) return;
    setProfilePic(null);
    const updatedUser = { ...user };
    delete updatedUser.foto_usuario;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== FUNCIONES: Autenticación =====
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ===== FUNCIONES: Favoritos =====
  const toggleFavoritoDashboard = async (lugar, e) => {
    e.stopPropagation();
    
    if (!user) {
      setMensaje("Debes iniciar sesión para agregar favoritos");
      return;
    }

    try {
      const nuevoEstado = await toggleFavorito(lugar);
      setMensaje(nuevoEstado ? "❤️ Agregado a favoritos" : "❌ Eliminado de favoritos");
    } catch (error) {
      setMensaje("❌ Error al actualizar favoritos");
    }
  };

  // ===== FUNCIONES: Vista detalle =====
  const verDetalle = async (lugar) => {
    if (!user) {
      setMensaje("Debes iniciar sesión para ver detalles");
      return;
    }

    setLoadingDetalle(true);
    setVistaDetalle(true);
    setLugarSeleccionado(lugar);
    setMostrarFormulario(false);
    setComentario("");
    setCalificacion(0);
    setMensaje("");
    setEditandoResenia(null);
    setEliminandoResenia(null);

    try {
      const resResenias = await axios.get(
        `http://localhost:5000/api/resenias/lugar/${lugar.id_lugar}`
      );
      
      const reseñasProcesadas = resResenias.data.resenias.map(resenia => ({
        ...resenia,
        nombre_usuario: resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario"
      }));
      
      setResenias(reseñasProcesadas || []);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      setMensaje("❌ Error al cargar las reseñas. Intenta nuevamente.");
      setResenias([]);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const volverAlListado = () => {
    setVistaDetalle(false);
    setLugarSeleccionado(null);
    setResenias([]);
    setMostrarFormulario(false);
    setEditandoResenia(null);
    setEliminandoResenia(null);
  };

  // ===== FUNCIONES: Reseñas =====
  const handleEnviarResenia = async (e) => {
    e.preventDefault();

    if (!user) {
      setMensaje("Debes iniciar sesión para publicar reseñas");
      return;
    }

    if (!comentario.trim() || calificacion === 0) {
      setMensaje("Por favor escribe un comentario y selecciona una calificación.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      if (!lugarSeleccionado || !lugarSeleccionado.id_lugar) {
        throw new Error("No se ha seleccionado un lugar válido");
      }

      if (!user.id_usuario) {
        throw new Error("Usuario no válido");
      }

      const reseñaData = {
        comentario_resenia: comentario.trim(),
        calificacion_resenia: calificacion.toString(),
        id_usuariofk: parseInt(user.id_usuario),
        id_lugarfk: parseInt(lugarSeleccionado.id_lugar)
      };

      const res = await fetch("http://localhost:5000/api/resenias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reseñaData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      if (data.success) {
        setMensaje("✅ Reseña publicada correctamente");
        setComentario("");
        setCalificacion(0);
        setMostrarFormulario(false);
        setTimeout(() => verDetalle(lugarSeleccionado), 500);
      } else {
        setMensaje("❌ " + (data.message || "Error al publicar reseña"));
      }
    } catch (error) {
      setMensaje(`❌ Error: ${error.message || "No se pudo publicar la reseña"}`);
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicion = (resenia) => {
    setEditandoResenia(resenia.id_resenia);
    setComentarioEditado(resenia.comentario_resenia);
    setCalificacionEditada(parseInt(resenia.calificacion_resenia));
    setEliminandoResenia(null);
  };

  const cancelarEdicion = () => {
    setEditandoResenia(null);
    setComentarioEditado("");
    setCalificacionEditada(0);
  };

  const guardarEdicion = async (reseniaId) => {
    if (!comentarioEditado.trim() || calificacionEditada === 0) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/resenias/${reseniaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_resenia: comentarioEditado.trim(),
          calificacion_resenia: calificacionEditada.toString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña actualizada correctamente");
        setResenias(prev => prev.map(resenia => 
          resenia.id_resenia === reseniaId 
            ? { 
                ...resenia, 
                comentario_resenia: comentarioEditado.trim(),
                calificacion_resenia: calificacionEditada.toString()
              }
            : resenia
        ));
        setEditandoResenia(null);
        setComentarioEditado("");
        setCalificacionEditada(0);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      setMensaje("❌ Error al actualizar la reseña");
    }
  };

  const eliminarResenia = async (reseniaId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/resenias/${reseniaId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña eliminada correctamente");
        setResenias(prev => prev.filter(resenia => resenia.id_resenia !== reseniaId));
        setEliminandoResenia(null);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      setMensaje("❌ Error al eliminar la reseña");
    }
  };

  const esPropietarioResenia = (resenia) => {
    return user && resenia.id_usuariofk === user.id_usuario;
  };

  const calcularPromedio = () => {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((acc, r) => acc + Number(r.calificacion_resenia || 0), 0);
    return (suma / resenias.length).toFixed(1);
  };

  const getInitials = (nombre) => {
    if (!nombre || nombre === "Usuario") return "U";
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (nombre) => {
    if (!nombre || nombre === "Usuario") return '#6B7280';
    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    const index = nombre.length % colors.length;
    return colors[index];
  };

  const getDisplayName = (resenia) => {
    return resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario";
  };

  // ===== RENDERIZADO: Loading =====
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  // ===== RENDERIZADO: Sin usuario =====
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sesión no encontrada</h2>
          <p className="text-gray-600 mb-6">Tu sesión ha expirado o no se pudo cargar correctamente.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:opacity-90 transition"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDERIZADO: Vista detalle =====
  if (vistaDetalle && lugarSeleccionado) {
    const promedio = calcularPromedio();

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-4 md:p-8">
        {/* Botón volver */}
        <button
          onClick={volverAlListado}
          className="flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-800 transition"
        >
          <FaArrowLeft /> Volver atrás
        </button>

        {/* Información del lugar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {lugarSeleccionado.imagen_lugar && (
            <img
              src={`http://localhost:5000${lugarSeleccionado.imagen_lugar}`}
              alt={lugarSeleccionado.nombre_lugar}
              className="w-full h-48 md:h-64 object-cover rounded-xl mb-6"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/685/685352.png";
              }}
            />
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-pink-600 mb-2">
            {lugarSeleccionado.nombre_lugar}
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-2">
            {lugarSeleccionado.direccion_lugar}
          </p>
          <p className="text-gray-500">Localidad: {lugarSeleccionado.localidad_lugar}</p>

          {/* Calificación promedio */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    star <= Math.round(promedio)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-700">{promedio}</span>
            <span className="text-gray-500">({resenias.length} reseñas)</span>
          </div>
        </div>

        {/* Botón agregar reseña */}
        {isUsuario && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 
                         text-white font-bold rounded-full shadow-lg hover:scale-105 transform 
                         transition duration-300 text-sm md:text-base"
            >
              {mostrarFormulario ? "Cancelar" : "✍ Escribir Reseña"}
            </button>
          </div>
        )}

        {/* Formulario de reseña */}
        {mostrarFormulario && isUsuario && (
          <ReviewForm
            user={user}
            lugarSeleccionado={lugarSeleccionado}
            comentario={comentario}
            setComentario={setComentario}
            calificacion={calificacion}
            setCalificacion={setCalificacion}
            mensaje={mensaje}
            enviando={enviando}
            onSubmit={handleEnviarResenia}
            onCancel={() => setMostrarFormulario(false)}
          />
        )}

        {/* Lista de reseñas */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6">
            Reseñas de clientes
          </h2>

          {loadingDetalle ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando reseñas...</p>
            </div>
          ) : resenias.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resenias.map((resenia) => (
                <ReviewItem
                  key={resenia.id_resenia}
                  resenia={resenia}
                  esMiResenia={esPropietarioResenia(resenia)}
                  editandoResenia={editandoResenia}
                  eliminandoResenia={eliminandoResenia}
                  comentarioEditado={comentarioEditado}
                  setComentarioEditado={setComentarioEditado}
                  calificacionEditada={calificacionEditada}
                  setCalificacionEditada={setCalificacionEditada}
                  onEdit={iniciarEdicion}
                  onSave={guardarEdicion}
                  onCancel={cancelarEdicion}
                  onDelete={eliminarResenia}
                  onConfirmDelete={(r) => setEliminandoResenia(r.id_resenia)}
                  onCancelDelete={() => setEliminandoResenia(null)}
                  getDisplayName={getDisplayName}
                  getInitials={getInitials}
                  getAvatarColor={getAvatarColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== RENDERIZADO: Vista principal =====
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 flex flex-col relative overflow-y-auto">
      <DashboardHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onProfileClick={() => navigate("/profile")}
        profilePic={profilePic}
        panelTitle={panelTitle}
        fileInputRef={fileInputRef}
        onImageUpload={handleImageUpload}
        onRemovePhoto={handleRemovePhoto}
      />

      <DashboardSidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isUsuario={isUsuario}
        isEmpresario={isEmpresario}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        menuRef={menuRef}
      />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start mt-4 md:mt-6 space-y-4 md:space-y-6 px-4 pb-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          filtroLocalidad={filtroLocalidad}
          setFiltroLocalidad={setFiltroLocalidad}
        />

        {/* Mensaje de favoritos */}
        {mensaje && (
          <div className={`w-full max-w-5xl p-3 rounded-lg text-center ${
            mensaje.startsWith("❤️") ? "bg-green-100 text-green-700" : 
            mensaje.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Contador */}
        <div className="w-full max-w-5xl text-gray-700 font-medium">
          {(searchResult ?? lugares).length}{" "}
          {(searchResult ?? lugares).length === 1 ? "lugar" : "lugares"} disponibles
        </div>

        {/* Grid de lugares */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-2">
          {(searchResult ?? lugares).length > 0 ? (
            (searchResult ?? lugares).map((lugar) => (
              <LugarGridCard
                key={lugar.id_lugar}
                lugar={lugar}
                isUsuario={isUsuario}
                esFavorito={esFavorito}
                onCardClick={() => verDetalle(lugar)}
                onToggleFavorito={toggleFavoritoDashboard}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {lugares.length === 0 ? "Cargando lugares..." : "No se encontraron lugares."}
              </p>
              {lugares.length === 0 && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
