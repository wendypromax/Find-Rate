// src/pages/EscribirResena.jsx
import React from "react";
import { Link } from "react-router-dom";

const EscribirResena = () => {
  const usuarioLogueado = false; // <- Aquí luego usarás un estado global o contexto para saber si está logueado

  if (!usuarioLogueado) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Acceso requerido
          </h2>
          <p className="text-gray-600 mb-8">
            Para escribir una reseña necesitas tener una cuenta en <span className="font-semibold text-indigo-600">Find & Rate</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              Registrarme
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              ✍️ Escribir Reseña
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comparte tu experiencia y ayuda a otros a descubrir los mejores lugares
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center text-2xl mb-4">
              💡
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Sé específico</h3>
            <p className="text-gray-600 text-sm">Describe detalles como ambiente, servicio y calidad</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center text-2xl mb-4">
              ⭐
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Califica honestamente</h3>
            <p className="text-gray-600 text-sm">Tu calificación ayuda a otros a tomar mejores decisiones</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-2xl mb-4">
              📸
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Incluye fotos</h3>
            <p className="text-gray-600 text-sm">Las imágenes hacen tu reseña más valiosa</p>
          </div>
        </div>

        <form className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-3">Título de la reseña</label>
            <input
              type="text"
              placeholder="Ej: 'Experiencia inolvidable en la playa'"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-3">Descripción detallada</label>
            <textarea
              placeholder="Comparte tu experiencia: ¿qué te gustó? ¿qué mejorarías? ¿recomendarías este lugar?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              rows="6"
            ></textarea>
          </div>

          <div className="mb-8">
            <label className="block text-gray-800 font-medium mb-3">Calificación</label>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-4xl hover:scale-110 transition-transform duration-200"
                  >
                    <span className="text-gray-300 hover:text-amber-400">★</span>
                  </button>
                ))}
              </div>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="">Selecciona una calificación</option>
                <option value="5">⭐ 5 - Excelente (Recomendado)</option>
                <option value="4">⭐ 4 - Muy Bueno</option>
                <option value="3">⭐ 3 - Bueno</option>
                <option value="2">⭐ 2 - Regular</option>
                <option value="1">⭐ 1 - No recomendado</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-800 font-medium mb-3">Subir fotos (opcional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors duration-200">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-gray-600 mb-2">Arrastra y suelta tus fotos aquí</p>
              <p className="text-gray-500 text-sm">o haz clic para seleccionar</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-lg"
          >
            Publicar Reseña
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            Tu reseña será visible para todos los usuarios de Find&Rate
          </p>
        </form>
      </div>
    </div>
  );
};

export default EscribirResena;