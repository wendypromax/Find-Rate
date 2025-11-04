// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);

      fetch(`http://localhost:5000/lugares/${storedUser.id_usuario}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setLugares(data.lugares);
        })
        .catch(err => console.error(err));
    }
  }, [navigate]);

  const handleDeleteProfile = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar tu perfil? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${user.id_usuario}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("user");
        alert("Perfil eliminado correctamente.");
        navigate("/login");
      } else {
        alert(data?.message || "No se pudo borrar el perfil.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center relative">
      <span
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-purple-500 hover:text-purple-700 font-medium cursor-pointer flex items-center"
      >
        ← Volver al Dashboard
      </span>

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center mt-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
          Perfil de {user.nombre_usuario}
        </h1>
        <p className="text-gray-600 mb-6">{user.correo_usuario}</p>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner mb-6 space-y-3">
          <p><span className="font-semibold">Nombre:</span> {user.nombre_usuario} {user.apellido_usuario}</p>
          <p><span className="font-semibold">Teléfono:</span> {user.telefono_usuario || "No registrado"}</p>
          <p><span className="font-semibold">Documento:</span> {user.num_doc_usuario}</p>
          <p><span className="font-semibold">Género:</span> {user.genero_usuario || "No especificado"}</p>
          <p><span className="font-semibold">Edad:</span> {user.edad_usuario || "No registrado"}</p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => navigate("/EditarPerfil")}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
          >
            Editar Perfil
          </button>

          <button
            onClick={handleDeleteProfile}
            className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:opacity-90 transition"
          >
            Borrar Perfil
          </button>
        </div>

        {/* Lugares registrados */}
        <div className="text-left">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Mis Lugares</h2>
          {lugares.length === 0 ? (
            <p className="text-gray-500">No tienes lugares registrados.</p>
          ) : (
            <ul className="space-y-3">
              {lugares.map(lugar => (
                <li key={lugar.id_lugar} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{lugar.nombre_lugar}</p>
                    <p className="text-sm text-gray-500">{lugar.localidad_lugar}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/edit-lugar/${lugar.id_lugar}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:opacity-90 transition text-sm"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
