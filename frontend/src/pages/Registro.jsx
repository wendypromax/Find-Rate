import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/find-rate-logo.png";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoUsuario: "usuario",
    num_doc_usuario: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    edad: "",
    genero: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "nombre" || name === "apellido") && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) return;
    if ((name === "telefono" || name === "num_doc_usuario") && !/^[0-9]*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleTipoChange = (tipo) => setFormData({ ...formData, tipoUsuario: tipo });

  const validate = () => {
    const newErrors = {};
    if (!formData.num_doc_usuario.trim()) newErrors.num_doc_usuario = "El documento es obligatorio.";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Ingresa un correo válido.";
    if (!/^[0-9]{7,15}$/.test(formData.telefono)) newErrors.telefono = "Teléfono debe tener 7-15 dígitos.";
    if (formData.password.length < 6) newErrors.password = "Contraseña mínimo 6 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
    if (!formData.edad || formData.edad < 18) newErrors.edad = "Debes tener al menos 18 años.";
    if (!formData.genero) newErrors.genero = "Selecciona un género.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    try {
      setLoading(true);

      const payload = {
        num_doc_usuario: formData.num_doc_usuario,
        nombre_usuario: formData.nombre,
        apellido_usuario: formData.apellido,
        telefono_usuario: formData.telefono,
        correo_usuario: formData.email,
        password_usuario: formData.password,
        edad_usuario: formData.edad,
        genero_usuario: formData.genero,
        id_tipo_rolfk: formData.tipoUsuario === "usuario" ? 1 : 2,
      };

      console.log("👉 Enviando al backend:", payload);

      const res = await fetch("http://localhost:5003/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Usuario registrado correctamente 🎉");
        localStorage.setItem("user", JSON.stringify({ nombre: formData.nombre, email: formData.email }));
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setErrors({ general: data.message || "Ocurrió un error al registrar." });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-sans">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="relative flex justify-center items-center flex-grow p-6">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
          {/* Logo con decoración */}
          <div className="relative mb-6">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
            <img src={logo} alt="Find & Rate" className="relative mx-auto mb-3 w-40 z-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Únete a <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Find&Rate</span>
          </h1>
          <p className="text-sm text-gray-700 mb-8">Crea tu cuenta y descubre los mejores lugares de tu ciudad</p>

          {/* Selector de tipo de usuario con más color */}
          <div className="flex justify-between mb-8 gap-6">
            <button
              type="button"
              onClick={() => handleTipoChange("usuario")}
              className={`flex flex-col items-center justify-center flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.tipoUsuario === "usuario" 
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg text-indigo-700" 
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
              }`}
            >
              <div className="mb-2 text-4xl">👤</div>
              <span className="text-sm font-semibold">Usuario</span>
              <p className="text-xs text-gray-500 mt-1">Para explorar lugares</p>
            </button>

            <button
              type="button"
              onClick={() => handleTipoChange("empresario")}
              className={`flex flex-col items-center justify-center flex-1 p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.tipoUsuario === "empresario" 
                  ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg text-purple-700" 
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              <div className="mb-2 text-4xl">🏢</div>
              <span className="text-sm font-semibold">Empresario</span>
              <p className="text-xs text-gray-500 mt-1">Para registrar negocios</p>
            </button>
          </div>

          {/* Mensajes de estado */}
          {errors.general && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-200 shadow-sm">
              ⚠️ {errors.general}
            </div>
          )}
          {successMessage && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 p-4 rounded-xl mb-6 text-sm border border-emerald-200 shadow-sm">
              ✅ {successMessage}
            </div>
          )}

          {/* Formulario */}
          <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
            {/* Primera fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Documento</label>
                <input 
                  type="text" 
                  name="num_doc_usuario" 
                  placeholder="Número de documento" 
                  value={formData.num_doc_usuario} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.num_doc_usuario && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.num_doc_usuario}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Edad</label>
                <input 
                  type="number" 
                  name="edad" 
                  placeholder="Edad" 
                  value={formData.edad} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.edad && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.edad}</p>}
              </div>
            </div>

            {/* Segunda fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Nombre</label>
                <input 
                  type="text" 
                  name="nombre" 
                  placeholder="Nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Apellido</label>
                <input 
                  type="text" 
                  name="apellido" 
                  placeholder="Apellido" 
                  value={formData.apellido} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.apellido && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.apellido}</p>}
              </div>
            </div>

            {/* Campos individuales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Correo electrónico</label>
              <input 
                type="email" 
                name="email" 
                placeholder="tu@correo.com" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Teléfono</label>
              <input 
                type="tel" 
                name="telefono" 
                placeholder="1234567890" 
                value={formData.telefono} 
                onChange={handleChange} 
                maxLength="15" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.telefono}</p>}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Contraseña</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Confirmar</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Género</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, genero: "mujer"})}
                  className={`py-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.genero === "mujer" 
                      ? "border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700" 
                      : "border-gray-300 bg-white text-gray-600 hover:border-pink-300"
                  }`}
                >
                  👩 Mujer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, genero: "hombre"})}
                  className={`py-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.genero === "hombre" 
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700" 
                      : "border-gray-300 bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  👨 Hombre
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, genero: "otro"})}
                  className={`py-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.genero === "otro" 
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700" 
                      : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
                  }`}
                >
                  🏳️ Otro
                </button>
              </div>
              {errors.genero && <p className="text-red-500 text-xs mt-1 ml-2">⚠️ {errors.genero}</p>}
            </div>

            {/* Términos */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Acepto los <Link to="/terminos" className="text-indigo-600 hover:text-indigo-800 font-semibold">términos y condiciones</Link> y la <Link to="/privacidad" className="text-purple-600 hover:text-purple-800 font-semibold">política de privacidad</Link>.
              </label>
            </div>

            {/* Botón de registro */}
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                loading 
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Registrando...
                </span>
              ) : (
                "✨ Crear mi cuenta"
              )}
            </button>

            {/* Enlace a login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer colorido */}
      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-center py-6 text-sm text-white/90 mt-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">© {new Date().getFullYear()} Find & Rate — Descubre, califica, comparte.</p>
          <div className="flex justify-center gap-6">
            <Link to="/privacidad" className="hover:text-pink-300 transition">Privacidad</Link>
            <Link to="/terminos" className="hover:text-pink-300 transition">Términos</Link>
            <Link to="/conocenos" className="hover:text-pink-300 transition">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Registro;