import { Link } from "react-router-dom";

const Privacidad = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        Política de Privacidad
      </h1>
      <p className="text-gray-600 mb-4">
        En <span className="font-semibold">Find & Rate ⭐</span> nos
        comprometemos a proteger tu privacidad y garantizar que tu información
        personal esté segura. Esta política explica cómo recopilamos, usamos y
        protegemos tus datos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Información que recopilamos
      </h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Datos de registro: nombre, correo electrónico y contraseña.</li>
        <li>Datos técnicos: dirección IP, tipo de navegador, dispositivo.</li>
        <li>
          Información proporcionada por ti: reseñas, valoraciones y contenido
          subido a la plataforma.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Uso de la información
      </h2>
      <p className="text-gray-700">
        Utilizamos tus datos para ofrecerte nuestros servicios, mejorar tu
        experiencia, personalizar el contenido, enviar notificaciones
        importantes y mantener la seguridad de la plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Compartición de datos
      </h2>
      <p className="text-gray-700">
        No vendemos tu información. Solo compartimos datos con proveedores de
        servicios (hosting, herramientas analíticas, envío de correos) bajo
        estrictas medidas de seguridad.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Seguridad de la información
      </h2>
      <p className="text-gray-700">
        Implementamos medidas técnicas y organizativas para proteger tus datos,
        incluyendo encriptación y controles de acceso. Sin embargo, ningún
        sistema es 100% seguro.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Tus derechos
      </h2>
      <p className="text-gray-700">
        Tienes derecho a acceder, rectificar, eliminar o limitar el uso de tus
        datos personales. Puedes contactarnos en{" "}
        <a
          href="mailto:sofiaherrerabarcenas@gmail.com"
          className="text-blue-600 underline"
        >
          privacidad@findandrate.com
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Cambios en esta política
      </h2>
      <p className="text-gray-700 mb-8">
        Podemos actualizar esta política cuando sea necesario. Te notificaremos
        los cambios relevantes publicándolos en esta página.
      </p>

      <footer className="border-t pt-4 text-sm text-gray-500">
        Última actualización: <strong>Septiembre 2025</strong>
      </footer>

      {/* Botón para volver al inicio */}
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block bg-purple-400 text-white px-5 py-2 rounded-xl shadow hover:bg-purple-700 transition"
        >
          ⬅ Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Privacidad;
