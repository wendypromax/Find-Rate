// frontend/src/components/DashboardSidebar.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaSignOutAlt, FaStore, FaPlus, FaUsersCog, FaStar } from "react-icons/fa";

const DashboardSidebar = ({
  menuOpen,
  setMenuOpen,
  isUsuario,
  isEmpresario,
  isAdmin,
  onLogout,
  menuRef
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <aside
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-20 p-6 rounded-r-3xl transform transition-transform duration-300 ease-in-out ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Menú</h2>
          <nav className="flex flex-col gap-4">
            {isUsuario && (
              <>
                <button
                  onClick={() => handleNavigation("/favoritos")}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-red-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base"
                >
                  <FaHeart /> Lugares Favoritos
                </button>
                <button
                  onClick={() => handleNavigation("/reseñas")}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base"
                >
                  <FaStar /> Reseñas Realizadas
                </button>
              </>
            )}

            {isEmpresario && (
              <>
                <button
                  onClick={() => handleNavigation("/mis-lugares")}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base"
                >
                  <FaStore /> Ver mis lugares
                </button>
                <button
                  onClick={() => handleNavigation("/lugaresform")}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base"
                >
                  <FaPlus /> Agregar Lugar
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => handleNavigation("/admin/usuarios")}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-400 to-blue-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base"
              >
                <FaUsersCog /> Gestionar Usuarios
              </button>
            )}
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold rounded-2xl hover:opacity-90 transition text-sm md:text-base w-full justify-center"
        >
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
