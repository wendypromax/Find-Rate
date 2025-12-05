import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaBuilding, FaMapMarkerAlt, FaHashtag, FaShareAlt, FaDoorOpen, FaSave } from "react-icons/fa";

const LugaresForm = () => {
  const navigate = useNavigate();
  const [nit_lugar, setNit] = useState("");
  const [nombre_lugar, setNombre] = useState("");
  const [localidad_lugar, setLocalidad] = useState("");
  const [direccion_lugar, setDireccion] = useState("");
  const [red_social_lugar, setRedSocial] = useState("");
  const [tipo_entrada_lugar, setTipoEntrada] = useState("");
  const [imagen_lugar, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);

    if (!nit_lugar || !nombre_lugar || !direccion_lugar) {
      setMensaje("Por favor completa todos los campos obligatorios.");
      setSubmitting(false);
      return;
    }

    if (!user || !user.id_usuario) {
      setMensaje("Debes iniciar sesión para registrar un lugar.");
      setSubmitting(false);
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
        // Reset form
        setNit("");
        setNombre("");
        setLocalidad("");
        setDireccion("");
        setRedSocial("");
        setTipoEntrada("");
        setImagen(null);
        setPreview(null);
        
        // Optional: Redirect after success
        setTimeout(() => {
          navigate("/mis-lugares");
        }, 1500);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl mb-4">
              <FaBuilding className="text-purple-500 text-5xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Agregar Nuevo Lugar
            </h1>
            <p className="text-gray-600">
              Completa la información de tu establecimiento
            </p>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mb-6 p-4 rounded-xl border ${
              mensaje.startsWith("✅") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {mensaje}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-5">
                {/* NIT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaHashtag className="text-indigo-500" /> NIT del lugar *
                  </label>
                  <input
                    type="text"
                    value={nit_lugar}
                    onChange={(e) => setNit(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: 123456789-0"
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaBuilding className="text-indigo-500" /> Nombre del lugar *
                  </label>
                  <input
                    type="text"
                    value={nombre_lugar}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: Restaurante El Sabor"
                  />
                </div>

                {/* Localidad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-500" /> Localidad
                  </label>
                  <input
                    type="text"
                    value={localidad_lugar}
                    onChange={(e) => setLocalidad(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: Chapinero, Usaquén"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-500" /> Dirección *
                  </label>
                  <input
                    type="text"
                    value={direccion_lugar}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: Cra 15 #45-20"
                  />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-5">
                {/* Red Social */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaShareAlt className="text-indigo-500" /> Red social
                  </label>
                  <input
                    type="text"
                    value={red_social_lugar}
                    onChange={(e) => setRedSocial(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: @restauranteelsabor"
                  />
                </div>

                {/* Tipo de entrada */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaDoorOpen className="text-indigo-500" /> Tipo de entrada
                  </label>
                  <input
                    type="text"
                    value={tipo_entrada_lugar}
                    onChange={(e) => setTipoEntrada(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Ej: Gratuita, Pago, Reserva"
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaCamera className="text-indigo-500" /> Imagen del lugar
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  
                  {/* Preview */}
                  {preview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nota de campos obligatorios */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                * Campos obligatorios
              </p>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave /> Guardar Lugar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LugaresForm;