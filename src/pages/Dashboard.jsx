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
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Star } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Usar el context de favoritos
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  // Obtener usuario almacenado en localStorage con manejo de errores mejorado
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
        console.log("Datos de usuario en localStorage:", storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log("Usuario parseado:", userData);
          
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
        const res = await axios.get("http://localhost:5000/api/lugares");
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

  // Ver detalle del lugar
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
      
      console.log("Datos de reseñas recibidos:", resResenias.data.resenias);
      
      const reseñasProcesadas = resResenias.data.resenias.map(resenia => ({
        ...resenia,
        nombre_usuario: resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario"
      }));
      
      setResenias(reseñasProcesadas || []);
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
    setEditandoResenia(null);
    setEliminandoResenia(null);
  };

  // Enviar reseña
  const handleEnviarResenia = async (e) => {
    e.preventDefault();

    if (!user) {
      setMensaje("Debes iniciar sesión para publicar reseñas");
      return;
    }

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

        if (data.resenia) {
          const nuevaReseniaConUsuario = {
            ...data.resenia,
            nombre_usuario: data.resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario"
          };
          setResenias(prev => [nuevaReseniaConUsuario, ...prev]);
        } else {
          const resResenias = await axios.get(
            `http://localhost:5000/api/resenias/lugar/${lugarSeleccionado.id_lugar}`
          );
          
          const reseñasProcesadas = resResenias.data.resenias.map(resenia => ({
            ...resenia,
            nombre_usuario: resenia.nombre_usuario || user.nombre_usuario || user.nombre || "Usuario"
          }));
          
          setResenias(reseñasProcesadas || []);
        }
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

  // Iniciar edición de reseña
  const iniciarEdicion = (resenia) => {
    setEditandoResenia(resenia.id_resenia);
    setComentarioEditado(resenia.comentario_resenia);
    setCalificacionEditada(resenia.calificacion_resenia);
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
    if (!comentarioEditado || calificacionEditada === 0) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/resenias/${reseniaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_resenia: comentarioEditado,
          calificacion_resenia: calificacionEditada,
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
                comentario_resenia: comentarioEditado,
                calificacion_resenia: calificacionEditada
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
      const res = await fetch(`http://localhost:5000/api/resenias/${reseniaId}`, {
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
    const suma = resenias.reduce((acc, r) => acc + r.calificacion_resenia, 0);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no hay usuario
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

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Publicarás como:</strong> {user.nombre_usuario || user.nombre || "Usuario"}
              </p>
            </div>

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
              {resenias.map((resenia) => {
                const displayName = getDisplayName(resenia);
                const userInitials = getInitials(displayName);
                const avatarColor = getAvatarColor(displayName);
                const esMiResenia = esPropietarioResenia(resenia);
                
                return (
                  <div
                    key={resenia.id_resenia}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                  >
                    {/* Encabezado de la reseña */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Avatar del usuario */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {userInitials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-lg">
                              {displayName}
                            </p>
                            {esMiResenia && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Tú
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">
                            {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contenedor de estrellas y botones */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Estrellas de calificación */}
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
                        
                        {/* Botones de edición/eliminación (solo para el propietario) */}
                        {esMiResenia && !editandoResenia && !eliminandoResenia && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => iniciarEdicion(resenia)}
                              className="text-blue-500 hover:text-blue-700 transition p-1 rounded hover:bg-blue-50 flex items-center gap-1 text-sm"
                              title="Editar reseña"
                            >
                              <FaEdit size={14} />
                              <span className="text-xs">Editar</span>
                            </button>
                            <button
                              onClick={() => confirmarEliminacion(resenia)}
                              className="text-red-500 hover:text-red-700 transition p-1 rounded hover:bg-red-50 flex items-center gap-1 text-sm"
                              title="Eliminar reseña"
                            >
                              <FaTrash size={14} />
                              <span className="text-xs">Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Modo edición */}
                    {editandoResenia === resenia.id_resenia ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Calificación
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                size={28}
                                className={`cursor-pointer transition ${
                                  calificacionEditada >= n
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={() => setCalificacionEditada(n)}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Comentario
                          </label>
                          <textarea
                            value={comentarioEditado}
                            onChange={(e) => setComentarioEditado(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => guardarEdicion(resenia.id_resenia)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <FaCheck /> Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            <FaTimes /> Cancelar
                          </button>
                        </div>
                      </div>
                    ) : eliminandoResenia === resenia.id_resenia ? (
                      /* Confirmación de eliminación */
                      <div className="mt-4 p-4 bg-red-50 rounded-lg">
                        <p className="text-red-700 font-semibold mb-3">
                          ¿Estás seguro de que quieres eliminar esta reseña?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => eliminarResenia(resenia.id_resenia)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={cancelarEliminacion}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Vista normal de la reseña */
                      <p className="text-gray-700 leading-relaxed mt-3">
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

        {/* Mensaje de favoritos */}
        {mensaje && (
          <div className={`w-full max-w-5xl p-3 rounded-lg text-center ${
            mensaje.startsWith("❤️") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {mensaje}
          </div>
        )}

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
                      onClick={(e) => toggleFavoritoDashboard(lugar, e)}
                      className={`text-xl self-end hover:scale-110 transition ${
                        esFavorito(lugar.id_lugar) ? "text-red-500" : "text-gray-400"
                      }`}
                      title={esFavorito(lugar.id_lugar) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <FaHeart className={esFavorito(lugar.id_lugar) ? "fill-current" : ""} />
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