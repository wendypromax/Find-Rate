import { useParams, Link } from "react-router-dom";
import { lugares } from "../Data/lugares";

export default function Categoria() {
  const { categoria } = useParams();

  // Filtrar lugares por categoría
  const lugaresFiltrados = lugares.filter(
    (lugar) => lugar.categoria === categoria
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 capitalize">
        Lugares de {categoria}
      </h2>

      {lugaresFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {lugaresFiltrados.map((lugar) => (
            <div
              key={lugar.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 overflow-hidden"
            >
              <img
                src={lugar.imagen}
                alt={lugar.nombre}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {lugar.nombre}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{lugar.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No hay lugares disponibles en esta categoría.
        </p>
      )}

      <div className="text-center mt-10">
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:scale-105 transform transition"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
