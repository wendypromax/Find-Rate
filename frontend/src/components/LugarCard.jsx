// src/components/LugarCard.jsx
import React, { useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaStar, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFavoritos } from "../context/FavoritosContext";

const LugarCard = ({ lugar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [loading, setLoading] = useState(false);

  const toggleFavoritoHandler = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await toggleFavorito(lugar); // ← uso del context
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      alert("Error al actualizar favorito");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/lugar/${lugar.id_lugar}`);
  };

  const favorito = esFavorito(lugar.id_lugar); // ← revisar si es favorito desde el context

  return (
    <div
      className="bg-white border-2 border-pink-100 rounded-xl shadow-md p-5 hover:shadow-lg 
                 transition cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative mb-4">
        {lugar.imagen_lugar ? (
          <img
            src={
              lugar.imagen_lugar.startsWith("http")
                ? lugar.imagen_lugar
                : `http://localhost:5003${lugar.imagen_lugar}`
            }
            alt={lugar.nombre_lugar}
            className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg 
                        flex items-center justify-center">
            <FaStore className="text-pink-400 text-4xl" />
          </div>
        )}

        <button
          onClick={toggleFavoritoHandler}
          disabled={loading}
          className={`absolute top-2 right-2 text-2xl p-2 rounded-full transition-all ${
            favorito
              ? "text-red-500 bg-white/90 shadow-lg"
              : "text-gray-400 bg-white/80 hover:text-red-400 hover:bg-white"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          title={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <FaHeart className={favorito ? "fill-current" : ""} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl text-pink-600 group-hover:text-pink-700 transition">
            {lugar.nombre_lugar}
          </h2>
        </div>

        <p className="text-gray-600 flex items-center gap-2 text-sm">
          <FaMapMarkerAlt className="text-pink-500 flex-shrink-0" />
          <span className="truncate">{lugar.direccion_lugar}</span>
        </p>

        <p className="text-gray-500 text-sm">Localidad: {lugar.localidad_lugar}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">
              {lugar.promedio_estrellas
                ? `${lugar.promedio_estrellas}/5`
                : "Sin reseñas"}
            </span>
          </div>

          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
            {lugar.categoria_lugar || "Gastronomía"}
          </span>
        </div>

        <button
          onClick={handleCardClick}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 
                   text-white font-semibold rounded-lg hover:opacity-90 transition 
                   group-hover:shadow-lg mt-2"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default LugarCard;
