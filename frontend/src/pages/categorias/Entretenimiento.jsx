import { Link } from "react-router-dom";

export default function Entretenimiento() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header con gradiente */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Entretenimiento
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            Encuentra diversión para todas las edades: teatros, cines, espectáculos y más.
          </p>
        </div>

        {/* Tarjetas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              name: "Cineplex",
              desc: "Cine moderno con las últimas películas y salas premium.",
              rating: "4.5",
              icon: "🎬",
              color: "from-purple-500 to-violet-500",
            },
            {
              name: "Teatro Principal",
              desc: "Disfruta de obras de teatro y espectáculos en vivo.",
              rating: "4.7",
              icon: "🎭",
              color: "from-pink-500 to-rose-500",
            },
            {
              name: "Parque de Diversiones Aventura",
              desc: "Atracciones para toda la familia y mucha diversión.",
              rating: "4.9",
              icon: "🎢",
              color: "from-amber-500 to-orange-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              {/* Icono con gradiente */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl mb-4`}>
                {item.icon}
              </div>
              
              <h3 className="font-bold text-xl text-gray-800 mb-3">{item.name}</h3>
              <p className="text-gray-600 mb-5">{item.desc}</p>
              
              {/* Rating con estilo mejorado */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 text-lg">{item.rating}</span>
                  <span className="text-gray-400 ml-1">/5</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de información */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Diversión sin límites
            </h2>
            <p className="text-gray-600 mb-6">
              Descubre los mejores lugares de entretenimiento de la ciudad. Desde cines de última generación 
              hasta espectáculos en vivo que te dejarán sin aliento.
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats específicas para entretenimiento */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Salas de cine", value: "45+" },
            { label: "Espectáculos", value: "120+" },
            { label: "Visitantes/mes", value: "80K+" },
            { label: "Rating promedio", value: "4.7" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}