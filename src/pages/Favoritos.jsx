// src/pages/Favoritos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaStar, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Favoritos = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFavoritos = async () => {
      try {
        // ✅ CORRECCIÓN: Template literal con backticks
        const res = await axios.get(`http://localhost:5000/api/favoritos/${user.id_usuario}`);
        setLugares(res.data || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("");
          setLugares([]);
        } else {
          setError("Error al conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user, navigate]);

  const eliminarFavorito = async (idLugar) => {
    try {
      // ✅ CORRECCIÓN: Template literal con backticks
      await axios.delete(`http://localhost:5000/api/favoritos/${user.id_usuario}/${idLugar}`);
      setLugares(lugares.filter(lugar => lugar.id_lugar !== idLugar));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("Error al eliminar el favorito");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-pink-600 text-xl font-semibold">
        Cargando favoritos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botón volver */}
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

          {lugares.length === 0 ? (
            <div className="text-center py-12">
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
              {lugares.map((lugar) => (
                <div
                  key={lugar.id_lugar}
                  className="bg-white border-2 border-pink-100 rounded-xl shadow-md p-5 hover:shadow-lg transition"
                >
                  {lugar.imagen_lugar && (
                    <img
                      // ✅ CORRECCIÓN: Añadido prefijo del servidor si es ruta relativa
                      src={
                        lugar.imagen_lugar.startsWith('http') 
                          ? lugar.imagen_lugar 
                          : `http://localhost:5000${lugar.imagen_lugar}`
                      }
                      alt={lugar.nombre_lugar}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-bold text-xl text-pink-600">
                      {lugar.nombre_lugar}
                    </h2>
                    <button
                      onClick={() => eliminarFavorito(lugar.id_lugar)}
                      className="text-red-500 text-2xl hover:scale-110 transition"
                      title="Eliminar de favoritos"
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <p className="text-gray-600 flex items-center gap-2 text-sm mb-2">
                    <FaMapMarkerAlt className="text-pink-500" />
                    {lugar.direccion_lugar}
                  </p>
                  
                  <p className="text-gray-500 text-sm mb-3">
                    Localidad: {lugar.localidad_lugar}
                  </p>

                  <div className="flex items-center gap-1 mb-4">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {lugar.promedio_estrellas || "Sin reseñas"}
                    </span>
                  </div>

                  <button
                    // ✅ CORRECCIÓN: Template literal con backticks
                    onClick={() => navigate(`/lugar/${lugar.id_lugar}`)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 
                               text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Ver Detalles
                  </button>
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