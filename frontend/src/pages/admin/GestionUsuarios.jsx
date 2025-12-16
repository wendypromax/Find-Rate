import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5003/api/admin/usuarios";

const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Empresario" },
  { id: 3, nombre: "Usuario" }
];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const res = await axios.get(API);
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRol = async (idUsuario, idRol) => {
    await axios.put(`${API}/${idUsuario}/rol`, {
      id_tipo_rolfk: idRol
    });
    cargarUsuarios();
  };

  const cambiarEstado = async (idUsuario, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    await axios.put(`${API}/${idUsuario}/estado`, {
      estado: nuevoEstado
    });
    cargarUsuarios();
  };

  const eliminarUsuario = async (idUsuario) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await axios.delete(`${API}/${idUsuario}`);
    cargarUsuarios();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-600">
        Gestión de Usuarios
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.id_usuario}
                className="border-b hover:bg-purple-50 transition"
              >
                <td className="p-3 font-medium">
                  {u.nombre_usuario} {u.apellido_usuario}
                </td>

                <td className="p-3 text-gray-600">
                  {u.correo_usuario}
                </td>

                <td className="p-3">
                  <select
                    value={u.id_tipo_rolfk}
                    onChange={(e) =>
                      cambiarRol(u.id_usuario, e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.estado_usuario === "activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.estado_usuario}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      cambiarEstado(u.id_usuario, u.estado_usuario)
                    }
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-xs"
                  >
                    {u.estado_usuario === "activo"
                      ? "Desactivar"
                      : "Activar"}
                  </button>

                  <button
                    onClick={() => eliminarUsuario(u.id_usuario)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
