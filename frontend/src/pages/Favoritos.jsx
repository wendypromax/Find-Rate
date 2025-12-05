import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaStar, FaArrowLeft, FaStore, FaTrash } from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

const Favoritos = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { favoritos, loading, operacionLoading, eliminarFavorito } = useFavoritos();
  const [error, setError] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);

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
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("Error al eliminar el favorito");
    } finally {
      setEliminandoId(null);
    }
  };

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
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        {/* Contenido principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl mb-4">
              <FaHeart className="text-red-500 text-5xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Tus Lugares Favoritos
            </h1>
            <p className="text-gray-600">
              {favoritos.length === 0 
                ? "Todavía no tienes lugares favoritos" 
                : `${favoritos.length} lugar${favoritos.length !== 1 ? 'es' : ''} guardado${favoritos.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Lista de favoritos */}
          {favoritos.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sin favoritos aún
                </h3>
                <p className="text-gray-600 mb-6">
                  Guarda tus lugares favoritos para encontrarlos fácilmente después.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 
                             text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 
                             transition shadow-md hover:shadow-lg"
                >
                  Explorar Lugares
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Grid de favoritos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritos.map((lugar) => (
                  <div
                    key={lugar.id_lugar}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-200 
                             transition-all duration-300 overflow-hidden group"
                  >
                    {/* Imagen del lugar */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {lugar.imagen_lugar ? (
                        <img
                          src={
                            lugar.imagen_lugar.startsWith("http")
                              ? lugar.imagen_lugar
                              : `http://localhost:5003${lugar.imagen_lugar}`
                          }
                          alt={lugar.nombre_lugar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 
                                      flex items-center justify-center">
                          <FaStore className="text-indigo-400 text-5xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      
                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleEliminarFavorito(lugar.id_lugar)}
                        disabled={eliminandoId === lugar.id_lugar}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${
                          eliminandoId === lugar.id_lugar 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-white/90 hover:bg-white text-red-500 hover:scale-110"
                        }`}
                        title={eliminandoId === lugar.id_lugar ? "Eliminando..." : "Quitar de favoritos"}
                      >
                        {eliminandoId === lugar.id_lugar ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        ) : (
                          <FaHeart className="text-red-500" />
                        )}
                      </button>
                    </div>

                    {/* Información del lugar */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h2 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
                          {lugar.nombre_lugar}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0" />
                          <p className="text-sm line-clamp-1">{lugar.direccion_lugar}</p>
                        </div>

                        <div className="text-gray-600 text-sm">
                          📍 Localidad: <span className="font-semibold">{lugar.localidad_lugar}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.floor(lugar.promedio_estrellas || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {lugar.promedio_estrellas 
                                ? `${parseFloat(lugar.promedio_estrellas).toFixed(1)}/5` 
                                : "Sin calificar"}
                            </span>
                          </div>

                          <button
                            onClick={() => navigate(`/lugar/${lugar.id_lugar}`)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Información adicional */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-600">
                    <p className="font-medium">
                      {favoritos.length} lugar{favoritos.length !== 1 ? 'es' : ''} guardado{favoritos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Explorar más lugares
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favoritos;