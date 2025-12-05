import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUserEdit, 
  FaTrashAlt, 
  FaStore, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaStar,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaVenusMars,
  FaBirthdayCake,
  FaShieldAlt,
  FaEdit,
  FaChartBar,
  FaCommentDots
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lugares, setLugares] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);

    // Cargar datos dependiendo del rol
    const loadData = async () => {
      setLoading(true);
      try {
        if (storedUser.id_tipo_rolfk === 2) {
          const res = await fetch(`http://localhost:5003/lugares/${storedUser.id_usuario}`);
          const data = await res.json();
          if (data.success) setLugares(data.lugares);
        } else if (storedUser.id_tipo_rolfk === 3) {
          const [usuariosRes, lugaresRes, resenasRes] = await Promise.all([
            fetch("http://localhost:5003/api/usuarios").then(res => res.json()),
            fetch("http://localhost:5003/api/lugares").then(res => res.json()),
            fetch("http://localhost:5003/api/resenas").then(res => res.json()),
          ]);
          
          setUsuarios(usuariosRes.usuarios || []);
          setLugares(lugaresRes.lugares || []);
          setReseñas(resenasRes.reseñas || []);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        `http://localhost:5003/api/auth/${user.id_usuario}`,
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

  const rolColor = 
    user.id_tipo_rolfk === 1 ? "from-blue-500 to-cyan-500" :
    user.id_tipo_rolfk === 2 ? "from-purple-500 to-pink-500" :
    "from-indigo-600 to-purple-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6 flex flex-col items-center relative font-sans">
      {/* Botón volver - CORREGIDO */}
      <div className="w-full max-w-6xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-6xl">
        {/* Encabezado con gradiente */}
        <div className={`bg-gradient-to-r ${rolColor} rounded-2xl shadow-xl p-8 text-center text-white mb-8`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center text-4xl md:text-5xl">
              <FaUserEdit />
            </div>
            <div className="text-left md:text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Perfil de {rolNombre}
              </h1>
              <p className="text-lg text-white/90 flex items-center justify-center gap-2">
                <FaEnvelope /> {user.correo_usuario}
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Columna izquierda - Información personal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos personales */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaUserEdit className="text-indigo-600" />
                </div>
                Información Personal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaIdCard className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nombre completo</p>
                      <p className="font-semibold text-gray-900">{user.nombre_usuario} {user.apellido_usuario}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaPhone className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-semibold text-gray-900">{user.telefono_usuario || "No registrado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaIdCard className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Documento</p>
                      <p className="font-semibold text-gray-900">{user.num_doc_usuario}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <FaVenusMars className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Género</p>
                      <p className="font-semibold text-gray-900">{user.genero_usuario || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaBirthdayCake className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Edad</p>
                      <p className="font-semibold text-gray-900">{user.edad_usuario || "No registrada"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaShieldAlt className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rol</p>
                      <p className="font-semibold text-gray-900">{rolNombre}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secciones según el tipo de usuario */}
            {user.id_tipo_rolfk === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaStore className="text-purple-600" />
                  </div>
                  Mis Lugares
                </h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando lugares...</p>
                  </div>
                ) : lugares.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏢</div>
                    <p className="text-gray-600 mb-4">No tienes lugares registrados.</p>
                    <button
                      onClick={() => navigate("/lugaresform")}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                    >
                      Agregar primer lugar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lugares.map((lugar) => (
                      <div
                        key={lugar.id_lugar}
                        className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition group"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition">
                              {lugar.nombre_lugar}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <FaMapMarkerAlt className="text-purple-500" />
                              {lugar.direccion_lugar}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              📍 {lugar.localidad_lugar}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/edit-lugar/${lugar.id_lugar}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition flex items-center gap-2"
                          >
                            <FaEdit size={14} /> Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {user.id_tipo_rolfk === 3 && (
              <div className="space-y-6">
                {/* Usuarios */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUsers className="text-indigo-600" />
                    </div>
                    Usuarios Registrados
                  </h2>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                  ) : usuarios.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No hay usuarios registrados.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-700">Usuario</th>
                            <th className="text-left py-3 px-4 text-gray-700">Correo</th>
                            <th className="text-left py-3 px-4 text-gray-700">Rol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.slice(0, 5).map((u) => (
                            <tr key={u.id_usuario} className="border-b border-gray-100 hover:bg-gray-50 transition">
                              <td className="py-3 px-4">
                                <p className="font-medium text-gray-900">{u.nombre_usuario}</p>
                              </td>
                              <td className="py-3 px-4 text-gray-600">{u.correo_usuario}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  u.nombre_rol === 'Administrador' ? 'bg-red-100 text-red-800' :
                                  u.nombre_rol === 'Empresario' ? 'bg-purple-100 text-purple-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {u.nombre_rol}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {usuarios.length > 5 && (
                        <div className="text-center mt-4">
                          <p className="text-gray-500 text-sm">
                            ... y {usuarios.length - 5} usuarios más
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Lugares */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <FaStore className="text-emerald-600" />
                    </div>
                    Lugares Registrados
                  </h2>
                  
                  {lugares.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No hay lugares registrados.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lugares.slice(0, 4).map((l) => (
                        <div key={l.id_lugar} className="p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition">
                          <h4 className="font-semibold text-gray-900 mb-1">{l.nombre_lugar}</h4>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <FaMapMarkerAlt className="text-emerald-500" /> {l.localidad_lugar}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reseñas */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaCommentDots className="text-amber-600" />
                    </div>
                    Reseñas Recientes
                  </h2>
                  
                  {reseñas.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No hay reseñas disponibles.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reseñas.slice(0, 3).map((r) => (
                        <div key={r.id_resena} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-700 line-clamp-2">{r.comentario}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= (r.calificacion || 3)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">
                            Usuario ID: {r.id_usuariofk}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Acciones y estadísticas */}
          <div className="space-y-6">
            {/* Acciones rápidas */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/EditarPerfil")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaUserEdit /> Editar Perfil
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transition flex items-center justify-center gap-2"
                >
                  <FaTrashAlt /> Borrar Perfil
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaChartBar /> Estadísticas
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span>Rol</span>
                  <span className="font-bold bg-white/20 px-3 py-1 rounded-full">
                    {rolNombre}
                  </span>
                </div>
                
                {user.id_tipo_rolfk === 2 && (
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span>Mis lugares</span>
                    <span className="text-xl font-bold">{lugares.length}</span>
                  </div>
                )}
                
                {user.id_tipo_rolfk === 3 && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span>Total usuarios</span>
                      <span className="text-xl font-bold">{usuarios.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span>Total lugares</span>
                      <span className="text-xl font-bold">{lugares.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span>Total reseñas</span>
                      <span className="text-xl font-bold">{reseñas.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">ID de usuario:</span> {user.id_usuario}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    <span className="font-semibold">Estado:</span> {user.estado_usuario || 'Activo'}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Cuenta creada: {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Find&Rate — Panel de perfil</p>
      </div>
    </div>
  );
};

export default Profile;