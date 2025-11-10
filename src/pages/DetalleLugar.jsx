import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // si no hay sesión, redirige
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Sesión cerrada correctamente 👋");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-600">
          Bienvenida, {user.nombre_usuario}
        </h1>

        <button
          onClick={handleLogout}
          className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* ===== CONTENIDO ===== */}
      <div className="flex flex-1">
        {/* ===== MENU LATERAL SOLO PARA ADMIN ===== */}
        {user.id_tipo_rolfk === 3 && (
          <aside className="w-64 bg-white shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              ⚙️ Panel Admin
            </h2>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                className="hover:text-pink-600 transition text-gray-700"
              >
                🏠 Inicio administrador
              </Link>
              <Link
                to="/admin/usuarios"
                className="hover:text-pink-600 transition text-gray-700"
              >
                👥 Gestión de usuarios
              </Link>
            </nav>
          </aside>
        )}

        {/* ===== ZONA PRINCIPAL ===== */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Panel principal
          </h2>

          {user.id_tipo_rolfk === 3 ? (
            <p className="text-gray-600">
              👑 Estás en el panel del administrador. Usa el menú para gestionar usuarios o explorar otras secciones.
            </p>
          ) : user.id_tipo_rolfk === 2 ? (
            <p className="text-gray-600">
              💼 Bienvenido empresario. Desde aquí podrás administrar tus lugares y ver reseñas.
            </p>
          ) : (
            <p className="text-gray-600">
              🙋‍♀️ Bienvenido usuario. Aquí puedes ver tus favoritos, tus reseñas y actualizar tu perfil.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
