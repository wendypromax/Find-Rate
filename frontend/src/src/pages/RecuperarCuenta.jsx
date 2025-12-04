import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/find-rate-logo.png";

const RecuperarCuenta = () => {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de formato del correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      setError("Correo inválido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/recuperar-cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await response.json();

      if (response.ok) {
        setExito(data.message);
        setCorreo("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 font-[Poppins] px-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-purple-200">
        <img src={logo} alt="Find & Rate" className="mx-auto mb-4 w-32" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Recuperación de Contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa tu correo electrónico para recibir un enlace de recuperación
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="tu@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {exito && <p className="text-green-600 text-sm">{exito}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-fuchsia-500 text-white font-semibold py-2 rounded-full shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-black hover:underline"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
};

export default RecuperarCuenta;
