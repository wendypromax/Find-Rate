import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import logo from '../assets/find-rate-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePassword = () => setShowPassword(!showPassword);

  // ===== Login con email y contraseña (con backend) =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5003/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo_usuario: correo,
          password_usuario: password
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error del servidor:', errorText);
        setError('Credenciales incorrectas o error del servidor');
        return;
      }

      const data = await res.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor');
    }
  };

  // ===== Login con Google (solo frontend) =====
  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem('user', JSON.stringify({
        nombre_usuario: user.displayName || 'Usuario',
        correo_usuario: user.email
      }));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 font-sans p-6 relative">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-10 blur-3xl"></div>
      
      {/* Botón volver */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-gray-700 hover:text-indigo-600 text-sm font-medium hover:underline z-10"
      >
        ← Volver al inicio
      </Link>

      {/* Contenedor principal */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-gray-100 z-20">
        {/* Logo con decoración */}
        <div className="relative mb-6">
          <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10"></div>
          <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10"></div>
          <img src={logo} alt="Find & Rate Logo" className="relative mx-auto mb-2 w-48 object-contain z-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido a <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Find&Rate</span>
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Inicia sesión para continuar explorando lugares increíbles
        </p>

        {/* Formulario */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                placeholder="tucorreo@email.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span>
            </div>
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">Contraseña</label>
              <Link 
                to="/recuperar-cuenta" 
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Separador */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">o continúa con</span>
          </div>
        </div>

        {/* Botones de autenticación social */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 shadow-sm hover:shadow w-full"
          >
            <span className="text-xl font-bold text-red-500">G</span>
            <span className="text-gray-700 font-medium">Continuar con Google</span>
          </button>
        </div>

        {/* Enlace a registro */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/registro" 
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-500 z-10">
        <p>© {new Date().getFullYear()} Find&Rate — Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Login;