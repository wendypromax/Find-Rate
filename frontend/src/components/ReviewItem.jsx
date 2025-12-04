// frontend/src/components/ReviewItem.jsx
import React from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { Star } from "lucide-react";

const ReviewItem = ({
  resenia,
  esMiResenia,
  editandoResenia,
  eliminandoResenia,
  comentarioEditado,
  setComentarioEditado,
  calificacionEditada,
  setCalificacionEditada,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  getDisplayName,
  getInitials,
  getAvatarColor
}) => {
  const displayName = getDisplayName(resenia);
  const userInitials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition">
      {/* Encabezado de la reseña */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar del usuario */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: avatarColor }}
          >
            {userInitials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800 text-base md:text-lg">
                {displayName}
              </p>
              {esMiResenia && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Tú
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              {new Date(resenia.fecha_resenia).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {/* Contenedor de estrellas y botones */}
        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
          {/* Estrellas de calificación */}
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  star <= parseInt(resenia.calificacion_resenia)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          
          {/* Botones de edición/eliminación (solo para el propietario) */}
          {esMiResenia && !editandoResenia && !eliminandoResenia && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(resenia)}
                className="text-blue-500 hover:text-blue-700 transition p-1 rounded hover:bg-blue-50 flex items-center gap-1 text-sm"
                title="Editar reseña"
              >
                <FaEdit size={14} />
                <span className="text-xs">Editar</span>
              </button>
              <button
                onClick={() => onConfirmDelete(resenia)}
                className="text-red-500 hover:text-red-700 transition p-1 rounded hover:bg-red-50 flex items-center gap-1 text-sm"
                title="Eliminar reseña"
              >
                <FaTrash size={14} />
                <span className="text-xs">Eliminar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modo edición */}
      {editandoResenia === resenia.id_resenia ? (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={28}
                  className={`cursor-pointer transition ${
                    calificacionEditada >= n
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setCalificacionEditada(n)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Comentario
            </label>
            <textarea
              value={comentarioEditado}
              onChange={(e) => setComentarioEditado(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSave(resenia.id_resenia)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              ✓ Guardar
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      ) : eliminandoResenia === resenia.id_resenia ? (
        /* Confirmación de eliminación */
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-700 font-semibold mb-3">
            ¿Estás seguro de que quieres eliminar esta reseña?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(resenia.id_resenia)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Sí, eliminar
            </button>
            <button
              onClick={onCancelDelete}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        /* Vista normal de la reseña */
        <p className="text-gray-700 leading-relaxed mt-3">
          {resenia.comentario_resenia}
        </p>
      )}
    </div>
  );
};

export default ReviewItem;
