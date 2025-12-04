import { Link } from "react-router-dom";

export default function Restaurantes() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Restaurantes
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Descubre los mejores restaurantes de la ciudad y disfruta de experiencias
        gastronómicas inolvidables.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {[
          {
            name: "La Pizzería Nonna Italiana",
            desc: "Auténtica pizza artesanal con ingredientes frescos y de calidad.",
            rating: "4.8",
          },
          {
            name: "Sushi House",
            desc: "Delicioso sushi preparado al instante por chefs expertos.",
            rating: "4.6",
          },
          {
            name: "El Asador Grill",
            desc: "Cortes de carne premium con el mejor sabor y ambiente.",
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
