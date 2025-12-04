import { useState } from "react";
import { Search, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Estado para la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Datos simulados para la búsqueda
  const lugares = [
    { id: 1, nombre: "Restaurante La Casona", categoria: "Restaurantes" },
    { id: 2, nombre: "Hotel Playa Blanca", categoria: "Hoteles" },
    { id: 3, nombre: "Teatro Nacional", categoria: "Entretenimiento" },
    { id: 4, nombre: "Museo de Arte Moderno", categoria: "Atracciones" },
  ];

  // Filtrar lugares según búsqueda
  const resultadosFiltrados = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200 flex flex-col">
      {/* Hero */}
      <section className="text-center py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Descubre Lugares Increíbles
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Explora, reseña y comparte los mejores lugares de tu ciudad y del mundo entero
        </p>

        {/* Barra de búsqueda */}
        <div className="mt-6 flex justify-center relative">
          <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar restaurantes, hoteles, atracciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-full bg-transparent outline-none text-gray-600"
            />
          </div>

          {/* Resultados */}
          {searchTerm && (
            <div className="absolute top-14 w-96 bg-white rounded-lg shadow-lg border border-gray-200 text-left z-50">
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map((resultado) => (
                  <div
                    key={resultado.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/${resultado.categoria.toLowerCase()}`);
                      setSearchTerm("");
                    }}
                  >
                    <span className="font-medium">{resultado.nombre}</span>
                    <p className="text-sm text-gray-500">{resultado.categoria}</p>
                  </div>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500 text-sm">
                  No se encontraron resultados
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 bg-purple-200">
        <h3 className="text-2xl font-bold text-center mb-10">
          Explorar Por Categoría
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              icon: "🍽️",
              title: "Restaurantes",
              desc: "Descubre los mejores lugares y experiencias gastronómicas de la ciudad",
              path: "/restaurantes",
            },
            {
              icon: "🏨",
              title: "Hoteles",
              desc: "Encuentra el alojamiento perfecto para tu próxima aventura",
              path: "/hoteles",
            },
            {
              icon: "🎭",
              title: "Entretenimiento",
              desc: "Teatros, cines, espectáculos y diversión para todos los gustos",
              path: "/entretenimiento",
            },
            {
              icon: "🏛️",
              title: "Atracciones",
              desc: "Monumentos, museos y sitios de interés histórico y cultural",
              path: "/atracciones",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              to={cat.path}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition block"
            >
              <div className="text-4xl">{cat.icon}</div>
              <h4 className="mt-4 font-semibold text-lg">{cat.title}</h4>
              <p className="text-gray-600 mt-2 text-sm">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Reseñas destacadas */}
      <section className="py-12 bg-blue-50">
        <h3 className="text-2xl font-bold text-center mb-8">
          Reseñas Destacadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
          {/* Reseña 1 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-lg">
              Playa del Carmen - Resort Maya
            </h4>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                5.0 (234 reseñas)
              </span>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              Una experiencia paradisíaca con aguas cristalinas, servicio
              excepcional y amenidades de lujo que superaron todas mis
              expectativas...
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Por Ana García • Hace 2 días
            </p>
          </div>

          {/* Reseña 2 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-lg">Pizzería Nonna Italiana</h4>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                4.2 (156 reseñas)
              </span>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              Auténtica cocina italiana en el corazón de la ciudad. La pizza
              margherita es simplemente perfecta, masa crujiente y frescos
              ingredientes...
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Por Carlos Ruiz • Hace 1 semana
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 text-center bg-pink-100 flex-grow">
        <h3 className="text-2xl font-bold text-gray-800">
          ¿Listo para compartir tu experiencia?
        </h3>
        <p className="text-gray-600 mt-2">
          Únete a nuestra comunidad y ayuda a otros a descubrir lugares increíbles
        </p>
        <button
          onClick={() => navigate("/escribir-resena")}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 
                     text-white font-bold rounded-full shadow-lg hover:scale-105 transform 
                     transition duration-300"
        >
          Escribir Mi Primera Reseña
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 text-center border-t border-gray-200 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Tu Plataforma de Reseñas</p>
        <div className="flex justify-center gap-6 mt-2">
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
}
