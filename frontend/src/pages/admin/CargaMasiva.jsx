import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCloudUploadAlt, 
  FaDownload, 
  FaEye, 
  FaTrash, 
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaFileExcel,
  FaChartBar,
  FaArrowLeft,
  FaUserCircle
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

const CargaMasiva = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Función para obtener información de usuario
  const obtenerInfoUsuarioCompleta = () => {
    let usuario = null;
    let token = null;
    
    // Buscar usuario en localStorage
    try {
      const usuarioStr = localStorage.getItem('user') || 
                         sessionStorage.getItem('user') ||
                         localStorage.getItem('usuario');
      
      if (usuarioStr && usuarioStr !== 'undefined') {
        usuario = JSON.parse(usuarioStr);
        console.log('✅ Usuario encontrado:', usuario);
      }
    } catch (e) {
      console.warn('⚠️ Error parseando usuario:', e);
    }
    
    // Buscar token
    token = localStorage.getItem('token') || 
            sessionStorage.getItem('token') ||
            localStorage.getItem('auth_token');
    
    // Formatear usuario para consistencia
    if (usuario) {
      // Asegurar que tenga id_usuario
      if (!usuario.id_usuario && usuario.id) {
        usuario.id_usuario = usuario.id;
      }
    }
    
    return { usuario, token };
  };

  // Efecto para obtener usuario logueado
  useEffect(() => {
    const cargarUsuario = () => {
      const { usuario } = obtenerInfoUsuarioCompleta();
      
      if (usuario && usuario.id_usuario) {
        console.log('👤 Usuario establecido:', usuario);
        setUsuarioLogueado(usuario);
      } else {
        console.warn('⚠️ No se pudo obtener usuario válido');
        
        // Usuario de respaldo temporal
        const usuarioDemo = {
          id_usuario: 1,
          id: 1,
          nombre: 'Usuario Demo',
          email: 'demo@empresa.com',
          rol: 'admin'
        };
        
        setUsuarioLogueado(usuarioDemo);
        
        // Mostrar alerta
        setTimeout(() => {
          alert('⚠️ Para usar la carga masiva, primero debes iniciar sesión. Los lugares se asignarán al usuario autenticado.');
        }, 1000);
      }
    };
    
    cargarUsuario();
  }, []);

  // Plantilla de ejemplo
  const templateStructure = [
    { campo: 'nit', tipo: 'number', requerido: true, ejemplo: '123456789' },
    { campo: 'nombre', tipo: 'string', requerido: true, ejemplo: 'Restaurante La Parrilla' },
    { campo: 'localidad', tipo: 'string', requerido: true, ejemplo: 'Bogotá' },
    { campo: 'direccion', tipo: 'string', requerido: true, ejemplo: 'Calle Principal 123' },
    { campo: 'red_social', tipo: 'string', requerido: true, ejemplo: '@restaurantelaparrilla' },
    { campo: 'tipo_entrada', tipo: 'string', requerido: true, ejemplo: 'Gratuita' },
    { campo: 'id_tipo_negociofk', tipo: 'number', requerido: false, ejemplo: '1' },
    { campo: 'id_tipo_serviciofk', tipo: 'number', requerido: false, ejemplo: '2' },
    { campo: 'imagen_lugar', tipo: 'string', requerido: false, ejemplo: 'restaurante.jpg' },
  ];

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Por favor, sube un archivo CSV o Excel válido (.csv, .xls, .xlsx)');
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setError(null);
    setSuccess(null);
    setStats(null);
    previewFile(uploadedFile);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        let jsonData = [];
        
        if (file.name.endsWith('.csv')) {
          const lines = data.split('\n');
          if (lines.length === 0) {
            setError('El archivo CSV está vacío');
            return;
          }
          
          const headers = lines[0].split(',').map(h => h.trim());
          
          jsonData = lines.slice(1)
            .filter(line => line.trim() !== '')
            .map((line, index) => {
              const values = line.split(',');
              const obj = {};
              headers.forEach((header, idx) => {
                obj[header] = values[idx] ? values[idx].trim() : '';
              });
              obj._rowNumber = index + 2;
              return obj;
            });
        } else {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
          jsonData = jsonData.map((item, index) => ({
            ...item,
            _rowNumber: index + 2
          }));
        }
        
        if (jsonData.length === 0) {
          setError('El archivo no contiene datos válidos');
          return;
        }
        
        // Validar columnas requeridas
        const primeraFila = jsonData[0];
        const columnasRequeridas = ['nit', 'nombre', 'localidad', 'direccion'];
        const columnasFaltantes = columnasRequeridas.filter(col => 
          primeraFila[col] !== undefined
        );
        
        if (columnasFaltantes.length < columnasRequeridas.length) {
          setError(`Faltan columnas requeridas. Asegúrate de tener: ${columnasRequeridas.join(', ')}`);
          return;
        }
        
        setPreviewData(jsonData.slice(0, 5));
      } catch (err) {
        console.error('Error en previewFile:', err);
        setError('Error al leer el archivo. Verifica el formato.');
      }
    };

    reader.onerror = () => {
      setError('Error al leer el archivo.');
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo primero');
      return;
    }

    if (!usuarioLogueado?.id_usuario) {
      setError('No estás autenticado. Por favor inicia sesión primero.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('archivo', file);

      // Obtener información de autenticación
      const { usuario, token } = obtenerInfoUsuarioCompleta();
      
      if (!usuario || !usuario.id_usuario) {
        setError('❌ No se pudo obtener información de usuario. Por favor inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      console.log('📤 Enviando archivo al backend...');
      console.log('👤 Usuario ID:', usuario.id_usuario);
      console.log('👤 Nombre:', usuario.nombre_usuario || usuario.nombre);

      // PREPARAR HEADERS - ¡IMPORTANTE!
      const headers = {
        'X-User-Id': usuario.id_usuario.toString(),
        'X-User-Email': usuario.correo_usuario || usuario.email || '',
        'X-User-Nombre': usuario.nombre_usuario || usuario.nombre || 'Usuario'
      };

      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📋 Headers enviados:', headers);

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Hacer la petición
      const response = await fetch('http://localhost:5003/api/carga-masiva/lugares/carga-masiva', {
        method: 'POST',
        body: formData,
        headers: headers
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Manejar respuesta
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: await response.text() };
        }
        
        console.error('❌ Error del servidor:', errorData);
        
        if (response.status === 401) {
          throw new Error('No autorizado. Tu sesión puede haber expirado.');
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Error en la solicitud');
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Respuesta del servidor:', result);

      if (!result.success) {
        throw new Error(result.message || 'Error en la carga masiva');
      }

      // Mostrar mensaje de éxito
      const exitosos = result.data?.resumen?.exitosos || 0;
      const total = result.data?.resumen?.totalProcesados || 0;
      const usuarioNombre = result.data?.resumen?.usuarioNombre || usuario.nombre || '';
      
      setSuccess(`🎉 ¡Carga masiva completada para ${usuarioNombre}! 
                \n✅ ${exitosos} de ${total} lugares insertados exitosamente.
                \n👤 Usuario: ${usuarioNombre} (ID: ${usuario.id_usuario})`);
      
      // Configurar estadísticas
      setStats({
        total: total,
        exitosos: exitosos,
        fallidos: result.data?.resumen?.errores || 0,
        duplicados: 0,
        errores: result.data?.detalles?.erroresEjemplo || [],
        usuario: result.usuario || result.data?.usuario || usuario,
        tasaExito: result.data?.resumen?.tasaExito || '0%',
        formatoArchivo: result.data?.resumen?.formatoArchivo || 'desconocido'
      });
      
      // Resetear después de 8 segundos
      setTimeout(() => {
        setFile(null);
        setFileName('');
        setPreviewData([]);
        setProgress(0);
      }, 8000);

    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      setError(err.message || 'Error al procesar el archivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Crear workbook
      const wb = XLSX.utils.book_new();
      
      // Datos de ejemplo
      const exampleData = [
        {
          nit: '123456789',
          nombre: 'Restaurante La Parrilla',
          localidad: 'Bogotá',
          direccion: 'Calle Principal 123, Centro',
          red_social: '@restaurantelaparrilla',
          tipo_entrada: 'Gratuita',
          id_tipo_negociofk: '1',
          id_tipo_serviciofk: '2',
          imagen_lugar: 'restaurante.jpg'
        },
        {
          nit: '987654321',
          nombre: 'Hotel Estelar',
          localidad: 'Medellín',
          direccion: 'Avenida Principal 456',
          red_social: '@hotelestelar',
          tipo_entrada: 'Paga',
          id_tipo_negociofk: '2',
          id_tipo_serviciofk: '3',
          imagen_lugar: 'hotel.jpg'
        }
      ];

      const ws = XLSX.utils.json_to_sheet(exampleData);
      XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
      XLSX.writeFile(wb, 'plantilla_lugares.xlsx');
      
      setSuccess('✅ Plantilla Excel descargada exitosamente');
    } catch (error) {
      console.error('Error descargando plantilla:', error);
      setError('Error al generar la plantilla.');
    }
  };

  const handleDownloadCSVTemplate = async () => {
    try {
      // Crear contenido CSV
      const headers = ['nit,nombre,localidad,direccion,red_social,tipo_entrada,id_tipo_negociofk,id_tipo_serviciofk,imagen_lugar'];
      const exampleRows = [
        '123456789,Restaurante La Parrilla,Bogotá,Calle Principal 123,@restaurantelaparrilla,Gratuita,1,2,restaurante.jpg',
        '987654321,Hotel Estelar,Medellín,Avenida Principal 456,@hotelestelar,Paga,2,3,hotel.jpg'
      ];
      
      const contenido = headers.concat(exampleRows).join('\n');
      
      // Crear blob y descargar
      const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', 'plantilla_lugares.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('✅ Plantilla CSV descargada exitosamente');
    } catch (error) {
      console.error('Error descargando plantilla CSV:', error);
      setError('Error al descargar la plantilla CSV');
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFileName('');
    setPreviewData([]);
    setError(null);
    setSuccess(null);
    setStats(null);
    setProgress(0);
  };

  const verificarUsuario = () => {
    const { usuario } = obtenerInfoUsuarioCompleta();
    
    const mensaje = usuario ? 
      `✅ Usuario autenticado:
ID: ${usuario.id_usuario || usuario.id}
Nombre: ${usuario.nombre_usuario || usuario.nombre || 'No disponible'}
Email: ${usuario.correo_usuario || usuario.email || 'No disponible'}

Los lugares se asignarán a este usuario.` :
      '❌ No hay usuario autenticado. Por favor inicia sesión.';
    
    alert(mensaje);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            <FaArrowLeft /> Volver al Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carga Masiva de Lugares</h1>
              <p className="text-gray-600 mt-2">Sube un archivo Excel o CSV para cargar múltiples lugares a la vez</p>
            </div>
            
            {/* Información del usuario */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <FaUserCircle className="text-blue-500 text-xl" />
              <div>
                <p className="font-medium text-gray-800">
                  {usuarioLogueado?.nombre_usuario || usuarioLogueado?.nombre || 'Usuario'}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {usuarioLogueado?.id_usuario || usuarioLogueado?.id || 'N/A'}
                </p>
              </div>
              <button
                onClick={verificarUsuario}
                className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta de carga */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCloudUploadAlt className="text-blue-500" /> Subir Archivo
              </h2>
              
              <div className="space-y-4">
                {/* Input de archivo */}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-1 cursor-pointer"
                  >
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                      ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <FaCloudUploadAlt className={`text-4xl mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-gray-700 font-medium">
                        {fileName ? `📎 ${fileName}` : '📁 Haz clic para seleccionar archivo'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        CSV, XLS o XLSX (máx. 10MB)
                      </p>
                    </div>
                  </label>
                  
                  {fileName && !loading && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setPreviewOpen(true)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Vista previa"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={handleClearFile}
                        className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Eliminar archivo"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Barra de progreso */}
                {loading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Procesando archivo...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Mensajes de estado */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 text-red-700">
                      <FaTimesCircle /> <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <FaCheckCircle /> <span className="font-medium">{success}</span>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!file || loading || !usuarioLogueado?.id_usuario}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      !file || loading || !usuarioLogueado?.id_usuario
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <FaCloudUploadAlt />
                    {loading ? 'Procesando...' : 'Iniciar Carga Masiva'}
                  </button>
                  
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <FaFileExcel /> Descargar Plantilla Excel
                  </button>
                  
                  <button
                    onClick={handleDownloadCSVTemplate}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <FaDownload /> Descargar Plantilla CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaChartBar className="text-purple-500" /> Resultados de la Carga
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-indigo-700">{stats.total}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Registros</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                    <div className="text-3xl font-bold text-emerald-700">{stats.exitosos}</div>
                    <div className="text-sm text-gray-600 mt-1">Exitosos</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border border-red-100">
                    <div className="text-3xl font-bold text-rose-700">{stats.fallidos}</div>
                    <div className="text-sm text-gray-600 mt-1">Fallidos</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
                    <div className="text-3xl font-bold text-amber-700">{stats.tasaExito}</div>
                    <div className="text-sm text-gray-600 mt-1">Tasa de Éxito</div>
                  </div>
                </div>

                {stats.usuario && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Usuario:</span> {stats.usuario.nombre} (ID: {stats.usuario.id_usuario || stats.usuario.id})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Instrucciones</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Descarga la plantilla</p>
                    <p className="text-sm text-gray-600 mt-1">Usa Excel o CSV con los campos correctos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Completa los datos</p>
                    <p className="text-sm text-gray-600 mt-1">Llena la información de los lugares</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Sube el archivo</p>
                    <p className="text-sm text-gray-600 mt-1">Selecciona el archivo completado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Inicia la carga</p>
                    <p className="text-sm text-gray-600 mt-1">Procesa los datos en el sistema</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Campos Requeridos:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {templateStructure
                    .filter(field => field.requerido)
                    .map(field => (
                      <span 
                        key={field.campo}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {field.campo}*
                      </span>
                    ))}
                </div>

                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">⚠️ Importante</p>
                      <p className="text-xs text-gray-600 mt-1">
                        • Los lugares se asignarán automáticamente a <strong>TU CUENTA</strong><br/>
                        • Los campos marcados con * son obligatorios<br/>
                        • El NIT debe ser único para cada lugar<br/>
                        • Usuario actual: <strong>{usuarioLogueado?.nombre || 'No identificado'}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vista previa */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Vista Previa - Primeros 5 registros</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[60vh]">
              {previewData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewData[0])
                          .filter(key => !key.startsWith('_'))
                          .map((header, index) => (
                            <th 
                              key={`header-${index}-${header}`}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}-${row._rowNumber || rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.entries(row)
                            .filter(([key]) => !key.startsWith('_'))
                            .map(([key, value], cellIndex) => (
                              <td 
                                key={`cell-${rowIndex}-${cellIndex}-${key}`}
                                className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate"
                                title={String(value)}
                              >
                                {String(value)}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No hay datos para mostrar
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargaMasiva;