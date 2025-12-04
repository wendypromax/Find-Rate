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

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 p-6 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          Editar Perfil
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Número de documento</label>
            <input
              type="text"
              name="num_doc_usuario"
              value={formData.num_doc_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido_usuario"
              value={formData.apellido_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Correo</label>
            <input
              type="email"
              name="correo_usuario"
              value={formData.correo_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Teléfono</label>
            <input
              type="text"
              name="telefono_usuario"
              value={formData.telefono_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Edad</label>
            <input
              type="number"
              name="edad_usuario"
              value={formData.edad_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Género</label>
            <select
              name="genero_usuario"
              value={formData.genero_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
            >
              <option value="">Selecciona tu género</option>
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Estado</label>
            <select
              name="estado_usuario"
              value={formData.estado_usuario}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:outline-pink-400"
            >
              <option value="">Selecciona un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-pink-500 text-white font-semibold py-2 px-6 rounded hover:bg-pink-600 transition"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded hover:bg-gray-400 transition"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;

