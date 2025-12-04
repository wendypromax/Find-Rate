// src/pages/Favoritos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaStar, FaArrowLeft, FaStore } from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";

const Favoritos = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { favoritos, loading, operacionLoading, eliminarFavorito } = useFavoritos();
  const [error, setError] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null); // Para controlar qué botón está cargando

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleEliminarFavorito = async (idLugar) => {
    setEliminandoId(idLugar); // Marcar este botón como cargando
    try {
      await eliminarFavorito(idLugar);
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("Error al eliminar el favorito");
    } finally {
      setEliminandoId(null); // Quitar el estado de carga
    }
  };

  // Loading solo para la carga inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-pink-600 text-xl font-semibold">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-800 transition"
        >
          <FaArrowLeft /> Volver atrás
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
            Tus Lugares Favoritos ❤️
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {favoritos.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-pink-50 rounded-full p-6 inline-block mb-4">
                <FaHeart className="text-pink-400 text-4xl" />
              </div>
              <p className="text-gray-600 text-lg mb-6">
                No tienes lugares favoritos aún.
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 
                           text-white font-bold rounded-full shadow-lg hover:opacity-90 transition"
              >
                Explorar Lugares
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritos.map((lugar) => (
                <div
                  key={lugar.id_lugar}
                  className="bg-white border-2 border-pink-100 rounded-xl shadow-md p-5 hover:shadow-lg transition"
                >
                  {/* Imagen del lugar */}
                  <div className="relative mb-4">
                    {lugar.imagen_lugar ? (
                      <img
                        src={
                          lugar.imagen_lugar.startsWith("http")
                            ? lugar.imagen_lugar
                            : `http://localhost:5000${lugar.imagen_lugar}`
                        }
                        alt={lugar.nombre_lugar}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg 
                                      flex items-center justify-center">
                        <FaStore className="text-pink-400 text-4xl" />
                      </div>
                    )}
                  </div>

                  {/* Información del lugar */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-bold text-xl text-pink-600">
                      {lugar.nombre_lugar}
                    </h2>
                    <button
                      onClick={() => handleEliminarFavorito(lugar.id_lugar)}
                      disabled={eliminandoId === lugar.id_lugar}
                      className={`text-2xl transition ${
                        eliminandoId === lugar.id_lugar 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-red-500 hover:scale-110"
                      }`}
                      title={eliminandoId === lugar.id_lugar ? "Eliminando..." : "Eliminar de favoritos"}
                    >
                      {eliminandoId === lugar.id_lugar ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                      ) : (
                        <FaHeart />
                      )}
                    </button>
                  </div>

                  <p className="text-gray-600 flex items-center gap-2 text-sm mb-2">
                    <FaMapMarkerAlt className="text-pink-500" />
                    {lugar.direccion_lugar}
                  </p>

                  <p className="text-gray-500 text-sm mb-3">
                    Localidad: {lugar.localidad_lugar}
                  </p>

                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {lugar.promedio_estrellas
                        ? `${lugar.promedio_estrellas}/5`
                        : "Sin reseñas"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/dashboard"
              className="text-pink-600 font-semibold hover:underline text-lg"
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favoritos;