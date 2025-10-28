import { TipoRolService } from "../services/tiporolService.js";

export const getTiposRol = async (req, res) => {
  try {
    const data = await TipoRolService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTipoRolById = async (req, res) => {
  try {
    const data = await TipoRolService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTipoRol = async (req, res) => {
  try {
    const result = await TipoRolService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTipoRol = async (req, res) => {
  try {
    const result = await TipoRolService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTipoRol = async (req, res) => {
  try {
    const result = await TipoRolService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
