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
      setError("Por favor, introduce un correo electrónico válido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5003/api/recuperar-cuenta", {
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
      setError("No se pudo conectar con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-gray-100">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Find & Rate" className="w-40" />
          </div>
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Recuperar Contraseña
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-3 text-sm">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ✉️
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-red-500">!</span>
                </div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {exito && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-500">✓</span>
                </div>
                <div>
                  <p className="text-green-700 font-medium text-sm">{exito}</p>
                  <p className="text-green-600 text-xs mt-1">
                    Revisa tu bandeja de entrada (y carpeta de spam)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading || !correo}
            className={`w-full py-3 font-medium rounded-xl transition-all duration-300 ${
              loading || !correo
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando...
              </div>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        {/* Enlace de retorno */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Volver al inicio de sesión
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-700 text-xs">
            <span className="font-medium">⚠️ Importante:</span> El enlace de recuperación 
            expirará en 1 hora por seguridad. Si no recibes el correo, revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarCuenta;