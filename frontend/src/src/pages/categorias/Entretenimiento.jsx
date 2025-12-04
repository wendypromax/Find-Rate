import { Link } from "react-router-dom";

export default function Entretenimiento() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Entretenimiento
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Encuentra diversión para todas las edades: teatros, cines, espectáculos y más.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {[
          {
            name: "Cineplex",
            desc: "Cine moderno con las últimas películas y salas premium.",
            rating: "4.5",
          },
          {
            name: "Teatro Principal",
            desc: "Disfruta de obras de teatro y espectáculos en vivo.",
            rating: "4.7",
          },
          {
            name: "Parque de Diversiones Aventura",
            desc: "Atracciones para toda la familia y mucha diversión.",
            rating: "4.9",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
            <p className="mt-3 text-yellow-500 font-medium">
              ⭐ {item.rating}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="px-6 py-3 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
