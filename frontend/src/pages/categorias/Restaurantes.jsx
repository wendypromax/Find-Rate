import { Link } from "react-router-dom";

export default function Restaurantes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header con gradiente */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Restaurantes
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            Descubre los mejores restaurantes de la ciudad y disfruta de experiencias
            gastronómicas inolvidables.
          </p>
        </div>

        {/* Tarjetas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            {
              name: "La Pizzería Nonna Italiana",
              desc: "Auténtica pizza artesanal con ingredientes frescos y de calidad.",
              rating: "4.8",
              icon: "🍕",
              color: "from-orange-500 to-amber-500",
              type: "Italiana",
              price: "$$"
            },
            {
              name: "Sushi House",
              desc: "Delicioso sushi preparado al instante por chefs expertos.",
              rating: "4.6",
              icon: "🍣",
              color: "from-red-500 to-pink-500",
              type: "Japonesa",
              price: "$$$"
            },
            {
              name: "El Asador Grill",
              desc: "Cortes de carne premium con el mejor sabor y ambiente.",
              rating: "4.9",
              icon: "🥩",
              color: "from-amber-600 to-orange-600",
              type: "Parrilla",
              price: "$$$$"
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
              
              {/* Información principal */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                <span className="text-gray-500 font-medium">{item.price}</span>
              </div>
              
              {/* Tipo de cocina */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">
                  {item.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-5">{item.desc}</p>
              
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
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sabores que enamoran
            </h2>
            <p className="text-gray-600 mb-6">
              Desde la auténtica cocina italiana hasta los sabores más exóticos de oriente, 
              encuentra el restaurante perfecto para cada ocasión.
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats específicas para restaurantes */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Restaurantes", value: "300+" },
            { label: "Tipos de cocina", value: "25+" },
            { label: "Reseñas mensuales", value: "15K+" },
            { label: "Rating promedio", value: "4.6" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leyenda de precios */}
        <div className="mt-8 max-w-md mx-auto text-center">
          <p className="text-gray-500 text-sm mb-2">Leyenda de precios:</p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="text-gray-600">$ = Económico</span>
            <span className="text-gray-600">$$ = Moderado</span>
            <span className="text-gray-600">$$$ = Caro</span>
            <span className="text-gray-600">$$$$ = Muy caro</span>
          </div>
        </div>
      </div>
    </div>
  );
}