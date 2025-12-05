// frontend/src/pages/Dashboard.jsx - VERSIÓN CON DISEÑO MEJORADO
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { 
  FaStar, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaBars,
  FaUser,
  FaHeart,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaStore,
  FaPlus,
  FaUsersCog,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaHome,
  FaChartLine
} from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

const Dashboard = () => {
  const navigate = useNavigate();

  // Usar el context de favoritos
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  // Obtener usuario almacenado en localStorage
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Estados principales
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
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

  // Estados para edición
  const [editandoResenia, setEditandoResenia] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState("");
  const [calificacionEditada, setCalificacionEditada] = useState(0);
  const [eliminandoResenia, setEliminandoResenia] = useState(null);

  // Referencias
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Normalizar las propiedades del usuario
          const normalizedUser = {
            // Propiedades en snake_case (como vienen del backend)
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
            
            // Propiedades en camelCase para compatibilidad
            idUsuario: userData.id_usuario || userData.idUsuario,
            nombre: userData.nombre_usuario || userData.nombreUsuario,
            email: userData.correo_usuario || userData.correoUsuario,
          };
          
          setUser(normalizedUser);
          setProfilePic(normalizedUser.foto_usuario || null);
        } else {
          console.warn("No se encontró usuario en localStorage");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
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

  // Función para alternar favorito usando el context
  const toggleFavoritoDashboard = async (lugar, e) => {
    e.stopPropagation(); // Evitar que se active la navegación al lugar
    
    if (!user) {
      setMensaje("Debes iniciar sesión para agregar favoritos");
      return;
    }

    try {
      const nuevoEstado = await toggleFavorito(lugar);
      setMensaje(nuevoEstado ? "❤️ Agregado a favoritos" : "❌ Eliminado de favoritos");
    } catch (error) {
      if (error.message === "Debes iniciar sesión para agregar favoritos") {
        setMensaje("Debes iniciar sesión para agregar favoritos");
      } else {
        console.error("Error al actualizar favorito:", error);
        setMensaje("❌ Error al actualizar favoritos");
      }
    }
  };

  // Roles con manejo seguro - usando snake_case
  const rolNumber = user ? Number(user.id_tipo_rolfk || 0) : 0;
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
    if (!user) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      const updatedUser = { 
        ...user, 
        foto_usuario: reader.result 
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  // Eliminar foto de perfil
  const handleRemovePhoto = (e) => {
    if (e) e.stopPropagation();
    if (!user) return;
    
    setProfilePic(null);
    const updatedUser = { ...user };
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
        const res = await axios.get("http://localhost:5003/api/lugares");
        setLugares(res.data.lugares || []);
      } catch (error) {
        console.error("Error al cargar lugares:", error);
      }
    };
    
    if (user) {
      fetchLugares();
    }
  }, [user]);

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

  // Buscar automáticamente cuando cambian los filtros
  useEffect(() => {
    handleSearch();
  }, [search, filtroLocalidad, lugares]);

  // Ver detalle del lugar - FUNCIÓN CORREGIDA
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
      console.log(`🔍 Cargando reseñas para lugar ID: ${lugar.id_lugar}`);
      
      const resResenias = await axios.get(
        `http://localhost:5003/api/resenias/lugar/${lugar.id_lugar}`
      );
      
      console.log("✅ Reseñas cargadas:", resResenias.data);
      
      const reseñasProcesadas = resResenias.data.resenias.map(resenia => ({
        ...resenia,
        nombre_usuario: resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario"
      }));
      
      setResenias(reseñasProcesadas || []);
    } catch (error) {
      console.error("❌ Error al cargar reseñas:", error);
      console.error("🔍 Detalles:", error.response?.data || error.message);
      setMensaje("❌ Error al cargar las reseñas. Intenta nuevamente.");
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
    setEditandoResenia(null);
    setEliminandoResenia(null);
  };

  // Enviar reseña - FUNCIÓN COMPLETAMENTE CORREGIDA
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
      // Validaciones exhaustivas
      if (!lugarSeleccionado || !lugarSeleccionado.id_lugar) {
        throw new Error("No se ha seleccionado un lugar válido");
      }

      if (!user.id_usuario) {
        throw new Error("Usuario no válido - ID de usuario faltante");
      }

      // Preparar datos asegurando tipos correctos
      const reseñaData = {
        comentario_resenia: comentario.trim(),
        calificacion_resenia: calificacion.toString(),
        id_usuariofk: parseInt(user.id_usuario),
        id_lugarfk: parseInt(lugarSeleccionado.id_lugar)
      };

      console.log("🚀 Enviando reseña:", reseñaData);

      const res = await fetch("http://localhost:5003/api/resenias", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reseñaData),
      });

      const data = await res.json();
      console.log("📨 Respuesta del servidor:", data);

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status}`);
      }

      if (data.success) {
        setMensaje("✅ Reseña publicada correctamente");
        setComentario("");
        setCalificacion(0);
        setMostrarFormulario(false);

        // Recargar las reseñas después de publicar
        setTimeout(() => {
          verDetalle(lugarSeleccionado);
        }, 500);
        
      } else {
        setMensaje("❌ " + (data.message || "Error al publicar reseña"));
      }
    } catch (error) {
      console.error("💥 Error completo:", error);
      setMensaje(`❌ Error: ${error.message || "No se pudo publicar la reseña"}`);
    } finally {
      setEnviando(false);
    }
  };

  // Iniciar edición de reseña
  const iniciarEdicion = (resenia) => {
    setEditandoResenia(resenia.id_resenia);
    setComentarioEditado(resenia.comentario_resenia);
    setCalificacionEditada(parseInt(resenia.calificacion_resenia));
    setEliminandoResenia(null);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoResenia(null);
    setComentarioEditado("");
    setCalificacionEditada(0);
  };

  // Guardar edición de reseña
  const guardarEdicion = async (reseniaId) => {
    if (!comentarioEditado.trim() || calificacionEditada === 0) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5003/api/resenias/${reseniaId}`, {
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
        
        // Actualizar la reseña en el estado local
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
      console.error(error);
      setMensaje("❌ Error al actualizar la reseña");
    }
  };

  // Confirmar eliminación
  const confirmarEliminacion = (resenia) => {
    setEliminandoResenia(resenia.id_resenia);
    setEditandoResenia(null);
  };

  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setEliminandoResenia(null);
  };

  // Eliminar reseña
  const eliminarResenia = async (reseniaId) => {
    try {
      const res = await fetch(`http://localhost:5003/api/resenias/${reseniaId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña eliminada correctamente");
        
        // Remover la reseña del estado local
        setResenias(prev => prev.filter(resenia => resenia.id_resenia !== reseniaId));
        setEliminandoResenia(null);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al eliminar la reseña");
    }
  };

  // Verificar si el usuario es propietario de la reseña
  const esPropietarioResenia = (resenia) => {
    return user && resenia.id_usuariofk === user.id_usuario;
  };

  // Calcular promedio de calificación
  const calcularPromedio = () => {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((acc, r) => acc + Number(r.calificacion_resenia || 0), 0);
    return (suma / resenias.length).toFixed(1);
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

  // Función para generar color basado en el nombre
  const getAvatarColor = (nombre) => {
    if (!nombre || nombre === "Usuario") return '#6B7280';
    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    const index = nombre.length % colors.length;
    return colors[index];
  };

  // Función para formatear el nombre de usuario
  const getDisplayName = (resenia) => {
    return resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario";
  };

  // Mostrar loading mientras se carga el usuario
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-sans">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no hay usuario
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <FaExclamationTriangle className="text-amber-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">Sesión no encontrada</h2>
          <p className="text-gray-600 mb-6 font-sans">Tu sesión ha expirado o no se pudo cargar correctamente.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Si está en vista detalle, mostrar esa pantalla
  if (vistaDetalle && lugarSeleccionado) {
    const promedio = calcularPromedio();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 font-sans">
        {/* Botón volver */}
        <button
          onClick={volverAlListado}
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 hover:text-indigo-800 transition bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <FaArrowLeft /> Volver al listado
        </button>

        {/* Información del lugar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
          {lugarSeleccionado.imagen_lugar && (
            <img
              src={`http://localhost:5003${lugarSeleccionado.imagen_lugar}`}
              alt={lugarSeleccionado.nombre_lugar}
              className="w-full h-48 md:h-64 object-cover rounded-xl mb-6 shadow-lg"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/685/685352.png";
              }}
            />
          )}

          <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {lugarSeleccionado.nombre_lugar}
              </h1>
              <p className="text-gray-700 flex items-center gap-2 text-base md:text-lg">
                <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" />
                {lugarSeleccionado.direccion_lugar}
              </p>
              <p className="text-gray-600 mt-2">
                📍 Localidad: <span className="font-semibold">{lugarSeleccionado.localidad_lugar}</span>
              </p>
            </div>
          </div>

          {/* Calificación promedio */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-6 h-6 md:w-7 md:h-7 ${
                    star <= Math.round(promedio)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900">{promedio}</span>
            <span className="text-gray-600 text-lg">({resenias.length} reseñas)</span>
          </div>
        </div>

        {/* Botón agregar reseña (solo para usuarios) */}
        {isUsuario && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                         text-white font-bold rounded-xl shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-0.5 transition duration-300 flex items-center gap-2"
            >
              {mostrarFormulario ? (
                <>
                  <FaTimes /> Cancelar
                </>
              ) : (
                <>
                  ✍️ Escribir Reseña
                </>
              )}
            </button>
          </div>
        )}

        {/* Formulario de reseña */}
        {mostrarFormulario && isUsuario && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 max-w-2xl mx-auto border border-gray-200">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Comparte tu experiencia
            </h3>

            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-indigo-700 font-medium">
                <span className="font-bold">Publicarás como:</span> {user.nombre_usuario || user.nombre || "Usuario"}
              </p>
              <p className="text-indigo-700 font-medium mt-1">
                <span className="font-bold">Lugar:</span> {lugarSeleccionado.nombre_lugar}
              </p>
            </div>

            <form onSubmit={handleEnviarResenia} className="flex flex-col gap-6">
              {/* Estrellas */}
              <div>
                <label className="block text-gray-900 font-bold mb-3">
                  Calificación *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={36}
                      className={`cursor-pointer transition-all duration-200 ${
                        calificacion >= n
                          ? "text-yellow-500 fill-yellow-500 scale-110"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                      onClick={() => setCalificacion(n)}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {calificacion > 0 ? `✅ Seleccionado: ${calificacion} estrellas` : "👉 Selecciona una calificación"}
                </p>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-gray-900 font-bold mb-3">
                  Tu comentario *
                </label>
                <textarea
                  placeholder="Cuéntanos sobre tu experiencia en este lugar..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  rows={5}
                  required
                />
                <p className="text-gray-600 text-sm mt-2">
                  {comentario.length}/500 caracteres
                </p>
              </div>

              {/* Mensaje */}
              {mensaje && (
                <div className={`p-4 rounded-xl border ${
                  mensaje.startsWith("❌") ? "bg-red-50 border-red-200 text-red-700" : 
                  "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  {mensaje}
                </div>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={enviando || !comentario.trim() || calificacion === 0}
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 
                           text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-indigo-800 
                           transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-indigo-700"
              >
                {enviando ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Publicando...
                  </div>
                ) : (
                  "📤 Publicar Reseña"
                )}
              </button>

              <p className="text-gray-500 text-sm text-center">
                * Campos obligatorios
              </p>
            </form>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Reseñas de usuarios
          </h2>

          {loadingDetalle ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando reseñas...</p>
            </div>
          ) : resenias.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-600 text-lg mb-4">
                Aún no hay reseñas para este lugar.
              </p>
              {isUsuario && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  ¡Sé el primero en opinar!
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {resenias.map((resenia) => {
                const displayName = getDisplayName(resenia);
                const userInitials = getInitials(displayName);
                const avatarColor = getAvatarColor(displayName);
                const esMiResenia = esPropietarioResenia(resenia);
                
                return (
                  <div
                    key={resenia.id_resenia}
                    className="bg-white rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition duration-300 border border-gray-200"
                  >
                    {/* Encabezado de la reseña */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar del usuario */}
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {userInitials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-gray-900 text-lg">
                              {displayName}
                            </p>
                            {esMiResenia && (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                                Tú
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contenedor de estrellas y botones */}
                      <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                        {/* Estrellas de calificación */}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-5 h-5 md:w-6 md:h-6 ${
                                star <= parseInt(resenia.calificacion_resenia)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        
                        {/* Botones de edición/eliminación (solo para el propietario) */}
                        {esMiResenia && !editandoResenia && !eliminandoResenia && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => iniciarEdicion(resenia)}
                              className="text-indigo-600 hover:text-indigo-800 transition p-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2 text-sm font-medium"
                              title="Editar reseña"
                            >
                              <FaEdit size={14} />
                              Editar
                            </button>
                            <button
                              onClick={() => confirmarEliminacion(resenia)}
                              className="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm font-medium"
                              title="Eliminar reseña"
                            >
                              <FaTrash size={14} />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Modo edición */}
                    {editandoResenia === resenia.id_resenia ? (
                      <div className="mt-6 space-y-6">
                        <div>
                          <label className="block text-gray-900 font-bold mb-3">
                            Calificación
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                size={32}
                                className={`cursor-pointer transition ${
                                  calificacionEditada >= n
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300 hover:text-gray-400"
                                }`}
                                onClick={() => setCalificacionEditada(n)}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-900 font-bold mb-3">
                            Comentario
                          </label>
                          <textarea
                            value={comentarioEditado}
                            onChange={(e) => setComentarioEditado(e.target.value)}
                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => guardarEdicion(resenia.id_resenia)}
                            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
                          >
                            <FaCheck /> Guardar cambios
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold"
                          >
                            <FaTimes /> Cancelar
                          </button>
                        </div>
                      </div>
                    ) : eliminandoResenia === resenia.id_resenia ? (
                      /* Confirmación de eliminación */
                      <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-700 font-bold mb-4">
                          ⚠️ ¿Estás seguro de que quieres eliminar esta reseña?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => eliminarResenia(resenia.id_resenia)}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={cancelarEliminacion}
                            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Vista normal de la reseña */
                      <p className="text-gray-700 leading-relaxed mt-4 text-base">
                        {resenia.comentario_resenia}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista principal del dashboard
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col relative overflow-y-auto font-sans">
      {/* Encabezado */}
      <header className="flex justify-between items-center p-5 bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-20 border-b border-gray-200">
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="text-gray-700 text-2xl focus:outline-none hover:text-indigo-600 transition p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars />
        </button>

        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {isAdmin
              ? "Panel de Administración"
              : isEmpresario
              ? "Panel Empresario"
              : `Bienvenido, ${user.nombre_usuario || "Usuario"}!`}
          </h1>
          <p className="text-gray-600 text-sm hidden md:block">
            {isUsuario ? "Descubre los mejores lugares" : 
             isEmpresario ? "Gestiona tus lugares" : 
             "Administra la plataforma"}
          </p>
        </div>

        {/* Foto de perfil y nombre */}
        <div className="relative group flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-semibold text-gray-900">{user.nombre_usuario || "Usuario"}</p>
            <p className="text-xs text-gray-500">{isUsuario ? "Usuario" : isEmpresario ? "Empresario" : "Administrador"}</p>
          </div>
          
          <div
            onClick={() => navigate("/profile")}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-4 border-indigo-200 cursor-pointer hover:border-indigo-400 transition flex items-center justify-center shadow-md"
          >
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                {getInitials(user.nombre_usuario || user.nombre)}
              </div>
            )}
          </div>

          {/* Menú desplegable */}
          <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-xl p-3 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 min-w-48 border border-gray-200">
            <p className="font-semibold text-gray-900 mb-2">{user.nombre_usuario || "Usuario"}</p>
            <p className="text-gray-600 text-xs mb-3">{user.correo_usuario}</p>
            <div className="border-t pt-3 space-y-2">
              <label className="block text-indigo-600 hover:text-indigo-800 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition">
                📷 Cambiar foto
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
                  className="block text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg w-full text-left transition"
                >
                  🗑️ Eliminar foto
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg w-full text-left transition"
              >
                👋 Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú lateral */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-30 p-6 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <FaHome className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Menú</h2>
            </div>
            
            <nav className="flex flex-col gap-3">
              {isUsuario && (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/favoritos");
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaHeart className="text-lg" /> Lugares Favoritos
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/reseñas");
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaStar className="text-lg" /> Mis Reseñas
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
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaStore className="text-lg" /> Mis Lugares
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/lugaresform");
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaPlus className="text-lg" /> Agregar Nuevo Lugar
                  </button>
                </>
              )}

              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin/usuarios");
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaUsersCog className="text-lg" /> Gestionar Usuarios
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin/estadisticas");
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition transform hover:-translate-y-0.5 shadow-md"
                  >
                    <FaChartLine className="text-lg" /> Estadísticas
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Sesión activa como:</p>
              <p className="font-semibold text-gray-900">{user.nombre_usuario || "Usuario"}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition transform hover:-translate-y-0.5 shadow-md w-full"
            >
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start mt-6 md:mt-8 space-y-6 md:space-y-8 px-4 md:px-6 pb-10">
        {/* Buscador y filtros */}
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-gray-900 font-semibold mb-2">Buscar lugares</label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Nombre del lugar, tipo, características..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-auto">
                <label className="block text-gray-900 font-semibold mb-2">Filtrar por localidad</label>
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filtroLocalidad}
                    onChange={(e) => setFiltroLocalidad(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none bg-white"
                  >
                    <option value="">Todas las localidades</option>
                    <option value="Suba">Suba</option>
                    <option value="Teusaquillo">Teusaquillo</option>
                    <option value="Usaquén">Usaquén</option>
                    <option value="Chapinero">Chapinero</option>
                    <option value="Kennedy">Kennedy</option>
                    <option value="Engativá">Engativá</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contador y mensajes */}
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold text-gray-900">
              📍 <span className="text-indigo-600">{(searchResult ?? lugares).length}</span> lugares encontrados
            </div>
            
            {mensaje && (
              <div className={`px-4 py-3 rounded-lg ${
                mensaje.startsWith("❤️") ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : 
                mensaje.startsWith("❌") ? "bg-red-100 text-red-700 border border-red-200" : 
                "bg-blue-100 text-blue-700 border border-blue-200"
              }`}>
                {mensaje}
              </div>
            )}
          </div>
        </div>

        {/* Grid de lugares */}
        <div className="w-full max-w-6xl">
          {(searchResult ?? lugares).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {(searchResult ?? lugares).map((lugar) => (
                <div
                  key={lugar.id_lugar}
                  onClick={() => verDetalle(lugar)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-200 group"
                >
                  {/* Imagen */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={
                        lugar.imagen_lugar
                          ? `http://localhost:5003${lugar.imagen_lugar}`
                          : "https://cdn-icons-png.flaticon.com/512/685/685352.png"
                      }
                      alt={lugar.nombre_lugar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/685/685352.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    {isUsuario && (
                      <button 
                        onClick={(e) => toggleFavoritoDashboard(lugar, e)}
                        className={`absolute top-3 right-3 text-2xl p-2 rounded-full backdrop-blur-sm transition ${
                          esFavorito(lugar.id_lugar) 
                            ? "text-red-500 bg-white/90" 
                            : "text-gray-400 bg-white/70 hover:bg-white/90"
                        }`}
                        title={esFavorito(lugar.id_lugar) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      >
                        <FaHeart className={esFavorito(lugar.id_lugar) ? "fill-current" : ""} />
                      </button>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                      {lugar.nombre_lugar}
                    </h3>
                    <p className="text-gray-700 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" /> 
                      <span className="line-clamp-1">{lugar.direccion_lugar}</span>
                    </p>
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Localidad:</span> {lugar.localidad_lugar}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-semibold">Categoría:</span> {lugar.categoria_lugar || "General"}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-1">
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              {lugares.length === 0 ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Cargando lugares...</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron lugares</h3>
                  <p className="text-gray-600 mb-6">Intenta con otros términos de búsqueda</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFiltroLocalidad("");
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;