// frontend/src/components/DashboardHeader.jsx
import React, { useState, useRef } from "react";
import { FaBars, FaUser } from "react-icons/fa";

const DashboardHeader = ({ 
  menuOpen, 
  setMenuOpen, 
  onProfileClick, 
  profilePic, 
  panelTitle,
  fileInputRef,
  onImageUpload,
  onRemovePhoto
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
      <button
        onClick={() => setMenuOpen((s) => !s)}
        className="text-gray-700 text-2xl focus:outline-none"
      >
        <FaBars />
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-pink-600 text-center">
        {panelTitle}
      </h1>

      {/* Foto de perfil */}
      <div className="relative group flex items-center gap-3">
        <div
          onClick={onProfileClick}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-4 border-pink-400 cursor-pointer hover:opacity-90 transition flex items-center justify-center"
        >
          {profilePic ? (
            <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-lg md:text-xl">
              <FaUser />
            </div>
          )}
        </div>

        <div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-xl px-3 py-2 text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <label className="block text-blue-600 cursor-pointer hover:underline">
            Cambiar foto
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
          {profilePic && (
            <button
              onClick={onRemovePhoto}
              className="block text-red-500 mt-1 hover:underline w-full"
            >
              Eliminar foto
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
