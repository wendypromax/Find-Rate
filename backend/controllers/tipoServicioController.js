import { TipoServicioService } from "../services/tiposervicioService.js";

export const getTiposServicio = async (req, res) => {
  try {
    const data = await TipoServicioService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTipoServicioById = async (req, res) => {
  try {
    const data = await TipoServicioService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTipoServicio = async (req, res) => {
  try {
    const result = await TipoServicioService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTipoServicio = async (req, res) => {
  try {
    const result = await TipoServicioService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTipoServicio = async (req, res) => {
  try {
    const result = await TipoServicioService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
