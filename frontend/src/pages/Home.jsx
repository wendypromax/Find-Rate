import { useState } from "react";
import { Search, Star, MapPin, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const lugares = [
    { id: 1, nombre: "Restaurante La Casona", categoria: "Restaurantes" },
    { id: 2, nombre: "Hotel Playa Blanca", categoria: "Hoteles" },
    { id: 3, nombre: "Teatro Nacional", categoria: "Entretenimiento" },
    { id: 4, nombre: "Museo de Arte Moderno", categoria: "Atracciones" },
  ];

  const resultadosFiltrados = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorias = [
    {
      icon: "🍽️",
      title: "Restaurantes",
      desc: "Descubre experiencias gastronómicas increíbles",
      path: "/restaurantes",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: "🏨",
      title: "Hoteles",
      desc: "Encuentra alojamientos perfectos para ti",
      path: "/hoteles",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: "🎭",
      title: "Entretenimiento",
      desc: "Teatros, cines y espectáculos",
      path: "/entretenimiento",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: "🏛️",
      title: "Atracciones",
      desc: "Lugares turísticos imprescindibles",
      path: "/atracciones",
      color: "from-emerald-500 to-teal-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/80"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
            Descubre Lugares<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Extraordinarios
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
            Explora, reseña y comparte los mejores lugares de tu ciudad. 
            Encuentra recomendaciones auténticas de usuarios reales.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="flex items-center bg-white rounded-full shadow-lg px-6 py-4 border border-gray-300 hover:shadow-xl transition duration-300">
              <Search className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar lugares, restaurantes, hoteles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-4 w-full bg-transparent outline-none text-gray-800 placeholder-gray-600 text-lg font-sans"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="absolute top-20 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-300 z-50 max-h-96 overflow-y-auto">
                {resultadosFiltrados.length > 0 ? (
                  resultadosFiltrados.map((resultado) => (
                    <button
                      key={resultado.id}
                      onClick={() => {
                        navigate(`/${resultado.categoria.toLowerCase()}`);
                        setSearchTerm("");
                      }}
                      className="w-full px-6 py-4 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 text-left transition duration-200 font-sans"
                    >
                      <MapPin className="inline-block w-5 h-5 text-indigo-600 mr-3" />
                      <span className="font-semibold text-gray-900">{resultado.nombre}</span>
                      <p className="text-sm text-gray-600 mt-1">{resultado.categoria}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-6 py-4 text-gray-600 font-sans">No se encontraron resultados</p>
                )}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:-translate-y-1 font-sans shadow-md"
            >
              Comienza Ahora
            </Link>
            <Link
              to="/conocenos"
              className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition duration-300 font-sans shadow-sm"
            >
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-4 font-sans">
            Explora Por Categoría
          </h3>
          <p className="text-center text-gray-700 mb-16 text-lg font-sans">
            Descubre los mejores lugares en cada categoría
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.path}
                className="group"
              >
                <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-8 h-full text-white shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 cursor-pointer font-sans`}>
                  <div className="text-5xl mb-4">{cat.icon}</div>
                  <h4 className="text-2xl font-bold mb-2">{cat.title}</h4>
                  <p className="text-white/95">{cat.desc}</p>
                  <div className="mt-6 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-sm font-semibold">Explorar</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-16 font-sans">
            ¿Por Qué Elegir Find&Rate?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-12 h-12 text-amber-500" />,
                title: "Reseñas Auténticas",
                desc: "Descubre opiniones honestas de usuarios reales sobre lugares increíbles"
              },
              {
                icon: <Heart className="w-12 h-12 text-rose-500" />,
                title: "Guarda tus Favoritos",
                desc: "Crea tu lista personal de lugares favoritos para visitarlos después"
              },
              {
                icon: <MessageCircle className="w-12 h-12 text-indigo-500" />,
                title: "Comparte tu Experiencia",
                desc: "Ayuda a otros usuarios compartiendo tus opiniones y calificaciones"
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 text-center font-sans border border-gray-200"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center font-sans">
            {[
              { number: "10K+", label: "Lugares Listados" },
              { number: "50K+", label: "Reseñas" },
              { number: "15K+", label: "Usuarios Activos" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-lg text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6 font-sans">
            ¿Listo para comenzar?
          </h3>
          <p className="text-xl text-gray-700 mb-8 font-sans">
            Únete a miles de usuarios que ya están descubriendo y compartiendo lugares increíbles
          </p>
          <Link
            to="/registro"
            className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 transform hover:-translate-y-1 font-sans shadow-md"
          >
            Crear Cuenta Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 md:px-8 font-sans">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">© 2024 Find&Rate. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <Link to="/privacidad" className="hover:text-white transition hover:font-medium">Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition hover:font-medium">Términos</Link>
            <Link to="/conocenos" className="hover:text-white transition hover:font-medium">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}