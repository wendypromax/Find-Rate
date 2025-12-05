import { Link } from "react-router-dom";

export default function Hoteles() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header con gradiente */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Hoteles
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            Encuentra el alojamiento perfecto para tu próxima aventura.
          </p>
        </div>

        {/* Tarjetas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              name: "Resort Playa Paraíso",
              desc: "Lujo y comodidad frente al mar, ideal para vacaciones en familia.",
              rating: "5.0",
              icon: "🏖️",
              color: "from-blue-500 to-cyan-500",
              features: ["Playa privada", "Spa", "Piscina infinita"]
            },
            {
              name: "Hotel Urbano",
              desc: "Excelente ubicación en el centro de la ciudad, perfecto para negocios.",
              rating: "4.7",
              icon: "🏙️",
              color: "from-indigo-500 to-blue-500",
              features: ["WiFi rápido", "Centro de negocios", "Desayuno incluido"]
            },
            {
              name: "Eco Lodge",
              desc: "Una experiencia única en contacto con la naturaleza.",
              rating: "4.8",
              icon: "🌿",
              color: "from-emerald-500 to-teal-500",
              features: ["Sostenible", "Vistas panorámicas", "Actividades al aire libre"]
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
              <p className="text-gray-600 mb-4">{item.desc}</p>
              
              {/* Características */}
              <div className="mb-5">
                <div className="text-sm text-gray-500 mb-2">Incluye:</div>
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Rating con estilo mejorado */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(parseFloat(item.rating)) ? "text-amber-400" : "text-gray-300"}`}>
                      ★
                    </span>
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
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
              <span className="text-3xl">🏨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tu hogar lejos de casa
            </h2>
            <p className="text-gray-600 mb-6">
              Desde lujosos resorts hasta acogedores eco-lodges, encuentra el lugar perfecto 
              para descansar después de un día de aventuras.
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats específicas para hoteles */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Hoteles disponibles", value: "150+" },
            { label: "Reseñas verificadas", value: "10K+" },
            { label: "Huéspedes satisfechos", value: "95%" },
            { label: "Rating promedio", value: "4.8" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}