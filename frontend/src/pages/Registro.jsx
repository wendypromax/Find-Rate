// src/pages/Registro.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/find-rate-logo.png";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoUsuario: "usuario", // se mapeará a id_tipo_rolfk
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

      // Mapeo de los nombres al formato backend
      const payload = {
        num_doc_usuario: formData.num_doc_usuario,
        nombre_usuario: formData.nombre,
        apellido_usuario: formData.apellido,
        telefono_usuario: formData.telefono,
        correo_usuario: formData.email,
        password_usuario: formData.password,
        edad_usuario: formData.edad,
        genero_usuario: formData.genero,
        id_tipo_rolfk: formData.tipoUsuario === "usuario" ? 1 : 2, // Ajusta según tu DB
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} alt="Find & Rate" className="w-16 h-16" />
              <div>
                <h1 className="text-2xl font-bold">Crear cuenta</h1>
                <p className="text-sm text-muted">Únete y descubre los mejores servicios cerca de ti</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <fieldset className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Tipo</span>
                  <div className="flex gap-2">
                    <button type="button" aria-pressed={formData.tipoUsuario === "usuario"} onClick={() => handleTipoChange("usuario")} className={`flex-1 btn-secondary ${formData.tipoUsuario === "usuario" ? "ring-2 ring-pink-300" : ""}`}>Usuario</button>
                    <button type="button" aria-pressed={formData.tipoUsuario === "empresario"} onClick={() => handleTipoChange("empresario")} className={`flex-1 btn-secondary ${formData.tipoUsuario === "empresario" ? "ring-2 ring-pink-300" : ""}`}>Empresario</button>
                  </div>
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Documento</span>
                  <input aria-invalid={!!errors.num_doc_usuario} aria-describedby="err-doc" type="text" name="num_doc_usuario" placeholder="Número de documento" value={formData.num_doc_usuario} onChange={handleChange} className="input" />
                  {errors.num_doc_usuario && <span id="err-doc" className="text-red-500 text-xs mt-1">{errors.num_doc_usuario}</span>}
                </label>
              </fieldset>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Nombre</span>
                  <input aria-invalid={!!errors.nombre} aria-describedby="err-nombre" type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="input" />
                  {errors.nombre && <span id="err-nombre" className="text-red-500 text-xs mt-1">{errors.nombre}</span>}
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Apellido</span>
                  <input aria-invalid={!!errors.apellido} aria-describedby="err-apellido" type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className="input" />
                  {errors.apellido && <span id="err-apellido" className="text-red-500 text-xs mt-1">{errors.apellido}</span>}
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-xs text-muted mb-1">Correo electrónico</span>
                <input aria-invalid={!!errors.email} aria-describedby="err-email" type="email" name="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={handleChange} className="input" />
                {errors.email && <span id="err-email" className="text-red-500 text-xs mt-1">{errors.email}</span>}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Teléfono</span>
                  <input aria-invalid={!!errors.telefono} aria-describedby="err-tel" type="tel" name="telefono" placeholder="+57 300 000 0000" value={formData.telefono} onChange={handleChange} maxLength="15" className="input" />
                  {errors.telefono && <span id="err-tel" className="text-red-500 text-xs mt-1">{errors.telefono}</span>}
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-muted mb-1">Edad</span>
                  <input aria-invalid={!!errors.edad} aria-describedby="err-edad" type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} min="18" className="input" />
                  {errors.edad && <span id="err-edad" className="text-red-500 text-xs mt-1">{errors.edad}</span>}
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-xs text-muted mb-1">Género</span>
                <select name="genero" value={formData.genero} onChange={handleChange} className="input bg-white">
                  <option value="">Selecciona</option>
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.genero && <span className="text-red-500 text-xs mt-1">{errors.genero}</span>}
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input id="terms" type="checkbox" required className="scale-100" />
                <span className="text-muted">Acepto los <Link to="/terminos" className="text-primary underline">términos</Link> y la <Link to="/privacidad" className="text-primary underline">política</Link>.</span>
              </label>

              {errors.general && <div className="text-red-600 text-sm">{errors.general}</div>}
              {successMessage && <div className="text-green-700 text-sm">{successMessage}</div>}

              <div className="flex flex-col gap-3">
                <button type="submit" disabled={loading} className={`btn-primary w-full ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>
                <Link to="/login" className="text-center text-sm text-muted underline">¿Ya tienes cuenta? Inicia sesión</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-sm text-muted">
        © {new Date().getFullYear()} Find & Rate — Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Registro;
