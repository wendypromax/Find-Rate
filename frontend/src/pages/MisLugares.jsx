import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaStar, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MisLugares = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        if (!user?.id_usuario) return;
        const res = await axios.get(
          `http://localhost:5003/api/lugares/empresario/${user.id_usuario}`
        );
        setLugares(res.data.lugares || []);
      } catch (error) {
        console.error("Error al cargar los lugares del empresario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 text-xl font-semibold font-sans">
        Cargando tus lugares...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8 font-sans">
      {/* Botón para volver atrás */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 hover:text-indigo-800 transition-colors duration-200"
      >
        <FaArrowLeft /> Volver atrás
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 font-sans">
        Mis Lugares Registrados
      </h1>

      {lugares.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No tienes lugares registrados todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lugares.map((lugar) => (
            <div
              key={lugar.id_lugar}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100"
            >
              {lugar.imagen_lugar && (
                <img
                  src={lugar.imagen_lugar}
                  alt={lugar.nombre_lugar}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}
              <h2 className="text-lg font-bold text-gray-800">
                {lugar.nombre_lugar}
              </h2>
              <p className="text-gray-600 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-indigo-500" />
                {lugar.direccion_lugar || "Dirección no disponible"}
              </p>
              <p className="text-gray-500 text-sm">
                {lugar.localidad_lugar || "Localidad no especificada"}
              </p>
              <p className="text-gray-700 text-sm flex items-center gap-1 font-medium">
                <FaStar className="text-amber-500" />{" "}
                {lugar.promedio_estrellas || "Sin reseñas"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisLugares;