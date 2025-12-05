// 📂 components/PublicarResenia.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";

const PublicarResenia = ({ idLugar, idUsuario }) => {
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!comentario || calificacion === 0) {
      setMensaje("Por favor escribe un comentario y selecciona una calificación.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5003/api/resenias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_resenia: comentario,
          calificacion_resenia: calificacion,
          id_usuariofk: idUsuario,
          id_lugarfk: idLugar,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Reseña publicada correctamente");
        setComentario("");
        setCalificacion(0);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto font-sans">
      <div className="text-center mb-6">
        <div className="inline-block mb-2">
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-3 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">Publicar Reseña</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-3 rounded-full"></div>
        </div>
        <p className="text-gray-500 text-sm">Comparte tu experiencia con otros usuarios</p>
      </div>

      <form onSubmit={handleEnviar} className="flex flex-col gap-5">
        {/* 🌟 Sistema de calificación mejorado */}
        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-3">Tu calificación</label>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCalificacion(n)}
                onMouseEnter={() => setHoverCalificacion(n)}
                onMouseLeave={() => setHoverCalificacion(0)}
                className="p-1 transform hover:scale-110 transition-transform duration-200"
              >
                <Star
                  size={32}
                  className={`${(hoverCalificacion || calificacion) >= n 
                    ? "text-amber-500 fill-amber-500" 
                    : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Malo</span>
            <span>Excelente</span>
          </div>
        </div>

        {/* 📝 Comentario */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">Tu comentario</label>
          <textarea
            placeholder="Comparte tu experiencia: ¿qué te gustó? ¿qué mejorarías? ¿recomendarías este lugar a otros?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            rows={5}
          />
          <p className="text-gray-400 text-xs mt-2">
            {comentario.length}/500 caracteres
          </p>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <div className={`p-3 rounded-lg ${mensaje.startsWith("❌") 
            ? "bg-red-50 border border-red-200 text-red-700" 
            : "bg-green-50 border border-green-200 text-green-700"}`}>
            <div className="flex items-center">
              <span className="mr-2">{mensaje.startsWith("❌") ? "❌" : "✅"}</span>
              <span className="font-medium">{mensaje.substring(2)}</span>
            </div>
          </div>
        )}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-medium rounded-xl transition-all duration-300 ${
            loading 
              ? "bg-gray-300 cursor-not-allowed text-gray-500" 
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:shadow-lg"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Enviando...
            </div>
          ) : (
            "Publicar reseña"
          )}
        </button>

        {/* Consejos */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-700 text-sm">
            <span className="font-medium">💡 Consejo:</span> Sé específico y honesto. 
            Tus reseñas ayudan a otros a tomar mejores decisiones.
          </p>
        </div>
      </form>
    </div>
  );
};

export default PublicarResenia;