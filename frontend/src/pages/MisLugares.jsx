import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaMapMarkerAlt, FaStar, FaArrowLeft, FaEdit, FaTrash, 
  FaTimes, FaCheck, FaPhone, FaClock, FaTag, FaStore,
  FaGlobe, FaUser, FaUtensils, FaCar, FaEnvelope, FaHashtag,
  FaImage, FaUpload
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MisLugares = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nit_lugar: "",
    nombre_lugar: "",
    localidad_lugar: "",
    direccion_lugar: "",
    red_social_lugar: "",
    tipo_entrada_lugar: "",
    imagen_lugar: ""
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmarEliminar, setMostrarConfirmarEliminar] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        if (!user?.id_usuario) {
          setError("Usuario no identificado");
          setLoading(false);
          return;
        }
        
        console.log("🔍 Obteniendo lugares para usuario:", user.id_usuario);
        
        const res = await axios.get(
          `http://localhost:5003/api/lugares/empresario/${user.id_usuario}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        console.log("📦 Respuesta de lugares:", res.data);
        
        if (res.data && res.data.lugares) {
          setLugares(res.data.lugares);
        } else {
          setLugares([]);
        }
      } catch (error) {
        console.error("❌ Error al cargar los lugares del empresario:", error);
        console.error("📊 Detalles:", error.response?.data);
        setError("Error al cargar los lugares. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, [user]);

  const handleVerDetalles = (lugar) => {
    console.log("👁️ Ver detalles de lugar:", lugar.id_lugar);
    setLugarSeleccionado(lugar);
    setMostrarModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCerrarModal = () => {
    console.log("❌ Cerrando modal");
    setMostrarModal(false);
    setLugarSeleccionado(null);
    setEditando(false);
    setFormData({
      nit_lugar: "",
      nombre_lugar: "",
      localidad_lugar: "",
      direccion_lugar: "",
      red_social_lugar: "",
      tipo_entrada_lugar: "",
      imagen_lugar: ""
    });
    setNuevaImagen(null);
    setPreviewImagen("");
    document.body.style.overflow = 'unset';
  };

  const handleIniciarEdicion = (lugar) => {
    console.log("✏️ Iniciando edición de lugar:", lugar.id_lugar);
    setLugarSeleccionado(lugar);
    setEditando(true);
    setFormData({
      nit_lugar: lugar.nit_lugar || "",
      nombre_lugar: lugar.nombre_lugar || "",
      localidad_lugar: lugar.localidad_lugar || "",
      direccion_lugar: lugar.direccion_lugar || "",
      red_social_lugar: lugar.red_social_lugar || "",
      tipo_entrada_lugar: lugar.tipo_entrada_lugar || "",
      imagen_lugar: lugar.imagen_lugar || ""
    });
    setPreviewImagen(lugar.imagen_lugar ? 
      `http://localhost:5003${lugar.imagen_lugar}` : 
      "");
    setMostrarModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📸 Nueva imagen seleccionada:", file.name, file.size, file.type);
      setNuevaImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarCambios = async () => {
    if (!lugarSeleccionado) return;
    
    // Validaciones básicas
    if (!formData.nit_lugar || !formData.nombre_lugar || 
        !formData.localidad_lugar || !formData.direccion_lugar) {
      setError("Por favor completa los campos obligatorios (*)");
      return;
    }

    setGuardando(true);
    setError("");
    
    try {
      console.log("🔄 Iniciando actualización del lugar...");
      console.log("📍 Lugar ID:", lugarSeleccionado.id_lugar);
      console.log("📝 Datos del formulario:", formData);
      console.log("🖼️ Nueva imagen:", nuevaImagen ? `${nuevaImagen.name} (${nuevaImagen.size} bytes)` : "No hay nueva imagen");
      console.log("🔑 Token:", localStorage.getItem('token') ? "Token presente" : "NO HAY TOKEN");
      
      // Crear FormData para enviar la imagen
      const formDataToSend = new FormData();
      formDataToSend.append('nit_lugar', formData.nit_lugar);
      formDataToSend.append('nombre_lugar', formData.nombre_lugar);
      formDataToSend.append('localidad_lugar', formData.localidad_lugar);
      formDataToSend.append('direccion_lugar', formData.direccion_lugar);
      formDataToSend.append('red_social_lugar', formData.red_social_lugar || '');
      formDataToSend.append('tipo_entrada_lugar', formData.tipo_entrada_lugar || '');
      
      // Agregar la nueva imagen si existe
      if (nuevaImagen) {
        formDataToSend.append('imagen_lugar', nuevaImagen);
      }

      // Mostrar lo que se va a enviar
      console.log("📤 Enviando FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // URL del endpoint
      const url = `http://localhost:5003/api/lugares/${lugarSeleccionado.id_lugar}`;
      console.log("🌐 URL:", url);
      
      // Actualizar el lugar
      console.log("⏳ Enviando petición PUT...");
      const response = await axios.put(
        url,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      // Actualizar la lista de lugares localmente
      const updatedLugar = {
        ...lugarSeleccionado,
        ...formData,
        imagen_lugar: response.data.imagen_url || lugarSeleccionado.imagen_lugar
      };

      setLugares(prev => prev.map(lugar => 
        lugar.id_lugar === lugarSeleccionado.id_lugar 
          ? updatedLugar
          : lugar
      ));

      // Actualizar el lugar seleccionado
      setLugarSeleccionado(updatedLugar);
      
      setEditando(false);
      setNuevaImagen(null);
      console.log("🎉 ¡Lugar actualizado exitosamente!");
      alert("¡Lugar actualizado exitosamente!");
    } catch (error) {
      console.error("❌ Error al actualizar el lugar:", error);
      console.error("📊 Detalles del error:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Datos:", error.response?.data);
      console.error("Headers:", error.response?.headers);
      console.error("Mensaje:", error.message);
      
      let errorMsg = "Error al actualizar el lugar";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarLugar = async () => {
    if (!lugarSeleccionado) return;
    
    console.log("🗑️ Intentando eliminar lugar ID:", lugarSeleccionado.id_lugar);
    console.log("🔑 Token:", localStorage.getItem('token') ? "Token presente" : "NO HAY TOKEN");
    
    setEliminandoId(lugarSeleccionado.id_lugar);
    try {
      const url = `http://localhost:5003/api/lugares/${lugarSeleccionado.id_lugar}`;
      console.log("🌐 URL DELETE:", url);
      
      console.log("⏳ Enviando petición DELETE...");
      const response = await axios.delete(
        url,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("✅ Respuesta DELETE:", response.data);

      // Eliminar de la lista local
      setLugares(prev => prev.filter(lugar => 
        lugar.id_lugar !== lugarSeleccionado.id_lugar
      ));

      setMostrarConfirmarEliminar(false);
      handleCerrarModal();
      console.log("🗑️ ¡Lugar eliminado exitosamente!");
      alert("¡Lugar eliminado exitosamente!");
    } catch (error) {
      console.error("❌ Error al eliminar el lugar:", error);
      console.error("📊 Detalles del error DELETE:");
      console.error("Status:", error.response?.status);
      console.error("Datos:", error.response?.data);
      console.error("Mensaje:", error.message);
      
      let errorMsg = "Error al eliminar el lugar";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Error: ${errorMsg}`);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleCancelarEdicion = () => {
    console.log("🚫 Cancelando edición");
    setEditando(false);
    setFormData({
      nit_lugar: lugarSeleccionado?.nit_lugar || "",
      nombre_lugar: lugarSeleccionado?.nombre_lugar || "",
      localidad_lugar: lugarSeleccionado?.localidad_lugar || "",
      direccion_lugar: lugarSeleccionado?.direccion_lugar || "",
      red_social_lugar: lugarSeleccionado?.red_social_lugar || "",
      tipo_entrada_lugar: lugarSeleccionado?.tipo_entrada_lugar || "",
      imagen_lugar: lugarSeleccionado?.imagen_lugar || ""
    });
    setNuevaImagen(null);
    setPreviewImagen(lugarSeleccionado?.imagen_lugar ? 
      `http://localhost:5003${lugarSeleccionado.imagen_lugar}` : 
      "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 text-xl font-semibold font-sans">
            Cargando tus lugares...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Botón para volver atrás */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all hover:-translate-x-1"
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Mis Lugares Registrados
          </h1>
          <p className="text-gray-500 text-lg">
            {lugares.length === 0 
              ? "No tienes lugares registrados todavía" 
              : `${lugares.length} lugar${lugares.length !== 1 ? 'es' : ''} registrado${lugares.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {lugares.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-10 max-w-md mx-auto shadow-lg">
              <div className="text-7xl mb-6">🏪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Sin lugares registrados
              </h3>
              <p className="text-gray-600 mb-8">
                ¡Comienza registrando tu primer lugar para administrarlo aquí!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-600 
                         transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Registrar nuevo lugar
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de lugares */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lugares.map((lugar) => (
                <div
                  key={lugar.id_lugar}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-indigo-300 
                           transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Imagen del lugar */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden">
                    {lugar.imagen_lugar ? (
                      <img
                        src={`http://localhost:5003${lugar.imagen_lugar}`}
                        alt={lugar.nombre_lugar}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RUQiLz48cGF0aCBkPSJNNTAgNzVMMTAwIDEyNUwxNTAgNzUiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNTAiIHI9IjIwIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 
                                    flex items-center justify-center">
                        <FaStore className="text-indigo-400 text-6xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    
                    {/* Botones de acción en la imagen */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleIniciarEdicion(lugar)}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white hover:scale-110 
                                 transition-all shadow-md"
                        title="Editar lugar"
                      >
                        <FaEdit className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => {
                          setLugarSeleccionado(lugar);
                          setMostrarConfirmarEliminar(true);
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white hover:scale-110 
                                 transition-all shadow-md"
                        title="Eliminar lugar"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Información del lugar */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h2 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 
                                   transition-all line-clamp-1 mb-2">
                        {lugar.nombre_lugar}
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <FaHashtag className="text-gray-400 text-sm" />
                          <span className="text-sm font-medium text-gray-600">
                            NIT: {lugar.nit_lugar}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <span className="text-sm font-medium text-gray-600">
                          {lugar.localidad_lugar}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-2 text-gray-700">
                        <FaMapMarkerAlt className="text-indigo-500 flex-shrink-0 mt-1" />
                        <p className="text-sm line-clamp-2">{lugar.direccion_lugar}</p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaEnvelope className="text-purple-500" />
                        <span className="line-clamp-1">
                          Entrada: {lugar.tipo_entrada_lugar || "No especificada"}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerDetalles(lugar)}
                        className="flex-1 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white 
                                 text-sm font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 
                                 transition-all shadow-md hover:shadow-lg"
                      >
                        Ver detalles
                      </button>
                      <button
                        onClick={() => handleIniciarEdicion(lugar)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg 
                                 hover:bg-blue-100 transition-all border border-blue-100"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contador */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                <span className="font-bold text-gray-900">{lugares.length}</span> lugar{lugares.length !== 1 ? 'es' : ''} registrado{lugares.length !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modal de detalles/edición */}
      {(mostrarModal && lugarSeleccionado) && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleCerrarModal}
          ></div>
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editando ? "Editar Lugar" : lugarSeleccionado.nombre_lugar}
                </h2>
                <button
                  onClick={handleCerrarModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FaTimes className="text-gray-500 text-xl" />
                </button>
              </div>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {editando ? (
                  // Formulario de edición
                  <div className="space-y-6">
                    {/* Imagen actual y carga de nueva imagen */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen del lugar
                      </label>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                          <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                            {previewImagen ? (
                              <img
                                src={previewImagen}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaImage className="text-gray-400 text-4xl" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Vista previa
                          </p>
                        </div>
                        <div className="w-full md:w-2/3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cambiar imagen
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition">
                            <input
                              type="file"
                              id="imagen-lugar"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="imagen-lugar"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <FaUpload className="text-gray-400 text-2xl mb-2" />
                              <span className="text-sm text-gray-600">
                                Haz clic para subir una nueva imagen
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PNG, JPG, JPEG (Max. 5MB)
                              </span>
                            </label>
                          </div>
                          {nuevaImagen && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ Nueva imagen seleccionada: {nuevaImagen.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIT del lugar *
                        </label>
                        <input
                          type="text"
                          name="nit_lugar"
                          value={formData.nit_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                          placeholder="Ej: 901196467"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del lugar *
                        </label>
                        <input
                          type="text"
                          name="nombre_lugar"
                          value={formData.nombre_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                          placeholder="Ej: Astoria Rooftop"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localidad *
                        </label>
                        <input
                          type="text"
                          name="localidad_lugar"
                          value={formData.localidad_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                          placeholder="Ej: Chapinero"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          name="direccion_lugar"
                          value={formData.direccion_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                          placeholder="Ej: Salón 1, Ac. 85 #12-66"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Red Social Principal
                        </label>
                        <select
                          name="red_social_lugar"
                          value={formData.red_social_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar red social</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="YouTube">YouTube</option>
                          <option value="TikTok">TikTok</option>
                          <option value="LinkedIn">LinkedIn</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Entrada
                        </label>
                        <select
                          name="tipo_entrada_lugar"
                          value={formData.tipo_entrada_lugar || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="Pública">Pública</option>
                          <option value="Privada">Privada</option>
                          <option value="Mixta">Mixta</option>
                        </select>
                      </div>
                    </div>

                    {/* Botones de acción en edición */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleCancelarEdicion}
                        className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleGuardarCambios}
                        disabled={guardando}
                        className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                                 font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 
                                 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {guardando ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <FaCheck /> Guardar cambios
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vista de detalles
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Imagen del lugar */}
                      <div className="space-y-6">
                        <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                          {lugarSeleccionado.imagen_lugar ? (
                            <img
                              src={`http://localhost:5003${lugarSeleccionado.imagen_lugar}`}
                              alt={lugarSeleccionado.nombre_lugar}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaStore className="text-gray-400 text-8xl" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <FaHashtag className="text-indigo-600" />
                            <div>
                              <h3 className="font-semibold text-gray-900">NIT</h3>
                              <p className="text-gray-700">{lugarSeleccionado.nit_lugar}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-green-600" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Tipo de Entrada</h3>
                              <p className="text-gray-700">{lugarSeleccionado.tipo_entrada_lugar || "No especificado"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información del lugar */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Información General</h3>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-700">Nombre</h4>
                              <p className="text-gray-900">{lugarSeleccionado.nombre_lugar}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Localidad</h4>
                              <p className="text-gray-900">{lugarSeleccionado.localidad_lugar}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Dirección</h4>
                              <p className="text-gray-900">{lugarSeleccionado.direccion_lugar}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-700">Red Social Principal</h4>
                              <p className="text-gray-900">{lugarSeleccionado.red_social_lugar || "No especificada"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción en vista */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                      <button
                        onClick={() => {
                          setLugarSeleccionado(lugarSeleccionado);
                          setMostrarConfirmarEliminar(true);
                        }}
                        className="px-5 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                      >
                        <FaTrash /> Eliminar
                      </button>
                      <button
                        onClick={() => handleIniciarEdicion(lugarSeleccionado)}
                        className="px-5 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={handleCerrarModal}
                        className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmación para eliminar */}
      {mostrarConfirmarEliminar && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setMostrarConfirmarEliminar(false)}
          ></div>
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ¿Eliminar lugar?
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar "{lugarSeleccionado?.nombre_lugar}"? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMostrarConfirmarEliminar(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminarLugar}
                  disabled={eliminandoId === lugarSeleccionado?.id_lugar}
                  className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 
                           transition flex items-center gap-2 disabled:opacity-50"
                >
                  {eliminandoId === lugarSeleccionado?.id_lugar ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Sí, eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MisLugares;