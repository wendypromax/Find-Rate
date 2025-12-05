import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaHeart, FaMapMarkerAlt, FaStar, FaArrowLeft, FaStore, 
  FaTag, FaPhone, FaClock, FaTimes, FaGlobe, FaUser, 
  FaCar, FaUtensils, FaWifi, FaPaw, FaCreditCard, FaSmile
} from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

const Favoritos = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { favoritos, loading, eliminarFavorito } = useFavoritos();
  const [eliminandoId, setEliminandoId] = useState(null);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleEliminarFavorito = async (idLugar) => {
    setEliminandoId(idLugar);
    try {
      await eliminarFavorito(idLugar);
      if (lugarSeleccionado?.id_lugar === idLugar) {
        setMostrarModal(false);
        setLugarSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("Error al eliminar el favorito");
    } finally {
      setEliminandoId(null);
    }
  };

  const handleVerDetalles = (lugar) => {
    setLugarSeleccionado(lugar);
    setMostrarModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setLugarSeleccionado(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && mostrarModal) {
        handleCerrarModal();
      }
    };
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [mostrarModal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Cargando tus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all hover:-translate-x-1"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        {/* Contenido principal */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          {/* Encabezado con gradiente */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl mb-6 shadow-lg">
              <FaHeart className="text-gradient-to-r from-pink-500 to-red-500 text-5xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Tus Lugares Favoritos
            </h1>
            <p className="text-gray-500 text-lg">
              {favoritos.length === 0 
                ? "Todavía no tienes lugares favoritos ❤️" 
                : `${favoritos.length} lugar${favoritos.length !== 1 ? 'es' : ''} guardado${favoritos.length !== 1 ? 's' : ''} con amor`}
            </p>
          </div>

          {/* Lista de favoritos */}
          {favoritos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-10 max-w-md mx-auto shadow-lg">
                <div className="text-7xl mb-6 animate-pulse">💖</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tu corazón está vacío
                </h3>
                <p className="text-gray-600 mb-8">
                  Guarda tus primeros lugares favoritos para llenarlo de alegría.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                             text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-600 
                             transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explorar Lugares
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Grid de favoritos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoritos.map((lugar) => (
                  <div
                    key={lugar.id_lugar}
                    className="group bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-indigo-300 
                             transition-all duration-500 overflow-hidden hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Imagen del lugar */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden">
                      {lugar.imagen_lugar ? (
                        <img
                          src={
                            lugar.imagen_lugar.startsWith("http")
                              ? lugar.imagen_lugar
                              : `http://localhost:5003${lugar.imagen_lugar}`
                          }
                          alt={lugar.nombre_lugar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 
                                      flex items-center justify-center">
                          <FaStore className="text-indigo-500 text-7xl opacity-80" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Badge de categoría flotante */}
                      {lugar.categoria_lugar && (
                        <div className="absolute top-4 left-4 animate-slide-in">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 
                                        rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl">
                            <FaTag className="text-xs" />
                            {lugar.categoria_lugar}
                          </div>
                        </div>
                      )}

                      {/* Botón de corazón con efecto */}
                      <button
                        onClick={() => handleEliminarFavorito(lugar.id_lugar)}
                        disabled={eliminandoId === lugar.id_lugar}
                        className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300
                                  ${eliminandoId === lugar.id_lugar 
                                    ? "bg-gray-300 cursor-not-allowed" 
                                    : "bg-white/80 hover:bg-white text-red-500 hover:scale-110 hover:shadow-2xl"}`}
                      >
                        {eliminandoId === lugar.id_lugar ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        ) : (
                          <FaHeart className="text-red-500 animate-pulse" />
                        )}
                      </button>

                      {/* Overlay de gradiente */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-6">
                      {/* Header con título y calificación */}
                      <div className="mb-5">
                        <h2 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 
                                     transition-all duration-300 line-clamp-1 mb-3">
                          {lugar.nombre_lugar}
                        </h2>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`w-5 h-5 transition-all ${star <= Math.floor(lugar.promedio_estrellas || 0)
                                    ? "text-yellow-400 drop-shadow-sm"
                                    : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 font-bold text-gray-900">
                              {lugar.promedio_estrellas 
                                ? parseFloat(lugar.promedio_estrellas).toFixed(1) 
                                : "Nuevo"}
                            </span>
                          </div>
                          <div className="h-4 w-px bg-gray-300"></div>
                          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {lugar.localidad_lugar}
                          </span>
                        </div>
                      </div>

                      {/* Información básica */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <FaMapMarkerAlt className="text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Dirección</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{lugar.direccion_lugar}</p>
                          </div>
                        </div>

                        {lugar.telefono_lugar && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <FaPhone className="text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Teléfono</p>
                              <p className="text-sm text-gray-600">{lugar.telefono_lugar}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botón de acción */}
                      <button
                        onClick={() => handleVerDetalles(lugar)}
                        className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white 
                                 font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 
                                 transition-all duration-300 shadow-md hover:shadow-lg 
                                 flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Ver detalles completos</span>
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie de página */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-gray-900">
                      {favoritos.length} <span className="text-indigo-500">favorito{favoritos.length !== 1 ? 's' : ''}</span>
                    </p>
                    <p className="text-gray-500 mt-2">
                      Haz clic en cualquier tarjeta para ver todos los detalles
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/dashboard"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 
                               font-medium rounded-xl hover:from-indigo-100 hover:to-purple-100 
                               transition-all border border-indigo-100"
                    >
                      Explorar más lugares
                    </Link>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 
                               transition-all shadow-md"
                    >
                      Volver arriba
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de detalles - Versión mejorada */}
      {mostrarModal && lugarSeleccionado && (
        <>
          {/* Overlay con efecto glassmorphism */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-300 animate-fade-in"
            onClick={handleCerrarModal}
          ></div>
          
          {/* Modal principal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-in">
            <div 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen de fondo con gradiente */}
              <div className="relative h-72 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                {/* Imagen del lugar */}
                {lugarSeleccionado.imagen_lugar ? (
                  <img
                    src={lugarSeleccionado.imagen_lugar.startsWith("http")
                      ? lugarSeleccionado.imagen_lugar
                      : `http://localhost:5003${lugarSeleccionado.imagen_lugar}`}
                    alt={lugarSeleccionado.nombre_lugar}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaStore className="text-white text-9xl opacity-40" />
                  </div>
                )}
                
                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Contenido superior */}
                <div className="absolute top-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <FaStore className="text-white text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                          {lugarSeleccionado.nombre_lugar}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`w-5 h-5 ${star <= Math.floor(lugarSeleccionado.promedio_estrellas || 0)
                                  ? "text-yellow-300"
                                  : "text-white/50"}`}
                              />
                            ))}
                            <span className="ml-2 text-white font-bold text-lg">
                              {lugarSeleccionado.promedio_estrellas 
                                ? parseFloat(lugarSeleccionado.promedio_estrellas).toFixed(1) 
                                : "Nuevo"}
                            </span>
                          </div>
                          <span className="text-white/80">•</span>
                          <span className="text-white font-medium bg-white/20 px-3 py-1 rounded-full">
                            {lugarSeleccionado.categoria_lugar || "Lugar"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCerrarModal}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 
                               hover:bg-white/20 transition-all hover:scale-110"
                    >
                      <FaTimes className="text-white text-2xl" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto max-h-[calc(95vh-288px)]">
                <div className="p-8">
                  {/* Grid de información principal */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Información de contacto */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                        Información de contacto
                      </h3>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <FaMapMarkerAlt className="text-blue-500 text-xl" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dirección</p>
                            <p className="font-medium text-gray-900">{lugarSeleccionado.direccion_lugar}</p>
                            <p className="text-sm text-gray-600 mt-1">{lugarSeleccionado.localidad_lugar}</p>
                          </div>
                        </div>

                        {lugarSeleccionado.telefono_lugar && (
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                              <FaPhone className="text-green-500 text-xl" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Teléfono</p>
                              <p className="font-medium text-gray-900">{lugarSeleccionado.telefono_lugar}</p>
                            </div>
                          </div>
                        )}

                        {lugarSeleccionado.horario_lugar && (
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                              <FaClock className="text-orange-500 text-xl" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Horario</p>
                              <p className="font-medium text-gray-900">{lugarSeleccionado.horario_lugar}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Características destacadas */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                        Características
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {lugarSeleccionado.precio_promedio && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl">
                            <div className="text-3xl font-bold text-purple-600">
                              ${lugarSeleccionado.precio_promedio}
                            </div>
                            <p className="text-sm text-gray-600">Precio promedio</p>
                          </div>
                        )}

                        {lugarSeleccionado.capacidad_lugar && (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                              <FaUser className="text-blue-500" />
                              <span className="text-lg font-bold text-gray-900">{lugarSeleccionado.capacidad_lugar}</span>
                            </div>
                            <p className="text-sm text-gray-600">Capacidad máxima</p>
                          </div>
                        )}

                        {lugarSeleccionado.tipo_cocina && (
                          <div className="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-2">
                              <FaUtensils className="text-amber-500" />
                              <span className="font-bold text-gray-900">{lugarSeleccionado.tipo_cocina}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Tipo de cocina</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  {lugarSeleccionado.descripcion_lugar && (
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
                        Sobre este lugar
                      </h3>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl">
                        <p className="text-gray-700 leading-relaxed">
                          {lugarSeleccionado.descripcion_lugar}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-4 justify-end">
                    <button
                      onClick={() => handleEliminarFavorito(lugarSeleccionado.id_lugar)}
                      disabled={eliminandoId === lugarSeleccionado.id_lugar}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white 
                               font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 
                               transition-all shadow-lg hover:shadow-xl hover:scale-105 
                               flex items-center gap-2 disabled:opacity-50"
                    >
                      {eliminandoId === lugarSeleccionado.id_lugar ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <FaHeart /> Quitar de favoritos
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCerrarModal}
                      className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 
                               font-semibold rounded-xl hover:from-gray-300 hover:to-gray-400 
                               transition-all border border-gray-300"
                    >
                      Cerrar vista
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agregar estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-in {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-modal-in {
          animation: modal-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        .text-gradient-to-r {
          background: linear-gradient(135deg, #ec4899, #ef4444, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Favoritos;