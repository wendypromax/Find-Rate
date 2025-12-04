const Terminos = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Términos y Condiciones</h1>

      <p className="text-gray-700 mb-4">
        Bienvenido a <strong>Find&Rate</strong>, una aplicación web dedicada a la reseña y valoración de lugares en Bogotá. 
        Al acceder y usar esta plataforma, usted acepta cumplir con los siguientes términos y condiciones:
      </p>

      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        <li>
          <strong>Aceptación de los términos:</strong> El uso de esta aplicación está sujeto a la aceptación total de estos términos. 
          Si no está de acuerdo con alguno de ellos, por favor no utilice la aplicación.
        </li>
        <li>
          <strong>Registro y acceso:</strong> Para participar y dejar reseñas, usted debe registrarse proporcionando datos personales 
          verídicos, completos y actualizados, como nombre, correo electrónico y otros datos necesarios para la autenticación.
        </li>
        <li>
          <strong>Contenido generado por usuarios:</strong> Las reseñas y comentarios son creados por los usuarios y reflejan opiniones personales. 
          La aplicación no se responsabiliza por la veracidad o contenido de dichas publicaciones.
        </li>
        <li>
          <strong>Tratamiento de datos personales:</strong> Para el acceso y uso de la aplicación, recolectamos, almacenamos y tratamos sus datos 
          personales conforme a la legislación colombiana de protección de datos (Ley 1581 de 2012 y Decreto 1377 de 2013). 
          Sus datos serán usados exclusivamente para administrar su cuenta, mejorar la experiencia de usuario y fines estadísticos. <br />
          Usted tiene derecho a conocer, actualizar y rectificar sus datos, así como a solicitar su supresión. 
          Para ejercer estos derechos, contacte a: 
          <a href="mailto:jesusdavid.rivera503@gmail.com" className="text-blue-600 underline ml-1">
            jesusdavid.rivera503@gmail.com
          </a>.
        </li>
        <li>
          <strong>Seguridad de la información:</strong> Implementamos medidas razonables para proteger sus datos personales, 
          pero no garantizamos seguridad absoluta frente a accesos no autorizados.
        </li>
        <li>
          <strong>Propiedad intelectual:</strong> Los derechos de la aplicación, su diseño, código, imágenes, contenido y marcas son propiedad exclusiva de Find&Rate. 
          Está prohibida la reproducción total o parcial sin autorización.
        </li>
        <li>
          <strong>Modificaciones:</strong> Nos reservamos el derecho a modificar estos términos y condiciones en cualquier momento, 
          notificándolo a través de la aplicación o correo electrónico.
        </li>
        <li>
          <strong>Ley aplicable y jurisdicción:</strong> Estos términos se rigen por las leyes colombianas. 
          Cualquier controversia será resuelta en los juzgados de Bogotá, Colombia.
        </li>
      </ol>
    </div>
  );
};

export default Terminos;
