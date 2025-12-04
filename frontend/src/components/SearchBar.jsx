// frontend/src/components/SearchBar.jsx
import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = ({
  search,
  setSearch,
  filtroLocalidad,
  setFiltroLocalidad
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3 bg-white shadow-lg rounded-2xl md:rounded-full px-4 py-3 w-full max-w-5xl">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <FaSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-gray-700 bg-transparent w-full"
        />
      </div>
      <select
        value={filtroLocalidad}
        onChange={(e) => setFiltroLocalidad(e.target.value)}
        className="bg-gray-100 rounded-lg px-3 py-2 text-gray-700 outline-none w-full md:w-auto flex items-center gap-2"
      >
        <option value="">Todas las localidades</option>
        <option value="Suba">Suba</option>
        <option value="Teusaquillo">Teusaquillo</option>
        <option value="Usaquén">Usaquén</option>
        <option value="Chapinero">Chapinero</option>
        <option value="Kennedy">Kennedy</option>
        <option value="Engativá">Engativá</option>
      </select>
    </div>
  );
};

export default SearchBar;
