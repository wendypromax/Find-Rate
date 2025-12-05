import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import logo from "../assets/find-rate-logo.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (!password || !confirmar) {
      setError("Por favor completa ambos campos.");
      return;
    }

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5003/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setExito("Tu contraseña ha sido restablecida correctamente.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Error al restablecer la contraseña.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
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
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-4 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Restablecer Contraseña
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm">
            Crea una nueva contraseña segura para tu cuenta.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nueva contraseña */}
          <div>
            <label className="block text-gray-700 font-medium mb-3 text-sm">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-gray-700 font-medium mb-3 text-sm">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={confirmar}
                onChange={(e) => {
                  setConfirmar(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Indicador de fortaleza */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Seguridad:</span>
                <span className={`font-medium ${
                  password.length >= 8 ? "text-green-600" : 
                  password.length >= 6 ? "text-amber-600" : "text-red-600"
                }`}>
                  {password.length >= 8 ? "Fuerte" : 
                   password.length >= 6 ? "Media" : "Débil"}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    password.length >= 8 ? "bg-green-500 w-full" : 
                    password.length >= 6 ? "bg-amber-500 w-2/3" : "bg-red-500 w-1/3"
                  }`}
                ></div>
              </div>
            </div>
          )}

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
                    Redirigiendo al inicio de sesión...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading || !password || !confirmar}
            className={`w-full py-3 font-medium rounded-xl transition-all duration-300 ${
              loading || !password || !confirmar
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Guardando...
              </div>
            ) : (
              "Restablecer contraseña"
            )}
          </button>
        </form>

        {/* Enlace de retorno */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/login"
            className="flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Volver al inicio de sesión
          </Link>
        </div>

        {/* Consejos de seguridad */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-700 text-xs">
            <span className="font-medium">🔒 Consejo de seguridad:</span> Usa una 
            contraseña única que no hayas utilizado en otros servicios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;