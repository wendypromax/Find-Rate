import React from "react";
import { Link } from "react-router-dom";

const Conocenos = () => {
  return (
    <div className="max-w-2xl mx-auto my-16 bg-white px-10 py-12 rounded-[30px] text-center font-[Poppins] text-[#7f7ea3] shadow-[0_15px_35px_rgba(163,150,215,0.3)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(163,150,215,0.5)]">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-300 via-purple-300 to-sky-300 bg-clip-text text-transparent tracking-wide">
        ¿Quiénes somos?
      </h1>

      <p className="text-lg md:text-xl mb-6 leading-relaxed font-medium text-[#a8a7c7] [text-shadow:0_1px_3px_rgba(255,255,255,0.8)]">
        Somos una plataforma creada para ayudarte a resolver esos momentos en los que no sabes a dónde ir o qué hacer.
        Aquí podrás encontrar y calificar lugares que te inspiren, te relajen o te ayuden a descubrir nuevas experiencias.
      </p>

      <p className="text-lg md:text-xl mb-6 leading-relaxed font-medium text-[#a8a7c7] [text-shadow:0_1px_3px_rgba(255,255,255,0.8)]">
        Nuestro objetivo es brindarte una comunidad confiable y amigable que te apoye con recomendaciones reales y honestas,
        para que siempre tengas un lugar a dónde ir y una experiencia que disfrutar.
      </p>

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-[#e5e4f0] text-sm text-[#9b9ab9]">
  <p className="mb-2">© {new Date().getFullYear()} Tu Plataforma de Reseñas</p>
  <div className="flex justify-center gap-6">
    <Link
      to="/terminos"
      className="text-pink-600 hover:text-pink-700 hover:underline transition"
    >
      Términos
    </Link>
    <Link
      to="/privacidad"
      className="text-pink-600 hover:text-pink-700 hover:underline transition"
    >
      Privacidad
    </Link>
  </div>
</footer>
    </div>
  );
};

export default Conocenos;

