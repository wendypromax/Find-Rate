import React, { useEffect, useState } from "react";
import { FaStar, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MisResenas = () => {
  const navigate = useNavigate();

  // Usuario desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const idUsuario = storedUser?.id_usuario;

  // Estado de reseñas
  const [misResenas, setMisResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer reseñas del usuario
  useEffect(() => {
    const fetchMisResenas = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resenias/usuario/${idUsuario}`
        );
        setMisResenas(res.data.resenias || []);
      } catch (error) {
        console.error("Error al cargar mis reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisResenas();
  }, [idUsuario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-6">

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-800 transition"
      >
        <FaArrowLeft /> Volver atrás
      </button>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
        Mis Reseñas Realizadas
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-600 text-lg">Cargando tus reseñas...</p>
      )}

      {/* SIN RESEÑAS */}
      {!loading && misResenas.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-10 max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-lg">
            Aún no has realizado ninguna reseña.
          </p>
        </div>
      )}

      {/* LISTADO */}
      <div className="max-w-4xl mx-auto space-y-6">
        {misResenas.map((resenia) => (
          <div
            key={resenia.id_resenia}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            {/* ENCABEZADO */}
            <div className="flex justify-between items-start mb-3">

              <div>
                <h2 className="text-2xl font-bold text-pink-600">
                  {resenia.nombre_lugar}
                </h2>

                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-pink-500" />
                  {resenia.direccion_lugar}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Localidad: {resenia.localidad_lugar}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* CALIFICACIÓN */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-6 h-6 ${
                      star <= parseInt(resenia.calificacion_resenia)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* COMENTARIO */}
            <p className="text-gray-700 leading-relaxed mt-3">
              {resenia.comentario_resenia}
            </p>

            {/* BOTÓN VER LUGAR */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  navigate(`/lugar/${resenia.id_lugarfk}`) // puedes cambiar esto a la ruta que uses para detalle
                }
                className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 
                           text-white font-bold rounded-full shadow-lg hover:scale-105 transition"
              >
                Ver lugar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MisResenas;
