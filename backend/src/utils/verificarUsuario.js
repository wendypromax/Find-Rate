// utils/verificarUsuario.js
export const verificarUsuarioCompleto = () => {
  console.log('🔍 === VERIFICACIÓN COMPLETA DE USUARIO ===');
  
  // Verificar localStorage
  console.log('📦 localStorage contenido:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`  ${key}:`, value.substring(0, 100));
  }
  
  // Verificar sessionStorage
  console.log('📦 sessionStorage contenido:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`  ${key}:`, value.substring(0, 100));
  }
  
  // Intentar obtener usuario
  let usuario = null;
  const posiblesLlaves = ['user', 'usuario', 'currentUser', 'authUser'];
  
  for (const llave of posiblesLlaves) {
    const usuarioStr = localStorage.getItem(llave) || sessionStorage.getItem(llave);
    if (usuarioStr) {
      try {
        usuario = JSON.parse(usuarioStr);
        console.log(`✅ Usuario encontrado en ${llave}:`, usuario);
        break;
      } catch (e) {
        console.warn(`⚠️ Error parseando ${llave}:`, e);
      }
    }
  }
  
  return usuario;
};

// En tu componente, llama a esta función para debug
const debugUsuario = () => {
  const usuario = verificarUsuarioCompleto();
  alert(`Usuario debug:\n${JSON.stringify(usuario, null, 2)}`);
};