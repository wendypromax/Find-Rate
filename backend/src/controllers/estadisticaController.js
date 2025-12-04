import { EstadisticaService } from "../services/estadisticaService.js";

export const getEstadisticas = async (req, res) => {
  try {
    const data = await EstadisticaService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEstadisticaById = async (req, res) => {
  try {
    const data = await EstadisticaService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEstadistica = async (req, res) => {
  try {
    const result = await EstadisticaService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEstadistica = async (req, res) => {
  try {
    const result = await EstadisticaService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEstadistica = async (req, res) => {
  try {
    const result = await EstadisticaService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
