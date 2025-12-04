import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reseñas, setReseñas] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);

    // Cargar datos dependiendo del rol
    if (storedUser.id_tipo_rolfk === 2) {
      // Empresario: obtiene sus lugares
      fetch(`http://localhost:5000/lugares/${storedUser.id_usuario}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setLugares(data.lugares);
        })
        .catch((err) => console.error(err));
    } else if (storedUser.id_tipo_rolfk === 3) {
      // Administrador: obtiene todo
      Promise.all([
        fetch("http://localhost:5000/api/usuarios").then((res) => res.json()),
        fetch("http://localhost:5000/api/lugares").then((res) => res.json()),
        fetch("http://localhost:5000/api/resenas").then((res) => res.json()),
      ])
        .then(([usuariosData, lugaresData, resenasData]) => {
          setUsuarios(usuariosData.usuarios || []);
          setLugares(lugaresData.lugares || []);
          setReseñas(resenasData.reseñas || []);
        })
        .catch((err) => console.error("Error cargando datos de admin:", err));
    }
  }, [navigate]);

  const handleDeleteProfile = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres borrar tu perfil? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/${user.id_usuario}`,
        { method: "DELETE" }
      );

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

  const rolNombre =
    user.id_tipo_rolfk === 1
      ? "Usuario"
      : user.id_tipo_rolfk === 2
      ? "Empresario"
      : "Administrador";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center relative">
      <span
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-purple-500 hover:text-purple-700 font-medium cursor-pointer flex items-center"
      >
        ← Volver al Dashboard
      </span>

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl text-center mt-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
          Perfil de {rolNombre}
        </h1>
        <p className="text-gray-600 mb-6">{user.correo_usuario}</p>

        {/* Datos personales */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner mb-6 space-y-3">
          <p>
            <span className="font-semibold">Nombre:</span>{" "}
            {user.nombre_usuario} {user.apellido_usuario}
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span>{" "}
            {user.telefono_usuario || "No registrado"}
          </p>
          <p>
            <span className="font-semibold">Documento:</span>{" "}
            {user.num_doc_usuario}
          </p>
          <p>
            <span className="font-semibold">Género:</span>{" "}
            {user.genero_usuario || "No especificado"}
          </p>
          <p>
            <span className="font-semibold">Edad:</span>{" "}
            {user.edad_usuario || "No registrada"}
          </p>
        </div>

        {/* Botones comunes */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <button
            onClick={() => navigate("/EditarPerfil")}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition"
          >
            Editar Perfil
          </button>
          <button
            onClick={handleDeleteProfile}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:opacity-90 transition"
          >
            Borrar Perfil
          </button>
        </div>

        {/* Secciones según el tipo de usuario */}
        {user.id_tipo_rolfk === 2 && (
          <div className="text-left mt-10">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Mis Lugares
            </h2>
            {lugares.length === 0 ? (
              <p className="text-gray-500">No tienes lugares registrados.</p>
            ) : (
              <ul className="space-y-3">
                {lugares.map((lugar) => (
                  <li
                    key={lugar.id_lugar}
                    className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{lugar.nombre_lugar}</p>
                      <p className="text-sm text-gray-500">
                        {lugar.localidad_lugar}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/edit-lugar/${lugar.id_lugar}`)
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:opacity-90 transition text-sm"
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {user.id_tipo_rolfk === 3 && (
          <div className="text-left mt-10 space-y-8">
            {/* Usuarios */}
            <div>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                Todos los Usuarios
              </h2>
              {usuarios.length === 0 ? (
                <p className="text-gray-500">No hay usuarios registrados.</p>
              ) : (
                <ul className="space-y-2">
                  {usuarios.map((u) => (
                    <li
                      key={u.id_usuario}
                      className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <p>{u.nombre_usuario} ({u.correo_usuario})</p>
                      <span className="text-sm text-gray-500">
                        Rol: {u.nombre_rol}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Lugares */}
            <div>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                Lugares Registrados
              </h2>
              {lugares.length === 0 ? (
                <p className="text-gray-500">No hay lugares registrados.</p>
              ) : (
                <ul className="space-y-2">
                  {lugares.map((l) => (
                    <li
                      key={l.id_lugar}
                      className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <p>{l.nombre_lugar}</p>
                      <span className="text-sm text-gray-500">
                        {l.localidad_lugar}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Reseñas */}
            <div>
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                Reseñas del Sistema
              </h2>
              {reseñas.length === 0 ? (
                <p className="text-gray-500">No hay reseñas disponibles.</p>
              ) : (
                <ul className="space-y-2">
                  {reseñas.map((r) => (
                    <li
                      key={r.id_resena}
                      className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <p>{r.comentario}</p>
                      <span className="text-sm text-gray-500">
                        Usuario: {r.id_usuariofk}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
