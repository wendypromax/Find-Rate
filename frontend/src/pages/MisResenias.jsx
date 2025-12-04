import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaMapMarkerAlt } from "react-icons/fa";
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
      setResenias(response.data);
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
            calificacion: calificacionEditada,
            comentario: comentarioEditado,
          }),
        }
      );

      if (response.ok) {
        setMensaje("Reseña actualizada exitosamente");
        setEditando(null);
        fetchResenias();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("Error al actualizar reseña");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al actualizar reseña");
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
        setMensaje("Reseña eliminada exitosamente");
        setEliminar(null);
        fetchResenias();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("Error al eliminar reseña");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al eliminar reseña");
    }
  };

  const iniciarEdicion = (resenia) => {
    setEditando(resenia.id_resenia);
    setComentarioEditado(resenia.comentario_resenia);
    setCalificacionEditada(resenia.calificacion_resenia);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <FaArrowLeft /> Volver
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            Mis Reseñas Realizadas
          </h1>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
            {mensaje}
          </div>
        )}

        {/* Lista de reseñas */}
        {resenias.length === 0 ? (
          <div className="text-center py-12">
            <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">
              Aún no has escrito ninguna reseña
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-lg hover:opacity-90 transition"
            >
              Escribir una reseña
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {resenias.map((resenia) => (
              <div
                key={resenia.id_resenia}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                {/* Header de la reseña */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-pink-500" />
                      <h3 className="text-xl font-bold text-gray-800">
                        {resenia.nombre_lugar || "Lugar"}
                      </h3>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center gap-2">
                      {editando === resenia.id_resenia ? (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setCalificacionEditada(star)}
                              className="text-2xl transition-colors"
                            >
                              <FaStar
                                className={
                                  star <= calificacionEditada
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < resenia.calificacion_resenia
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      )}
                      <span className="text-gray-600 ml-2">
                        {resenia.calificacion_resenia}/5
                      </span>
                    </div>
                  </div>

                  {/* Botones de edición y eliminación */}
                  {editando !== resenia.id_resenia && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicion(resenia)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setEliminar(resenia.id_resenia)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comentario */}
                {editando === resenia.id_resenia ? (
                  <textarea
                    value={comentarioEditado}
                    onChange={(e) => setComentarioEditado(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4 text-gray-700"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {resenia.comentario_resenia}
                  </p>
                )}

                {/* Fecha */}
                <div className="text-sm text-gray-500 mb-4">
                  Publicada el{" "}
                  {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Botones de acción si está editando */}
                {editando === resenia.id_resenia && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditarResenia(resenia.id_resenia)}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                      Guardar cambios
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Confirmar eliminación */}
                {eliminar === resenia.id_resenia && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-4 mt-4">
                    <p className="text-red-700 font-semibold mb-3">
                      ¿Estás seguro de que deseas eliminar esta reseña?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEliminarResenia(resenia.id_resenia)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => setEliminar(null)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
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
      </div>
    </div>
  );
};

export default MisResenias;
