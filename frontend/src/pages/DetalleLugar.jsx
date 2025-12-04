// src/pages/DetalleLugar.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaHeart } from "react-icons/fa";
import { Star } from "lucide-react";

const DetalleLugar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [resenias, setResenias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Formulario de reseña
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Cargar lugar y reseñas
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del lugar
        const resLugar = await axios.get(`http://localhost:5003/api/lugares/${id}`);
        setLugar(resLugar.data.lugar);

        // Obtener reseñas del lugar
        const resResenias = await axios.get(`http://localhost:5003/api/resenias/lugar/${id}`);
        setResenias(resResenias.data.resenias || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Enviar reseña
  const handleEnviarResenia = async (e) => {
    e.preventDefault();
    
    if (!comentario || calificacion === 0) {
      setMensaje("Por favor escribe un comentario y selecciona una calificación.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5003/api/resenias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_resenia: comentario,
          calificacion_resenia: calificacion,
          id_usuariofk: user.id_usuario,
          id_lugarfk: id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña publicada correctamente");
        setComentario("");
        setCalificacion(0);
        setMostrarFormulario(false);
        
        // Recargar reseñas
        const resResenias = await axios.get(`http://localhost:5003/api/resenias/lugar/${id}`);
        setResenias(resResenias.data.resenias || []);
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

  // Calcular promedio de estrellas
  const calcularPromedio = () => {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((acc, r) => acc + r.calificacion_resenia, 0);
    return (suma / resenias.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-pink-600 text-xl font-semibold">
        Cargando...
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 text-xl mb-4">Lugar no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  const promedio = calcularPromedio();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-8">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-pink-600 font-semibold mb-6 hover:text-pink-800 transition"
      >
        <FaArrowLeft /> Volver atrás
      </button>

      {/* Información del lugar */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {lugar.imagen_lugar && (
          <img
            src={lugar.imagen_lugar}
            alt={lugar.nombre_lugar}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-pink-600 mb-2">
              {lugar.nombre_lugar}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 text-lg">
              <FaMapMarkerAlt className="text-pink-500" />
              {lugar.direccion_lugar}
            </p>
            <p className="text-gray-500 mt-1">
              Localidad: {lugar.localidad_lugar}
            </p>
          </div>
          <button className="text-red-500 text-3xl hover:scale-110 transition">
            <FaHeart />
          </button>
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

      {/* Botón agregar reseña */}
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

      {/* Formulario de reseña */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-pink-600 mb-4">
            Compartir tu experiencia
          </h3>

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
            {resenias.map((resenia) => (
              <div
                key={resenia.id_resenia}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {resenia.nombre_usuario || "Usuario anónimo"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
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
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {resenia.comentario_resenia}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleLugar;
