import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBullseye, FaHandsHelping } from "react-icons/fa";

const Conocenos = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white card p-10 md:p-14 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 gradient-text">
                Conoce a Find&Rate
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Somos una comunidad que conecta personas con lugares memorables. Aquí puedes compartir experiencias reales, descubrir recomendaciones y apoyar negocios locales con reseñas honestas.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/registro" className="btn-primary">Crear cuenta</Link>
                <Link to="/escribir-resena" className="btn-secondary">Escribir reseña</Link>
                <Link to="/conocenos#equipo" className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition">Nuestra misión</Link>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl p-6 text-center">
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">Nuestra promesa</h4>
                <p className="text-slate-600 text-sm">Reseñas honestas, comunidad segura y experiencia centrada en el usuario.</p>
              </div>
            </div>
          </div>

          {/* Secciones: Misión / Visión / Valores */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border border-slate-100 shadow-sm text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mb-4">
                <FaBullseye />
              </div>
              <h5 className="font-semibold text-slate-900 mb-2">Misión</h5>
              <p className="text-slate-600 text-sm leading-relaxed">Facilitar decisiones confiables conectando usuarios con experiencias locales genuinas.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-slate-100 shadow-sm text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-4">
                <FaUsers />
              </div>
              <h5 className="font-semibold text-slate-900 mb-2">Visión</h5>
              <p className="text-slate-600 text-sm leading-relaxed">Ser la plataforma de referencia donde las mejores recomendaciones nacen de la comunidad.</p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-slate-100 shadow-sm text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-4">
                <FaHandsHelping />
              </div>
              <h5 className="font-semibold text-slate-900 mb-2">Valores</h5>
              <p className="text-slate-600 text-sm leading-relaxed">Transparencia, respeto y apoyo a negocios locales.</p>
            </div>
          </div>

          {/* Equipo */}
          <section id="equipo" className="mt-12">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Nuestro Equipo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Wendy Mora', role: 'Fundadora' },
                { name: 'Alex C', role: 'Frontend' },
                { name: 'Dev Team', role: 'Backend' },
                { name: 'Comunidad', role: 'Usuarios' }
              ].map((member, i) => (
                <div key={i} className="bg-white rounded-lg p-4 text-center border border-slate-100 shadow-sm">
                  <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold mb-3">{member.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-100 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Find&Rate. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link to="/terminos" className="text-slate-600 hover:text-slate-900">Términos</Link>
              <Link to="/privacidad" className="text-slate-600 hover:text-slate-900">Privacidad</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Conocenos;

