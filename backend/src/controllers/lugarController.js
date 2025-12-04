import Joi from "joi";
import { LugarModel } from "../models/LugarModel.js";

// 🔹 Esquema de validación con Joi
const lugarSchema = Joi.object({
  nit_lugar: Joi.string().max(20).required(),
  nombre_lugar: Joi.string().max(100).required(),
  localidad_lugar: Joi.string().max(100).required(),
  direccion_lugar: Joi.string().max(200).required(),
  red_social_lugar: Joi.string().max(150).allow(null, ""),
  tipo_entrada_lugar: Joi.string().valid("gratis", "pago").required(),
  id_usuariofk: Joi.number().integer().required(),
});

// 🔹 Insertar nuevo lugar
export const insertarLugar = async (req, res) => {
  try {
    const { error } = lugarSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const result = await LugarModel.insertarLugar(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    console.error("Error al insertar lugar:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🔹 Obtener un lugar por su ID
export const obtenerLugarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const lugar = await LugarModel.obtenerLugarPorId(id);

    if (!lugar) {
      return res
        .status(404)
        .json({ success: false, message: "Lugar no encontrado" });
    }

    res.json({ success: true, lugar });
  } catch (error) {
    console.error("Error al obtener lugar:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Buscar lugares por nombre, localidad o tipo de entrada
export const buscarLugares = async (req, res) => {
  try {
    const { query, tipo_entrada } = req.query;

    // Validar que venga el término de búsqueda
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Debe proporcionar un término de búsqueda" });
    }

    const resultados = await LugarModel.buscarLugares(query, tipo_entrada);

    if (!resultados || resultados.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron lugares" });
    }

    res.json({ success: true, resultados });
  } catch (error) {
    console.error("Error al buscar lugares:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al buscar lugares" });
  }
};