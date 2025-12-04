// frontend/src/components/LugarGridCard.jsx
import React from "react";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";

const LugarGridCard = ({
  lugar,
  isUsuario,
  esFavorito,
  onCardClick,
  onToggleFavorito
}) => {
  return (
    <div
      onClick={onCardClick}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
    >
      {/* Imagen */}
      <div className="w-full h-40 bg-gray-100">
        <img
          src={
            lugar.imagen_lugar
              ? `http://localhost:5003${lugar.imagen_lugar}`
              : "https://cdn-icons-png.flaticon.com/512/685/685352.png"
          }
          alt={lugar.nombre_lugar}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/685/685352.png";
          }}
        />
      </div>

      {/* Información */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-pink-600 truncate">
          {lugar.nombre_lugar}
        </h3>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <FaMapMarkerAlt className="text-pink-500 flex-shrink-0" /> 
          <span className="truncate">{lugar.direccion_lugar}</span>
        </p>
        <p className="text-gray-500 text-sm">
          Localidad: {lugar.localidad_lugar}
        </p>
        {isUsuario && (
          <button 
            onClick={(e) => onToggleFavorito(lugar, e)}
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
  );
};

export default LugarGridCard;
