import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    num_doc_usuario: "",
    nombre_usuario: "",
    apellido_usuario: "",
    correo_usuario: "",
    telefono_usuario: "",
    edad_usuario: "",
    genero_usuario: "",
    estado_usuario: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user || !user.id_usuario) {
      navigate("/login");
      return;
    }

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`http://localhost:5003/api/auth/${user.id_usuario}`);
        const data = await res.json();

        if (res.ok && data) {
          setFormData({
            num_doc_usuario: data.num_doc_usuario?.toString() || "",
            nombre_usuario: data.nombre_usuario || "",
            apellido_usuario: data.apellido_usuario || "",
            correo_usuario: data.correo_usuario || "",
            telefono_usuario: data.telefono_usuario || "",
            edad_usuario: data.edad_usuario?.toString() || "",
            genero_usuario: data.genero_usuario || "",
            estado_usuario: data.estado_usuario || "",
          });
        } else {
          setError(data?.message || "No se pudo cargar el perfil.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !user.id_usuario) {
      setError("Sesión expirada. Inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5003/api/auth/${user.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "No se pudo actualizar el perfil.");
      } else {
        setSuccess("Perfil actualizado correctamente 💗");
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <p className="text-gray-700">Cargando perfil...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6 flex justify-center items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Editar Perfil
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-center border border-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-900 mb-2">Número de documento *</label>
              <input
                type="text"
                name="num_doc_usuario"
                value={formData.num_doc_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Nombre *</label>
              <input
                type="text"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Apellido *</label>
              <input
                type="text"
                name="apellido_usuario"
                value={formData.apellido_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Correo *</label>
              <input
                type="email"
                name="correo_usuario"
                value={formData.correo_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Teléfono</label>
              <input
                type="text"
                name="telefono_usuario"
                value={formData.telefono_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Edad</label>
              <input
                type="number"
                name="edad_usuario"
                value={formData.edad_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Género</label>
              <select
                name="genero_usuario"
                value={formData.genero_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Selecciona tu género</option>
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-2">Estado</label>
              <select
                name="estado_usuario"
                value={formData.estado_usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Selecciona un estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                ← Volver al Dashboard
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;