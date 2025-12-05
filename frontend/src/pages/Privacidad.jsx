import { Link } from "react-router-dom";

const Privacidad = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Política de Privacidad
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            En <span className="font-semibold text-indigo-600">Find & Rate</span> nos
            comprometemos a proteger tu privacidad y garantizar que tu información
            personal esté segura.
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
          <div className="flex items-start">
            <div className="text-2xl mr-4">🔒</div>
            <div>
              <p className="text-gray-700">
                Esta política explica detalladamente cómo recopilamos, usamos, protegemos 
                y gestionamos tus datos personales cuando utilizas nuestros servicios.
              </p>
            </div>
          </div>
        </div>

        {/* Contenido de políticas */}
        <div className="space-y-8">
          <section className="border-l-4 border-indigo-500 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">1</span>
              Información que recopilamos
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong className="text-gray-800">Datos de registro:</strong> nombre, correo electrónico y contraseña.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong className="text-gray-800">Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong className="text-gray-800">Información proporcionada:</strong> reseñas, valoraciones y contenido subido a la plataforma.</span>
              </li>
            </ul>
          </section>

          <section className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">2</span>
              Uso de la información
            </h2>
            <p className="text-gray-600">
              Utilizamos tus datos para ofrecerte nuestros servicios, mejorar tu
              experiencia, personalizar el contenido, enviar notificaciones
              importantes y mantener la seguridad de la plataforma.
            </p>
          </section>

          <section className="border-l-4 border-purple-500 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-sm">3</span>
              Compartición de datos
            </h2>
            <p className="text-gray-600">
              <strong className="text-gray-800">No vendemos tu información.</strong> Solo compartimos datos con proveedores de
              servicios (hosting, herramientas analíticas, envío de correos) bajo
              estrictas medidas de seguridad y acuerdos de confidencialidad.
            </p>
          </section>

          <section className="border-l-4 border-green-500 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">4</span>
              Seguridad de la información
            </h2>
            <p className="text-gray-600">
              Implementamos medidas técnicas y organizativas avanzadas para proteger tus datos,
              incluyendo encriptación, controles de acceso y auditorías regulares.
            </p>
          </section>

          <section className="border-l-4 border-amber-500 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3 text-sm">5</span>
              Tus derechos
            </h2>
            <p className="text-gray-600 mb-4">
              Tienes derecho a acceder, rectificar, eliminar o limitar el uso de tus
              datos personales. Para ejercer estos derechos, puedes contactarnos en:
            </p>
            <a
              href="mailto:privacidad@findandrate.com"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <span className="mr-2">✉️</span>
              privacidad@findandrate.com
            </a>
          </section>

          <section className="border-l-4 border-gray-400 pl-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-3 text-sm">6</span>
              Cambios en esta política
            </h2>
            <p className="text-gray-600">
              Podemos actualizar esta política cuando sea necesario. Te notificaremos
              los cambios relevantes publicándolos en esta página y, cuando sea apropiado,
              te enviaremos una notificación por correo electrónico.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              <p>Última actualización: <strong className="text-gray-700">Septiembre 2025</strong></p>
              <p className="mt-1">© 2025 Find & Rate. Todos los derechos reservados.</p>
            </div>
            
            <Link
              to="/"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              <span className="mr-2">←</span>
              Volver al inicio
            </Link>
          </div>
        </footer>

        {/* Sello de privacidad */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
            <span className="mr-2">🛡️</span>
            Protección de datos conforme a normativas internacionales
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;