import { useEffect, useState } from "react";
import axios from "axios";

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const res = await axios.get("http://localhost:5003/api/admin/usuarios");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarEstado = async (id) => {
    await axios.put(`http://localhost:5003/api/admin/usuarios/${id}/estado`);
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      await axios.delete(`http://localhost:5003/api/admin/usuarios/${id}`);
      cargarUsuarios();
    }
  };

  return (
    <table border="1" width="100%" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {usuarios.map((u) => (
          <tr key={u.id_usuario}>
            <td>{u.id_usuario}</td>
            <td>{u.nombre_usuario} {u.apellido_usuario}</td>
            <td>{u.correo_usuario}</td>
            <td>{u.nombre_rol}</td>
            <td>{u.estado_usuario}</td>
            <td>
              <button onClick={() => cambiarEstado(u.id_usuario)}>
                {u.estado_usuario === "activo" ? "Desactivar" : "Activar"}
              </button>

              <button
                style={{ marginLeft: "8px", color: "red" }}
                onClick={() => eliminarUsuario(u.id_usuario)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsuariosTable;
