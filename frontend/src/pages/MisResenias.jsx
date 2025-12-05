import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTimes, FaCommentDots } from "react-icons/fa";
import axios from "axios";

const MisResenias = () => {
  const navigate = useNavigate();
  const [resenias, setResenias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState("");
  const [calificacionEditada, setCalificacionEditada] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [eliminar, setEliminar] = useState(null);

  // Cargar usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Cargar reseñas del usuario
  useEffect(() => {
    if (user) {
      fetchResenias();
    }
  }, [user]);

  const fetchResenias = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5003/api/resenias/usuario/${user.id_usuario}`
      );
      setResenias(response.data.resenias || []);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      setResenias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarResenia = async (reseniaId) => {
    if (!comentarioEditado.trim() || calificacionEditada === 0) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5003/api/resenias/${reseniaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calificacion_resenia: calificacionEditada, // snake_case
            comentario_resenia: comentarioEditado, // snake_case
          }),
        }
      );

      if (response.ok) {
        setMensaje("✅ Reseña actualizada exitosamente");
        setEditando(null);
        fetchResenias();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        const errorData = await response.json();
        setMensaje(`❌ ${errorData.message || "Error al actualizar reseña"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al actualizar reseña");
    }
  };

  const handleEliminarResenia = async (reseniaId) => {
    try {
      const response = await fetch(
        `http://localhost:5003/api/resenias/${reseniaId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMensaje("✅ Reseña eliminada exitosamente");
        setEliminar(null);
        fetchResenias();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        const errorData = await response.json();
        setMensaje(`❌ ${errorData.message || "Error al eliminar reseña"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Error al eliminar reseña");
    }
  };

  const iniciarEdicion = (resenia) => {
    setEditando(resenia.id_resenia);
    setComentarioEditado(resenia.comentario_resenia);
    setCalificacionEditada(parseInt(resenia.calificacion_resenia) || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando tus reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition shadow-sm"
            >
              <FaArrowLeft /> Volver al Dashboard
            </button>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl mb-4">
              <FaCommentDots className="text-amber-500 text-5xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Mis Reseñas Realizadas
            </h1>
            <p className="text-gray-600">
              {resenias.length === 0 
                ? "Todavía no has escrito reseñas" 
                : `${resenias.length} reseña${resenias.length !== 1 ? 's' : ''} publicada${resenias.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`mb-6 p-4 rounded-xl border ${
            mensaje.startsWith("✅") 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Lista de reseñas */}
        {resenias.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-200">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Sin reseñas aún
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comparte tu experiencia en los lugares que visitas para ayudar a otros usuarios.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
            >
              Explorar lugares para reseñar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {resenias.map((resenia) => (
              <div
                key={resenia.id_resenia}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:border-gray-300 transition"
              >
                {/* Header de la reseña */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {resenia.nombre_lugar || "Lugar"}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                          <FaCalendarAlt /> Publicada el{" "}
                          {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center gap-3">
                      {editando === resenia.id_resenia ? (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setCalificacionEditada(star)}
                              className="transition transform hover:scale-110"
                            >
                              <FaStar
                                className={`text-2xl ${
                                  star <= calificacionEditada
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-xl ${
                                i < (resenia.calificacion_resenia || 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span className="text-gray-700 font-semibold">
                        {resenia.calificacion_resenia || 0}/5
                      </span>
                    </div>
                  </div>

                  {/* Botones de edición y eliminación */}
                  {editando !== resenia.id_resenia && !eliminar && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicion(resenia)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition flex items-center gap-2"
                        title="Editar reseña"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => setEliminar(resenia.id_resenia)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                        title="Eliminar reseña"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Comentario */}
                {editando === resenia.id_resenia ? (
                  <div className="mb-4">
                    <textarea
                      value={comentarioEditado}
                      onChange={(e) => setComentarioEditado(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      rows="4"
                      placeholder="Escribe tu comentario aquí..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Calificación seleccionada: {calificacionEditada} estrellas
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {resenia.comentario_resenia}
                    </p>
                  </div>
                )}

                {/* Botones de acción si está editando */}
                {editando === resenia.id_resenia && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEditarResenia(resenia.id_resenia)}
                      className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Guardar cambios
                    </button>
                    <button
                      onClick={() => {
                        setEditando(null);
                        setComentarioEditado("");
                        setCalificacionEditada(0);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Cancelar
                    </button>
                  </div>
                )}

                {/* Confirmar eliminación */}
                {eliminar === resenia.id_resenia && (
                  <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 font-semibold mb-4 text-center">
                      ⚠️ ¿Estás seguro de que deseas eliminar esta reseña?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEliminarResenia(resenia.id_resenia)}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={() => setEliminar(null)}
                        className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {resenias.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Has escrito {resenias.length} reseña{resenias.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisResenias;