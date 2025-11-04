import { LugarModel } from "../models/LugarModel.js";

// 🔹 Insertar nuevo lugar
export const insertarLugar = async (req, res) => {
  try {
    const result = await LugarModel.insertarLugar(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🔹 Obtener un lugar por su ID
export const obtenerLugarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const lugar = await LugarModel.obtenerLugarPorId(id);

    if (!lugar) {
      return res.status(404).json({ success: false, message: "Lugar no encontrado" });
    }

    res.json({ success: true, lugar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Buscar lugares por nombre, localidad o tipo de entrada
export const buscarLugares = async (req, res) => {
  try {
    const { query, tipo_entrada } = req.query;

    // Validar que venga el query
    if (!query) {
      return res.status(400).json({ success: false, message: "Debe proporcionar un término de búsqueda" });
    }

    const resultados = await LugarModel.buscarLugares(query, tipo_entrada);

    if (!resultados || resultados.length === 0) {
      return res.status(404).json({ success: false, message: "No se encontraron lugares" });
    }

    res.json({ success: true, resultados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al buscar lugares" });
  }
};
