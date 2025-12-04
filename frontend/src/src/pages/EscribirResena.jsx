// src/pages/EscribirResena.jsx
import React from "react";
import { Link } from "react-router-dom";

const EscribirResena = () => {
  const usuarioLogueado = false; // <- Aquí luego usarás un estado global o contexto para saber si está logueado

  if (!usuarioLogueado) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ⚠️ Primero debes registrarte o iniciar sesión
        </h2>
        <p className="text-gray-600 mb-6">
          Para escribir una reseña necesitas tener una cuenta en <span className="font-semibold text-pink-600">Find & Rate</span>.
        </p>
        <div className="flex gap-4">
          <Link
            to="/registro"
            className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            Registrarme
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        ✍️ Escribir una Reseña
      </h1>

      <form className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <label className="block text-gray-700 mb-2">Título de la reseña</label>
        <input
          type="text"
          placeholder="Ej. Experiencia en la playa"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
        />

        <label className="block text-gray-700 mb-2">Descripción</label>
        <textarea
          placeholder="Escribe tu experiencia aquí..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
          rows="5"
        ></textarea>

        <label className="block text-gray-700 mb-2">Calificación</label>
        <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4">
          <option value="5">⭐ 5 - Excelente</option>
          <option value="4">⭐ 4 - Muy Bueno</option>
          <option value="3">⭐ 3 - Bueno</option>
          <option value="2">⭐ 2 - Regular</option>
          <option value="1">⭐ 1 - Malo</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          Publicar Reseña
        </button>
      </form>
    </div>
  );
};

export default EscribirResena;
