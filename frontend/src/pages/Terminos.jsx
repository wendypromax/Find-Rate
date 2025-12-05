const Terminos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Términos y Condiciones
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-gray-800 to-gray-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Bienvenido a <span className="font-semibold text-indigo-600">Find&Rate</span>, 
            tu plataforma para descubrir y valorar lugares en Bogotá.
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-start">
            <div className="text-2xl mr-4">📜</div>
            <div>
              <p className="text-gray-700">
                Al acceder y utilizar nuestra aplicación, aceptas cumplir con los siguientes términos y condiciones. 
                Te recomendamos leerlos detenidamente antes de usar nuestros servicios.
              </p>
            </div>
          </div>
        </div>

        {/* Términos numerados */}
        <div className="space-y-8">
          <section className="border-l-4 border-gray-700 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-800">Aceptación de los términos</h2>
            </div>
            <p className="text-gray-600 pl-12">
              El uso de esta aplicación está sujeto a la aceptación total de estos términos. 
              Si no estás de acuerdo con alguno de ellos, por favor no utilices la aplicación.
            </p>
          </section>

          <section className="border-l-4 border-blue-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-800">Registro y acceso</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Para participar y dejar reseñas, debes registrarte proporcionando datos personales 
              verídicos, completos y actualizados, como nombre, correo electrónico y otros datos necesarios para la autenticación.
            </p>
          </section>

          <section className="border-l-4 border-purple-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                3
              </div>
              <h2 className="text-xl font-bold text-gray-800">Contenido generado por usuarios</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Las reseñas y comentarios son creados por los usuarios y reflejan opiniones personales. 
              La aplicación no se responsabiliza por la veracidad o contenido de dichas publicaciones.
            </p>
          </section>

          <section className="border-l-4 border-green-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                4
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tratamiento de datos personales</h2>
            </div>
            <div className="text-gray-600 pl-12 space-y-2">
              <p>
                Para el acceso y uso de la aplicación, recolectamos, almacenamos y tratamos tus datos 
                personales conforme a la legislación colombiana de protección de datos (Ley 1581 de 2012 y Decreto 1377 de 2013).
              </p>
              <p>
                Tus datos serán usados exclusivamente para administrar tu cuenta, mejorar la experiencia de usuario y fines estadísticos.
              </p>
              <p>
                Tienes derecho a conocer, actualizar y rectificar tus datos, así como a solicitar su supresión. 
                Para ejercer estos derechos, contacta a:
              </p>
              <a
                href="mailto:jesusdavid.rivera503@gmail.com"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <span className="mr-2">✉️</span>
                jesusdavid.rivera503@gmail.com
              </a>
            </div>
          </section>

          <section className="border-l-4 border-amber-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                5
              </div>
              <h2 className="text-xl font-bold text-gray-800">Seguridad de la información</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Implementamos medidas razonables para proteger tus datos personales, 
              pero no garantizamos seguridad absoluta frente a accesos no autorizados.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                6
              </div>
              <h2 className="text-xl font-bold text-gray-800">Propiedad intelectual</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Los derechos de la aplicación, su diseño, código, imágenes, contenido y marcas son propiedad exclusiva de Find&Rate. 
              Está prohibida la reproducción total o parcial sin autorización.
            </p>
          </section>

          <section className="border-l-4 border-indigo-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                7
              </div>
              <h2 className="text-xl font-bold text-gray-800">Modificaciones</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Nos reservamos el derecho a modificar estos términos y condiciones en cualquier momento, 
              notificándolo a través de la aplicación o correo electrónico.
            </p>
          </section>

          <section className="border-l-4 border-gray-600 pl-6">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                8
              </div>
              <h2 className="text-xl font-bold text-gray-800">Ley aplicable y jurisdicción</h2>
            </div>
            <p className="text-gray-600 pl-12">
              Estos términos se rigen por las leyes colombianas. 
              Cualquier controversia será resuelta en los juzgados de Bogotá, Colombia.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              <p>Última actualización: <strong className="text-gray-700">Septiembre 2025</strong></p>
              <p className="mt-1">© 2025 Find&Rate. Todos los derechos reservados.</p>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="/"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </footer>

        {/* Sello de aceptación */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
            <span className="mr-2">⚖️</span>
            Al usar Find&Rate, aceptas estos términos y condiciones
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;