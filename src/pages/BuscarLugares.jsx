import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star } from "lucide-react";

const BuscarLugares = () => {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [promedios, setPromedios] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Cargar lugares y promedios al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1️⃣ Lugares
        const resLugares = await fetch("http://localhost:5000/api/lugares/buscar?query=a");
        const dataLugares = await resLugares.json();
        if (dataLugares.success) {
          setResultados(dataLugares.resultados);
        } else {
          setResultados([]);
        }

        // 2️⃣ Promedios
        const resPromedios = await fetch("http://localhost:5000/api/lugares/promedios");
        const dataPromedios = await resPromedios.json();

        if (dataPromedios.success) {
          const obj = {};
          dataPromedios.promedios.forEach((item) => {
            obj[item.id_lugar] = item.promedio_calificacion;
          });
          setPromedios(obj);
        }
      } catch (error) {
        console.error("Error al cargar lugares y promedios:", error);
        setMensaje("❌ Error al cargar lugares y promedios.");
      }
    };

    cargarDatos();
  }, []);

  // ✅ Búsqueda manual
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query && !tipo) {
      setMensaje("Ingresa un término de búsqueda o tipo de entrada.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/lugares/buscar?query=${encodeURIComponent(query)}&tipo_entrada=${encodeURIComponent(tipo)}`
      );
      const data = await res.json();

      if (data.success && data.resultados.length > 0) {
        setResultados(data.resultados);
        setMensaje("");
      } else {
        setResultados([]);
        setMensaje(data.message || "No se encontraron resultados.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-pink-200 via-pink-100 to-yellow-200">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400">
        Buscar Lugares
      </h2>

      {/* 🔎 Formulario de búsqueda */}
      <form className="flex gap-2 mb-6 w-full max-w-md" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nombre, localidad o dirección"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          placeholder="Tipo de entrada"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="px-4 py-2 border-2 border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-bold rounded-full hover:opacity-90 transition"
        >
          Buscar
        </button>
      </form>

      {/* 🧾 Mensajes */}
      {mensaje && (
        <p className={`mb-4 p-2 rounded ${mensaje.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {mensaje}
        </p>
      )}
      {loading && <p className="mb-4 text-gray-600">Buscando lugares...</p>}

      {/* 📋 Lista de lugares */}
      <ul className="space-y-4 w-full max-w-md">
        {resultados.length > 0 ? (
          resultados.map((lugar) => (
            <li key={lugar.id_lugar} className="border p-4 rounded-2xl shadow hover:shadow-lg bg-white transition">
              <h3 className="font-bold text-lg text-gray-800">{lugar.nombre_lugar}</h3>
              <p className="text-gray-600">Localidad: {lugar.localidad_lugar}</p>
              <p className="text-gray-600">Dirección: {lugar.direccion_lugar}</p>
              <p className="text-gray-600">Tipo: {lugar.tipo_entrada_lugar}</p>
              {lugar.red_social_lugar && <p className="text-gray-600">Red social: {lugar.red_social_lugar}</p>}

              <div className="mt-3 flex items-center gap-2">
                <Link
                  to={`/detalleLugar?id=${lugar.id_lugar}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 
                             text-white font-semibold rounded-full shadow-md hover:opacity-90 hover:scale-105 transition-transform"
                >
                  <MessageSquare size={18} /> Ver reseñas
                </Link>

                {/* ⭐ Mostrar promedio */}
                <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                  <Star size={18} /> {promedios[lugar.id_lugar] ?? "-"}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-6">No se encontraron lugares. 🕵️‍♀️</p>
        )}
      </ul>
    </div>
  );
};

export default BuscarLugares;
