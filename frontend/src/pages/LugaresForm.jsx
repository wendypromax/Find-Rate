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
  const [imagen_lugar, setImagen] = useState(null);
  const [preview, setPreview] = useState(null); // 🔹 Para vista previa
  const [mensaje, setMensaje] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nit_lugar || !nombre_lugar || !direccion_lugar) {
      setMensaje("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!user || !user.id_usuario) {
      setMensaje("Debes iniciar sesión para registrar un lugar.");
      return;
    }

    try {
      let res;

      if (imagen_lugar) {
        const formData = new FormData();
        formData.append("nit_lugar", nit_lugar);
        formData.append("nombre_lugar", nombre_lugar);
        formData.append("localidad_lugar", localidad_lugar);
        formData.append("direccion_lugar", direccion_lugar);
        formData.append("red_social_lugar", red_social_lugar);
        formData.append("tipo_entrada_lugar", tipo_entrada_lugar);
        formData.append("id_usuariofk", user.id_usuario);
        formData.append("imagen_lugar", imagen_lugar);

        res = await fetch("http://localhost:5003/api/lugares/con-imagen", {
          method: "POST",
          body: formData,
        });
      } else {
        const datosLugar = {
          nit_lugar,
          nombre_lugar,
          localidad_lugar,
          direccion_lugar,
          red_social_lugar,
          tipo_entrada_lugar,
          id_usuariofk: user.id_usuario,
        };

        res = await fetch("http://localhost:5003/api/lugares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosLugar),
        });
      }

      if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setMensaje("✅ Lugar registrado correctamente");
        setNit("");
        setNombre("");
        setLocalidad("");
        setDireccion("");
        setRedSocial("");
        setTipoEntrada("");
        setImagen(null);
        setPreview(null); // 🔹 Limpiar preview
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

        <form
          className="flex flex-col gap-3 text-left"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
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

          <label>Imagen del lugar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              className="mt-2 w-full h-48 object-cover rounded-lg border-2 border-pink-300"
            />
          )}

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
