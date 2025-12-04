// 📂 components/PublicarResenia.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";

const PublicarResenia = ({ idLugar, idUsuario }) => {
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
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
    <div className="p-4 border rounded-lg shadow bg-white max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2">Publicar Reseña</h3>

      <form onSubmit={handleEnviar} className="flex flex-col gap-3">
        {/* 🌟 Estrellas */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={24}
              className={`cursor-pointer ${calificacion >= n ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setCalificacion(n)}
            />
          ))}
        </div>

        {/* 📝 Comentario */}
        <textarea
          placeholder="Escribe tu comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          rows={4}
        />

        {/* Mensaje */}
        {mensaje && (
          <p className={`text-sm ${mensaje.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
            {mensaje}
          </p>
        )}

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-semibold rounded-full hover:opacity-90 transition"
        >
          {loading ? "Enviando..." : "Publicar reseña"}
        </button>
      </form>
    </div>
  );
};

export default PublicarResenia;
