// frontend/src/pages/categories/Dashboard.jsx - VERSIÓN SIN HEADER DUPLICADO
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { 
  FaStar, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaHeart,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  // Obtener usuario almacenado en localStorage
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Estados principales
  const [search, setSearch] = useState("");
  const [filtroLocalidad, setFiltroLocalidad] = useState("");
  const [searchResult, setSearchResult] = useState(null);
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

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Referencias
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
    setCurrentPage(1);
  };

  // Buscar automáticamente cuando cambian los filtros
  useEffect(() => {
    handleSearch();
  }, [search, filtroLocalidad, lugares]);

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

  // Enviar reseña
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
        throw new Error("Usuario no válido - ID de usuario faltante");
      }

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

  // --- FUNCIONALIDAD DE PAGINACIÓN ---
  
  // Obtener los lugares actuales (filtrados o todos)
  const lugaresActuales = searchResult ?? lugares;
  const totalLugares = lugaresActuales.length;
  
  // Calcular índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLugares = lugaresActuales.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(totalLugares / itemsPerPage);
  
  // Generar array de números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };
  
  // Cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Cambiar cantidad de items por página
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
  // Ir a primera página
  const goToFirstPage = () => {
    paginate(1);
  };
  
  // Ir a última página
  const goToLastPage = () => {
    paginate(totalPages);
  };
  
  // Ir a página anterior
  const goToPreviousPage = () => {
    paginate(currentPage - 1);
  };
  
  // Ir a página siguiente
  const goToNextPage = () => {
    paginate(currentPage + 1);
  };

  // Mostrar loading mientras se carga el usuario
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-sans font-medium">Cargando tu panel...</p>
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
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-md font-sans"
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
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 hover:text-indigo-800 transition bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 font-sans"
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
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 font-sans">
                {lugarSeleccionado.nombre_lugar}
              </h1>
              <p className="text-gray-700 flex items-center gap-2 text-base md:text-lg font-medium">
                <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" />
                {lugarSeleccionado.direccion_lugar}
              </p>
              <p className="text-gray-600 mt-2 font-sans">
                📍 <span className="font-semibold text-gray-700">Localidad:</span> {lugarSeleccionado.localidad_lugar}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => toggleFavoritoDashboard(lugarSeleccionado, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  esFavorito(lugarSeleccionado.id_lugar)
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <FaHeart className={esFavorito(lugarSeleccionado.id_lugar) ? "fill-current" : ""} />
                {esFavorito(lugarSeleccionado.id_lugar) ? "En favoritos" : "Agregar a favoritos"}
              </button>
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
            <span className="text-2xl md:text-3xl font-bold text-gray-900 font-sans">{promedio}</span>
            <span className="text-gray-600 text-lg font-sans">({resenias.length} reseñas)</span>
          </div>
        </div>

        {/* Botón agregar reseña */}
        {isUsuario && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                         text-white font-bold rounded-xl shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-0.5 transition duration-300 flex items-center gap-2 font-sans"
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
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-sans">
              Comparte tu experiencia
            </h3>

            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-indigo-700 font-medium font-sans">
                <span className="font-bold">Publicarás como:</span> {user.nombre_usuario || user.nombre || "Usuario"}
              </p>
              <p className="text-indigo-700 font-medium mt-1 font-sans">
                <span className="font-bold">Lugar:</span> {lugarSeleccionado.nombre_lugar}
              </p>
            </div>

            <form onSubmit={handleEnviarResenia} className="flex flex-col gap-6">
              {/* Estrellas */}
              <div>
                <label className="block text-gray-900 font-bold mb-3 font-sans">
                  Calificación *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setCalificacion(n)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={36}
                        className={`transition-all duration-200 ${
                          calificacion >= n
                            ? "text-yellow-500 fill-yellow-500 scale-110"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-2 font-sans">
                  {calificacion > 0 ? `✅ Seleccionado: ${calificacion} estrellas` : "👉 Selecciona una calificación"}
                </p>
              </div>

              {/* Comentario */}
              <div>
                <label className="block text-gray-900 font-bold mb-3 font-sans">
                  Tu comentario *
                </label>
                <textarea
                  placeholder="Cuéntanos sobre tu experiencia en este lugar..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 font-sans"
                  rows={5}
                  required
                  maxLength={500}
                />
                <p className="text-gray-600 text-sm mt-2 font-sans">
                  {comentario.length}/500 caracteres
                </p>
              </div>

              {/* Mensaje */}
              {mensaje && (
                <div className={`p-4 rounded-xl border font-sans ${
                  mensaje.startsWith("❌") 
                    ? "bg-red-50 border-red-200 text-red-700" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
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
                           transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-indigo-700 font-sans"
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

              <p className="text-gray-500 text-sm text-center font-sans">
                * Campos obligatorios
              </p>
            </form>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-sans">
            Reseñas de usuarios
          </h2>

          {loadingDetalle ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-sans">Cargando reseñas...</p>
            </div>
          ) : resenias.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-600 text-lg mb-4 font-sans">
                Aún no hay reseñas para este lugar.
              </p>
              {isUsuario && !mostrarFormulario && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-sans font-medium"
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
                            <p className="font-bold text-gray-900 text-lg font-sans">
                              {displayName}
                            </p>
                            {esMiResenia && (
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold font-sans">
                                Tú
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1 font-sans">
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
                        
                        {/* Botones de edición/eliminación */}
                        {esMiResenia && !editandoResenia && !eliminandoResenia && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => iniciarEdicion(resenia)}
                              className="text-indigo-600 hover:text-indigo-800 transition p-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2 text-sm font-medium font-sans border border-indigo-200"
                              title="Editar reseña"
                            >
                              <FaEdit size={14} />
                              Editar
                            </button>
                            <button
                              onClick={() => confirmarEliminacion(resenia)}
                              className="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm font-medium font-sans border border-red-200"
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
                          <label className="block text-gray-900 font-bold mb-3 font-sans">
                            Calificación
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                type="button"
                                key={n}
                                onClick={() => setCalificacionEditada(n)}
                                className="focus:outline-none"
                              >
                                <Star
                                  size={32}
                                  className={`cursor-pointer transition ${
                                    calificacionEditada >= n
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300 hover:text-gray-400"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-900 font-bold mb-3 font-sans">
                            Comentario
                          </label>
                          <textarea
                            value={comentarioEditado}
                            onChange={(e) => setComentarioEditado(e.target.value)}
                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans"
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => guardarEdicion(resenia.id_resenia)}
                            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold font-sans"
                          >
                            <FaCheck /> Guardar cambios
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold font-sans"
                          >
                            <FaTimes /> Cancelar
                          </button>
                        </div>
                      </div>
                    ) : eliminandoResenia === resenia.id_resenia ? (
                      /* Confirmación de eliminación */
                      <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-red-700 font-bold mb-4 font-sans">
                          ⚠️ ¿Estás seguro de que quieres eliminar esta reseña?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => eliminarResenia(resenia.id_resenia)}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold font-sans"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            onClick={cancelarEliminacion}
                            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold font-sans"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Vista normal de la reseña */
                      <p className="text-gray-700 leading-relaxed mt-4 text-base font-sans">
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

  // Vista principal del dashboard - SIN HEADER DUPLICADO
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col relative font-sans">
      {/* NOTA: El header principal está en tu Layout general o App.js */}
      {/* Este dashboard NO tiene header propio */}
      
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-start space-y-6 md:space-y-8 px-4 md:px-6 pb-10 pt-6">
        {/* Buscador y filtros */}
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans">Buscar lugares</h2>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-gray-900 font-semibold mb-2 font-sans">Nombre, tipo o características</label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Ej: Restaurante, Café, Parque..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-sans"
                    aria-label="Buscar lugares"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-auto">
                <label className="block text-gray-900 font-semibold mb-2 font-sans">Localidad</label>
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filtroLocalidad}
                    onChange={(e) => setFiltroLocalidad(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none bg-white font-sans"
                    aria-label="Filtrar por localidad"
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

        {/* Contador y selector de lugares por página */}
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Contador de lugares */}
              <div className="text-lg font-semibold text-gray-900 font-sans">
                📍 <span className="text-indigo-600">{totalLugares}</span> lugares encontrados
              </div>
              
              {/* Selector de lugares por página */}
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-sm font-medium font-sans">Mostrar:</span>
                <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                  {[3, 6, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleItemsPerPageChange(num)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 font-sans ${
                        itemsPerPage === num
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } ${num === 3 ? '' : 'border-l border-gray-300'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-gray-600 text-sm font-sans">por página</span>
              </div>
            </div>
            
            {/* Mensajes de estado */}
            {mensaje && (
              <div className={`px-4 py-3 rounded-lg font-sans ${
                mensaje.startsWith("❤️") 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : mensaje.startsWith("❌") 
                  ? "bg-red-100 text-red-700 border border-red-200" 
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}>
                {mensaje}
              </div>
            )}
          </div>
        </div>

        {/* Grid de lugares */}
        <div className="w-full max-w-6xl">
          {currentLugares.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentLugares.map((lugar) => (
                <div
                  key={lugar.id_lugar}
                  onClick={() => verDetalle(lugar)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer border border-gray-200 group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && verDetalle(lugar)}
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
                            ? "text-red-500 bg-white/90 shadow-md" 
                            : "text-gray-400 bg-white/70 hover:bg-white/90 hover:text-red-400"
                        }`}
                        title={esFavorito(lugar.id_lugar) ? "Quitar de favoritos" : "Agregar a favoritos"}
                        aria-label={esFavorito(lugar.id_lugar) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      >
                        <FaHeart className={esFavorito(lugar.id_lugar) ? "fill-current" : ""} />
                      </button>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition font-sans">
                      {lugar.nombre_lugar}
                    </h3>
                    <p className="text-gray-700 flex items-center gap-2 font-medium font-sans">
                      <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" /> 
                      <span className="line-clamp-1">{lugar.direccion_lugar}</span>
                    </p>
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      <p className="text-gray-600 text-sm font-sans">
                        <span className="font-semibold text-gray-700">Localidad:</span> {lugar.localidad_lugar}
                      </p>
                      {lugar.categoria_lugar && (
                        <p className="text-gray-600 text-sm mt-1 font-sans">
                          <span className="font-semibold text-gray-700">Categoría:</span> {lugar.categoria_lugar}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-1 font-sans">
                        Ver detalles
                      </span>
                      <div className="text-amber-600 font-medium text-sm flex items-center gap-1">
                        <FaStar className="fill-current" />
                        {lugar.promedio_calificacion || "Nuevo"}
                      </div>
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
                  <p className="text-gray-600 text-lg font-sans">Cargando lugares...</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">No se encontraron lugares</h3>
                  <p className="text-gray-600 mb-6 font-sans">Intenta con otros términos de búsqueda</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFiltroLocalidad("");
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-sans font-medium"
                  >
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalLugares > itemsPerPage && (
          <div className="w-full max-w-6xl mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Información de página */}
                <div className="text-gray-700 font-sans">
                  Mostrando <span className="font-bold">{indexOfFirstItem + 1}</span> a{" "}
                  <span className="font-bold">
                    {Math.min(indexOfLastItem, totalLugares)}
                  </span>{" "}
                  de <span className="font-bold">{totalLugares}</span> lugares
                </div>
                
                {/* Controles de paginación */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {/* Botón primera página */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors font-sans ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    title="Primera página"
                    aria-label="Primera página"
                  >
                    <FaAngleDoubleLeft size={16} />
                  </button>
                  
                  {/* Botón página anterior */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-colors font-sans ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    title="Página anterior"
                    aria-label="Página anterior"
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  
                  {/* Números de página */}
                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                        currentPage === number
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      } border`}
                      aria-label={`Ir a página ${number}`}
                      aria-current={currentPage === number ? "page" : undefined}
                    >
                      {number}
                    </button>
                  ))}
                  
                  {/* Botón página siguiente */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors font-sans ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    title="Página siguiente"
                    aria-label="Página siguiente"
                  >
                    <FaChevronRight size={16} />
                  </button>
                  
                  {/* Botón última página */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-colors font-sans ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    title="Última página"
                    aria-label="Última página"
                  >
                    <FaAngleDoubleRight size={16} />
                  </button>
                </div>
                
                {/* Información de páginas */}
                <div className="text-gray-700 hidden md:block font-sans">
                  Página <span className="font-bold">{currentPage}</span> de{" "}
                  <span className="font-bold">{totalPages}</span>
                </div>
              </div>
              
              {/* Selector de página rápida */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-sans">Ir a página:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => paginate(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    aria-label="Seleccionar página"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;