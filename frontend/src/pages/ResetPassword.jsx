import React, { useState, useEffect } from "react";
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

  // 🔐 Validar existencia del token
  useEffect(() => {
    if (!token) {
      setError("El enlace de recuperación no es válido o ha expirado.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar token
    if (!token) {
      setError("Token de recuperación inválido.");
      return;
    }

    // Validaciones
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

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-gray-600 text-sm">
            Crea una nueva contraseña segura para tu cuenta.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nueva contraseña */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmar}
                onChange={(e) => {
                  setConfirmar(e.target.value);
                  setError("");
                }}
                className="w-full px-5 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {exito && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {exito}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading || !password || !confirmar || !token}
            className={`w-full py-3 rounded-xl font-medium transition ${
              loading || !password || !confirmar || !token
                ? "bg-gray-200 text-gray-500"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {loading ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>

        {/* Volver */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-600 hover:text-emerald-600">
            ← Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
