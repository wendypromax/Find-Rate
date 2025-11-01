import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Contraseña actualizada correctamente");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Error al restablecer la contraseña");
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 font-[Poppins] px-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-purple-200">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Restablecer Contraseña</h2>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa tu nueva contraseña para tu cuenta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-fuchsia-500 text-white font-semibold py-2 rounded-full shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Restablecer Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
