import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBirthdayCake,
  FaVenusMars,
  FaUserShield,
  FaEdit,
  FaTrashAlt
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔐 Estados eliminar cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [finalConfirm, setFinalConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleDeleteProfile = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:5003/api/auth/${user.id_usuario}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert(data?.message || "No se pudo eliminar la cuenta");
      }
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  const rol =
    user.id_tipo_rolfk === 1
      ? "Usuario"
      : user.id_tipo_rolfk === 2
      ? "Empresario"
      : "Administrador";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        {/* Volver */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <FaUserCircle className="text-8xl text-indigo-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Perfil de Usuario
          </h1>
          <p className="text-gray-600 mt-2 flex justify-center items-center gap-2">
            <FaEnvelope /> {user.correo_usuario}
          </p>
        </div>

        {/* Información personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <InfoCard icon={<FaIdCard />} label="Documento" value={user.num_doc_usuario} />
          <InfoCard icon={<FaUserCircle />} label="Nombre" value={user.nombre_usuario} />
          <InfoCard icon={<FaUserCircle />} label="Apellido" value={user.apellido_usuario} />
          <InfoCard icon={<FaPhone />} label="Teléfono" value={user.telefono_usuario || "No registrado"} />
          <InfoCard icon={<FaBirthdayCake />} label="Edad" value={user.edad_usuario || "No registrada"} />
          <InfoCard icon={<FaVenusMars />} label="Género" value={user.genero_usuario || "No especificado"} />
          <InfoCard icon={<FaUserShield />} label="Rol" value={rol} />
          <InfoCard icon={<FaUserShield />} label="Estado" value={user.estado_usuario || "Activo"} />
        </div>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("/EditarPerfil")}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <FaEdit /> Editar Perfil
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <FaTrashAlt /> Eliminar Cuenta
          </button>
        </div>
      </div>

      {/* 🔴 MODAL ELIMINAR */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 mb-3">
              Eliminar cuenta
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              Esta acción es <strong>permanente</strong>.  
              Escribe <strong>ELIMINAR</strong> para continuar.
            </p>

            <input
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setFinalConfirm(false);
              }}
              placeholder="ELIMINAR"
              className="w-full px-4 py-3 border rounded-xl mb-4 focus:ring-2 focus:ring-red-500"
            />

            {confirmText === "ELIMINAR" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-700 text-sm font-semibold mb-2">
                  ¿Estás totalmente seguro de querer eliminar esta cuenta?
                </p>
                <label className="flex items-center gap-2 text-sm text-red-700">
                  <input
                    type="checkbox"
                    checked={finalConfirm}
                    onChange={(e) => setFinalConfirm(e.target.checked)}
                    className="accent-red-600"
                  />
                  Sí, entiendo que perderé toda mi información
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                  setFinalConfirm(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>

              <button
                disabled={!finalConfirm || confirmText !== "ELIMINAR"}
                onClick={handleDeleteProfile}
                className={`px-4 py-2 rounded-lg text-white ${
                  !finalConfirm
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🧩 Card reutilizable */
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-indigo-50 p-5 rounded-xl flex items-center gap-4 shadow-sm">
    <div className="text-indigo-600 text-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Profile;
