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
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 font-[Poppins] px-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-purple-200">
        <img src={logo} alt="Find & Rate" className="mx-auto mb-4 w-32" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Restablecer Contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Escribe tu nueva contraseña y confírmala para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm text-gray-600">Nueva contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {exito && <p className="text-green-600 text-sm">{exito}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-fuchsia-500 text-white font-semibold py-2 rounded-full shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Restablecer Contraseña"}
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

export default ResetPassword;
