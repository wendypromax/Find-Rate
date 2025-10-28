import { TipoNegocioService } from "../services/tiponegocioService.js";

export const getTiposNegocio = async (req, res) => {
  try {
    const data = await TipoNegocioService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTipoNegocioById = async (req, res) => {
  try {
    const data = await TipoNegocioService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTipoNegocio = async (req, res) => {
  try {
    const result = await TipoNegocioService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTipoNegocio = async (req, res) => {
  try {
    const result = await TipoNegocioService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTipoNegocio = async (req, res) => {
  try {
    const result = await TipoNegocioService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
