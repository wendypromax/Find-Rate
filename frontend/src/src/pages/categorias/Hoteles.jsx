import { Link } from "react-router-dom";

export default function Hoteles() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Hoteles
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Encuentra el alojamiento perfecto para tu próxima aventura.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {[
          {
            name: "Resort Playa Paraíso",
            desc: "Lujo y comodidad frente al mar, ideal para vacaciones en familia.",
            rating: "5.0",
          },
          {
            name: "Hotel Urbano",
            desc: "Excelente ubicación en el centro de la ciudad, perfecto para negocios.",
            rating: "4.7",
          },
          {
            name: "Eco Lodge",
            desc: "Una experiencia única en contacto con la naturaleza.",
            rating: "4.8",
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
