import { Link } from "react-router-dom";

export default function Atracciones() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header con gradiente */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Atracciones
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            Explora monumentos, museos y sitios culturales que no puedes perderte.
          </p>
        </div>

        {/* Tarjetas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              name: "Museo de Historia",
              desc: "Colecciones y exposiciones que narran la historia local.",
              rating: "4.6",
              icon: "🏛️",
              color: "from-blue-500 to-cyan-500",
            },
            {
              name: "Monumento Central",
              desc: "Un lugar emblemático para conocer y disfrutar.",
              rating: "4.7",
              icon: "🗽",
              color: "from-purple-500 to-pink-500",
            },
            {
              name: "Parque Natural",
              desc: "Senderos ecológicos y experiencias en contacto con la naturaleza.",
              rating: "4.9",
              icon: "🌳",
              color: "from-emerald-500 to-green-500",
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

        {/* Sección de información simplificada */}
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Descubre más atracciones
            </h2>
            <p className="text-gray-600 mb-6">
              Encuentra cientos de atracciones turísticas, eventos especiales y experiencias únicas 
              que se adaptan a tus intereses.
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Atracciones", value: "200+" },
            { label: "Reseñas", value: "5K+" },
            { label: "Visitantes/mes", value: "50K+" },
            { label: "Rating promedio", value: "4.8" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}