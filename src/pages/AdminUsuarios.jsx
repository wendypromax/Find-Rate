import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo_usuario: "",
    id_tipo_rolfk: "",
    estado_usuario: "",
  });

  // 🔹 Cargar lista de usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 🔹 Cambiar estado activo/inactivo
  const handleChangeStatus = async (id_usuario, currentStatus) => {
    try {
      const nuevoEstado = currentStatus === "activo" ? "inactivo" : "activo";
      await axios.put(`http://localhost:5000/api/admin/usuarios/${id_usuario}`, {
        estado_usuario: nuevoEstado,
      });
      toast.success(`Estado cambiado a ${nuevoEstado}`);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === id_usuario
            ? { ...u, estado_usuario: nuevoEstado }
            : u
        )
      );
    } catch (error) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/usuarios/${id_usuario}`);
      toast.success("Usuario eliminado correctamente");
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id_usuario));
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  };

  // 🔹 Editar usuario (abrir formulario)
  const handleEdit = (usuario) => {
    setEditando(usuario.id_usuario);
    setFormData({
      nombre_usuario: usuario.nombre_usuario,
      correo_usuario: usuario.correo_usuario,
      id_tipo_rolfk: usuario.id_tipo_rolfk,
      estado_usuario: usuario.estado_usuario,
    });
  };

  // 🔹 Guardar cambios
  const handleUpdate = async (id_usuario) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/usuarios/${id_usuario}`, formData);
      toast.success("Usuario actualizado correctamente");
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === id_usuario ? { ...u, ...formData } : u
        )
      );
      setEditando(null);
    } catch (error) {
      toast.error("No se pudo actualizar el usuario");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 via-white to-yellow-100 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
        👩‍💻 Panel de Administración de Usuarios
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-pink-300 rounded-xl shadow-md bg-white">
          <thead className="bg-pink-200">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Rol</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="text-center border-t">
                <td className="py-2 px-4">{u.id_usuario}</td>

                {/* 🔹 Si se está editando este usuario */}
                {editando === u.id_usuario ? (
                  <>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={formData.nombre_usuario}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre_usuario: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="email"
                        value={formData.correo_usuario}
                        onChange={(e) =>
                          setFormData({ ...formData, correo_usuario: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        value={formData.id_tipo_rolfk}
                        onChange={(e) =>
                          setFormData({ ...formData, id_tipo_rolfk: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-20"
                      />
                    </td>
                    <td className="py-2 px-4">{formData.estado_usuario}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdate(u.id_usuario)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4">{u.nombre_usuario}</td>
                    <td className="py-2 px-4">{u.correo_usuario}</td>
                    <td className="py-2 px-4">{u.id_tipo_rolfk}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          u.estado_usuario === "activo"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {u.estado_usuario}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          handleChangeStatus(u.id_usuario, u.estado_usuario)
                        }
                        className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 transition"
                      >
                        Cambiar estado
                      </button>
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-400 px-3 py-1 rounded hover:bg-blue-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(u.id_usuario)}
                        className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
