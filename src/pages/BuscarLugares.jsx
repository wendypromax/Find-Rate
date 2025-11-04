import React, { useState } from "react";

const BuscarLugares = () => {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      setMensaje("Ingresa un término de búsqueda.");
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

      {mensaje && (
        <p className={`mb-4 p-2 rounded ${mensaje.startsWith("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {mensaje}
        </p>
      )}

      {loading && <p className="mb-4 text-gray-600">Buscando lugares...</p>}

      <ul className="space-y-4 w-full max-w-md">
        {resultados.map((lugar) => (
          <li key={lugar.id_lugar} className="border p-4 rounded shadow hover:shadow-md bg-white">
            <h3 className="font-bold text-lg">{lugar.nombre_lugar}</h3>
            <p>Localidad: {lugar.localidad_lugar}</p>
            <p>Dirección: {lugar.direccion_lugar}</p>
            <p>Tipo: {lugar.tipo_entrada_lugar}</p>
            {lugar.red_social_lugar && <p>Red social: {lugar.red_social_lugar}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuscarLugares;
