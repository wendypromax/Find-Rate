// frontend/src/components/ReviewForm.jsx
import React from "react";
import { Star } from "lucide-react";

const ReviewForm = ({
  user,
  lugarSeleccionado,
  comentario,
  setComentario,
  calificacion,
  setCalificacion,
  mensaje,
  enviando,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 max-w-2xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold text-pink-600 mb-4">
        Compartir tu experiencia
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-700 text-sm">
          <strong>Publicarás como:</strong> {user.nombre_usuario || user.nombre || "Usuario"}
        </p>
        <p className="text-blue-700 text-sm mt-1">
          <strong>Lugar:</strong> {lugarSeleccionado.nombre_lugar}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Estrellas */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Calificación *
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
          <p className="text-gray-500 text-sm mt-1">
            {calificacion > 0 ? `Seleccionado: ${calificacion} estrellas` : "Selecciona una calificación"}
          </p>
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Tu comentario *
          </label>
          <textarea
            placeholder="Cuéntanos sobre tu experiencia en este lugar..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={4}
            required
          />
          <p className="text-gray-500 text-sm mt-1">
            {comentario.length}/500 caracteres
          </p>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`p-3 rounded-lg ${
            mensaje.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {mensaje}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={enviando || !comentario.trim() || calificacion === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 
                       text-white font-bold rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publicando...
              </div>
            ) : (
              "Publicar Reseña"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center">
          * Campos obligatorios
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;
