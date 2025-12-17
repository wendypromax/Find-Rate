import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    if (!user) navigate("/login");
    setFormData(user);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5003/api/auth/${user.id_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Editar Perfil
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {Object.entries(formData).map(([key, value]) => (
            <input
              key={key}
              name={key}
              value={value || ""}
              onChange={handleChange}
              placeholder={key.replaceAll("_", " ")}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          ))}

          <div className="md:col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-gray-200 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;
