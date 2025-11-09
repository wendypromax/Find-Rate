import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LugaresForm = () => {
  const navigate = useNavigate();
  const [nit_lugar, setNit] = useState("");
  const [nombre_lugar, setNombre] = useState("");
  const [localidad_lugar, setLocalidad] = useState("");
  const [direccion_lugar, setDireccion] = useState("");
  const [red_social_lugar, setRedSocial] = useState("");
  const [tipo_entrada_lugar, setTipoEntrada] = useState("");
  const [mensaje, setMensaje] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (!nit_lugar || !nombre_lugar || !direccion_lugar) {
      setMensaje("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!user || !user.id_usuario) {
      setMensaje("Debes iniciar sesión para registrar un lugar.");
      return;
    }

    const datosLugar = {
      nit_lugar,
      nombre_lugar,
      localidad_lugar,
      direccion_lugar,
      red_social_lugar,
      tipo_entrada_lugar,
      id_usuariofk: user.id_usuario,
    };

    try {
      // ✅ URL corregida con /api/lugares
      const res = await fetch("http://localhost:5000/api/lugares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLugar),
      });

      if (!res.ok) {
        throw new Error(`Error en el servidor: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Lugar registrado correctamente");
        // Limpiar formulario
        setNit("");
        setNombre("");
        setLocalidad("");
        setDireccion("");
        setRedSocial("");
        setTipoEntrada("");
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 via-pink-100 to-yellow-200 p-6 relative">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="absolute top-5 left-5 text-purple-500 hover:text-purple-700 font-medium"
      >
        ← Volver al Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400">
          Agregar Nuevo Lugar
        </h2>

        {mensaje && (
          <p
            className={`mb-4 p-2 rounded ${
              mensaje.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </p>
        )}

        <form className="flex flex-col gap-3 text-left" onSubmit={handleSubmit}>
          <label>NIT del lugar *</label>
          <input
            type="text"
            value={nit_lugar}
            onChange={(e) => setNit(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <label>Nombre del lugar *</label>
          <input
            type="text"
            value={nombre_lugar}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <label>Localidad</label>
          <input
            type="text"
            value={localidad_lugar}
            onChange={(e) => setLocalidad(e.target.value)}
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <label>Dirección *</label>
          <input
            type="text"
            value={direccion_lugar}
            onChange={(e) => setDireccion(e.target.value)}
            required
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <label>Red social</label>
          <input
            type="text"
            value={red_social_lugar}
            onChange={(e) => setRedSocial(e.target.value)}
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <label>Tipo de entrada</label>
          <input
            type="text"
            value={tipo_entrada_lugar}
            onChange={(e) => setTipoEntrada(e.target.value)}
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            className="mt-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-bold rounded-full hover:opacity-90 transition"
          >
            Guardar Lugar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LugaresForm;
