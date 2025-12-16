// frontend/src/pages/Login.jsx - CÓDIGO COMPLETO Y FUNCIONAL CORREGIDO
import React, { useState, useEffect } from 'react';
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
  const [errorType, setErrorType] = useState('');
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [lockUntil, setLockUntil] = useState(null);
  const [_showLockAlert, setShowLockAlert] = useState(false);

  // Cargar intentos desde localStorage al iniciar
  useEffect(() => {
    const savedAttempts = localStorage.getItem(`login_attempts_${correo}`);
    const savedLockUntil = localStorage.getItem(`lock_until_${correo}`);
    
    if (savedAttempts) {
      setAttemptsRemaining(parseInt(savedAttempts));
    }
    
    if (savedLockUntil) {
      const now = new Date();
      const lockDate = new Date(savedLockUntil);
      if (lockDate > now) {
        setLockUntil(savedLockUntil);
        setErrorType('account_locked');
        const diffMs = lockDate - now;
        setRemainingMinutes(Math.ceil(diffMs / (1000 * 60)));
        setShowLockAlert(true);
      } else {
        // Limpiar bloqueo expirado
        localStorage.removeItem(`lock_until_${correo}`);
        localStorage.removeItem(`login_attempts_${correo}`);
      }
    }
  }, [correo]);

  // Efecto para actualizar el tiempo restante
  useEffect(() => {
    let interval;
    if (errorType === 'account_locked' && remainingMinutes > 0) {
      interval = setInterval(() => {
        setRemainingMinutes(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setErrorType('');
            setError('');
            setShowLockAlert(false);
            // Limpiar bloqueo
            localStorage.removeItem(`lock_until_${correo}`);
            localStorage.removeItem(`login_attempts_${correo}`);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [errorType, remainingMinutes, correo]);

  const togglePassword = () => setShowPassword(!showPassword);

  // Formatear tiempo para mostrar
  const formatTimeMessage = () => {
    if (remainingMinutes <= 0) return '';
    
    if (remainingMinutes < 1) {
      return 'Menos de 1 minuto';
    } else if (remainingMinutes === 1) {
      return '1 minuto';
    } else {
      return `${remainingMinutes} minutos`;
    }
  };

  // Formatear fecha de bloqueo
  const formatLockUntil = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ===== Login con email y contraseña =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setShowLockAlert(false);
    setIsLoading(true);

    // Validación básica
    if (!correo.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña');
      setErrorType('validation');
      setIsLoading(false);
      return;
    }

    // Verificar si está bloqueado localmente
    const savedLockUntil = localStorage.getItem(`lock_until_${correo}`);
    if (savedLockUntil) {
      const lockDate = new Date(savedLockUntil);
      const now = new Date();
      if (lockDate > now) {
        setErrorType('account_locked');
        setError('Cuenta bloqueada temporalmente. Intenta más tarde.');
        const diffMs = lockDate - now;
        setRemainingMinutes(Math.ceil(diffMs / (1000 * 60)));
        setShowLockAlert(true);
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:5003/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo_usuario: correo.trim(),
          password_usuario: password.trim()
        }),
      });

      const data = await res.json();
      console.log('📨 Respuesta del servidor:', { status: res.status, data });
      
      // ✅ IMPORTANTE: Verificar tanto res.ok como data.success
      if (res.ok && data.success) {
        // ✅ LOGIN EXITOSO - CORREGIDO
        console.log('✅ LOGIN: Inicio de sesión exitoso para:', data.user?.nombre_usuario || correo);
        
        // 1. Guardar datos en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', Date.now().toString());
        
        // 2. Resetear intentos
        localStorage.removeItem(`login_attempts_${correo}`);
        localStorage.removeItem(`lock_until_${correo}`);
        
        // 3. Mostrar mensaje de éxito
        setError('¡Inicio de sesión exitoso! Redirigiendo...');
        setErrorType('success');
        setIsLoading(true); // Mantener loading durante redirección
        
        // 4. Redirigir después de breve delay - SIN setTimeout para evitar problemas
        setTimeout(() => {
          console.log('🚀 Redirigiendo a /dashboard');
          navigate('/dashboard', { replace: true });
        }, 800); // Aumentado a 800ms para ver el mensaje
        
      } else {
        // ❌ ERRORES
        setIsLoading(false);
        
        const type = data.errorType || 
          (res.status === 423 ? 'account_locked' : 
           res.status === 401 ? 'invalid_credentials' : 
           res.status === 404 ? 'user_not_found' : 
           'server_error');
        
        setErrorType(type);
        setError(data.message || 'Error desconocido');
        
        switch(type) {
          case 'account_locked': {
            // Bloqueo desde el backend
            const mins = data.remaining_minutes || 15;
            const lockTime = new Date();
            lockTime.setMinutes(lockTime.getMinutes() + mins);
            
            setRemainingMinutes(mins);
            setLockUntil(lockTime.toISOString());
            setAttemptsRemaining(0);
            setShowLockAlert(true);
            
            // Guardar bloqueo en localStorage
            localStorage.setItem(`lock_until_${correo}`, lockTime.toISOString());
            localStorage.setItem(`login_attempts_${correo}`, '0');
            
            console.warn(`🔒 Cuenta bloqueada por ${mins} minutos`);
            break;
          }
            
          case 'invalid_credentials': {
            // Manejar intentos fallidos LOCALMENTE
            let currentAttempts = parseInt(localStorage.getItem(`login_attempts_${correo}`)) || 3;
            currentAttempts = Math.max(0, currentAttempts - 1);
            
            localStorage.setItem(`login_attempts_${correo}`, currentAttempts.toString());
            setAttemptsRemaining(currentAttempts);
            
            // Si es el último intento, preparar bloqueo
            if (currentAttempts === 0) {
              const lockTime = new Date();
              lockTime.setMinutes(lockTime.getMinutes() + 15);
              
              localStorage.setItem(`lock_until_${correo}`, lockTime.toISOString());
              setLockUntil(lockTime.toISOString());
              setRemainingMinutes(15);
              setErrorType('account_locked');
              setError('Cuenta bloqueada por 15 minutos. Demasiados intentos fallidos.');
              setShowLockAlert(true);
              
              console.warn('🔒 Cuenta bloqueada localmente por 15 minutos');
            } else {
              // Mostrar intentos restantes
              setError(`Contraseña incorrecta. Te quedan ${currentAttempts} intentos antes del bloqueo.`);
            }
            break;
          }
            
          case 'user_not_found': {
            setError('Usuario no encontrado. Verifica tu correo electrónico.');
            break;
          }
            
          default: {
            setError(data.message || 'Error en el servidor. Intenta nuevamente.');
          }
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error('❌ Error de conexión:', err);
      setErrorType('connection_error');
      setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    }
  };

  // ===== Login con Google =====
  const handleGoogleLogin = async () => {
    setError('');
    setErrorType('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('✅ Google Login exitoso:', user.email);
      
      const userData = {
        nombre_usuario: user.displayName || 'Usuario',
        correo_usuario: user.email,
        foto_usuario: user.photoURL,
        provider: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('auth_token', Date.now().toString());
      
      // Redirigir inmediatamente
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('❌ Error en login con Google:', err);
      setErrorType('google_error');
      setError('Error al iniciar sesión con Google. Intenta con email y contraseña.');
    }
  };

  // ===== Renderizado condicional de mensajes de error =====
  const renderError = () => {
    if (!error) return null;
    
    const errorConfigs = {
      'account_locked': {
        bg: 'bg-linear-to-r from-red-50 to-orange-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: '🔒'
      },
      'invalid_credentials': {
        bg: 'bg-linear-to-r from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: '⚠️'
      },
      'user_not_found': {
        bg: 'bg-linear-to-r from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: '👤'
      },
      'success': {
        bg: 'bg-linear-to-r from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: '✅'
      },
      'connection_error': {
        bg: 'bg-linear-to-r from-gray-50 to-slate-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        icon: '📡'
      },
      'default': {
        bg: 'bg-linear-to-r from-gray-50 to-slate-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        icon: '🚨'
      }
    };
    
    const config = errorConfigs[errorType] || errorConfigs.default;
    
    return (
      <div className={`${config.bg} ${config.border} ${config.text} p-4 rounded-xl border ${errorType === 'account_locked' ? 'animate-pulse' : ''}`}>
        <div className="flex items-start gap-3">
          <span className="text-xl">{config.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{error}</h3>
            
            {errorType === 'account_locked' && remainingMinutes > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tiempo restante:</span>
                  <span className="text-sm font-bold">{formatTimeMessage()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(100 - (remainingMinutes / 15 * 100), 5)}%` }}
                  ></div>
                </div>
                {lockUntil && (
                  <p className="text-xs mt-2 opacity-75">
                    Desbloqueo automático: {formatLockUntil(lockUntil)}
                  </p>
                )}
                <div className="mt-3 text-sm">
                  <p className="font-medium">¿Qué pasó?</p>
                  <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                    <li>Se detectaron 3 intentos fallidos consecutivos</li>
                    <li>Tu cuenta fue bloqueada por seguridad</li>
                    <li>Se desbloqueará automáticamente al terminar el tiempo</li>
                  </ul>
                </div>
              </div>
            )}
            
            {errorType === 'invalid_credentials' && attemptsRemaining < 3 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Intentos restantes:</span>
                  <span className="text-sm font-bold">{attemptsRemaining}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(attemptsRemaining / 3) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-2 text-yellow-700">
                  ⚠️ Al tercer intento fallido, tu cuenta será bloqueada por 15 minutos.
                </p>
              </div>
            )}
            
            {(errorType === 'user_not_found' || errorType === 'connection_error') && (
              <div className="mt-2">
                <p className="text-sm">Sugerencias:</p>
                <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                  <li>Verifica que el correo esté escrito correctamente</li>
                  <li>Si no tienes cuenta, <Link to="/registro" className="underline font-medium">regístrate aquí</Link></li>
                  {errorType === 'connection_error' && <li>Revisa tu conexión a internet</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 font-sans p-4 sm:p-6 relative overflow-hidden">
      {/* Fondo decorativo animado */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-r from-blue-300 to-cyan-300 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-linear-to-r from-purple-300 to-pink-300 rounded-full opacity-10 blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-linear-to-r from-teal-300 to-emerald-300 rounded-full opacity-5 blur-2xl animate-pulse animation-delay-2000"></div>
      
      {/* Botón volver al inicio */}
      <Link 
        to="/" 
        className="absolute top-6 left-4 sm:left-6 text-gray-700 hover:text-indigo-600 text-sm font-medium hover:underline z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
      >
        ← Volver al inicio
      </Link>

      {/* Contenedor principal */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-gray-100 z-20 transform transition-all duration-300 hover:shadow-3xl">
        {/* Logo con decoración */}
        <div className="relative mb-6">
          <div className="absolute -top-3 -left-3 w-20 h-20 bg-linear-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse animation-delay-500"></div>
          <img 
            src={logo} 
            alt="Find & Rate Logo" 
            className="relative mx-auto mb-2 w-40 sm:w-48 object-contain z-10 transform transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Bienvenido a <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Find&Rate</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Inicia sesión para continuar explorando lugares increíbles
        </p>

        {/* Formulario */}
        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="tucorreo@email.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={isLoading || (errorType === 'account_locked' && remainingMinutes > 0)}
                className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errorType === 'account_locked' && remainingMinutes > 0 
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200'
                } ${isLoading ? 'opacity-70' : ''}`}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">✉️</span>
            </div>
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Contraseña
              </label>
              <Link 
                to="/recuperar-cuenta" 
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || (errorType === 'account_locked' && remainingMinutes > 0)}
                className={`w-full px-4 py-3 pl-11 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  errorType === 'account_locked' && remainingMinutes > 0 
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200'
                } ${isLoading ? 'opacity-70' : ''}`}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔒</span>
              <button
                type="button"
                onClick={togglePassword}
                disabled={isLoading || (errorType === 'account_locked' && remainingMinutes > 0)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                  errorType === 'account_locked' && remainingMinutes > 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-110'
                }`}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Mensajes de error/información */}
          {renderError()}

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            disabled={isLoading || (errorType === 'account_locked' && remainingMinutes > 0)}
            className={`mt-1 py-3.5 text-white font-bold rounded-xl transition-all duration-300 shadow-lg transform ${
              isLoading
                ? 'bg-linear-to-r from-indigo-400 to-purple-400 cursor-wait scale-95'
                : errorType === 'account_locked' && remainingMinutes > 0
                ? 'bg-linear-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98] hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {errorType === 'success' ? 'Redirigiendo...' : 'Verificando credenciales...'}
                </span>
              </div>
            ) : errorType === 'account_locked' && remainingMinutes > 0 ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">🔒</span>
                <div className="text-left">
                  <div className="font-bold">Cuenta Bloqueada</div>
                  <div className="text-xs opacity-90">{formatTimeMessage()} restantes</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🔑</span>
                <span>Iniciar Sesión</span>
              </div>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="my-6 sm:my-7 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">
              o continúa con
            </span>
          </div>
        </div>

        {/* Botones de autenticación social */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || (errorType === 'account_locked' && remainingMinutes > 0)}
            className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow transform ${
              isLoading || (errorType === 'account_locked' && remainingMinutes > 0)
                ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:-translate-y-0.5 active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full">
              <span className="text-lg font-bold text-red-500 leading-none">G</span>
            </div>
            <span className="font-medium">Continuar con Google</span>
          </button>
        </div>

        {/* Enlace a registro */}
        <div className="pt-5 sm:pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/registro" 
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors duration-200"
            >
              Regístrate aquí
            </Link>
          </p>
          
          {errorType === 'account_locked' && remainingMinutes > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                <span className="font-bold">¿Necesitas ayuda?</span>{' '}
                Si crees que esto es un error o necesitas acceso urgente,{' '}
                <Link to="/soporte" className="underline font-medium">
                  contacta a nuestro soporte técnico
                </Link>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer informativo */}
      <footer className="mt-8 text-center z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm max-w-md">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Find&Rate — Todos los derechos reservados
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-medium">Sistema de seguridad activo</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-300"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Protección: Bloqueo automático tras 3 intentos fallidos • Encriptación SSL
          </p>
        </div>
      </footer>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default Login;