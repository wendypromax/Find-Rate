import { ReseniaService } from "../services/reseniaService.js";

export const getResenias = async (req, res) => {
  try {
    const data = await ReseniaService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReseniaById = async (req, res) => {
  try {
    const data = await ReseniaService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResenia = async (req, res) => {
  try {
    const result = await ReseniaService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResenia = async (req, res) => {
  try {
    const result = await ReseniaService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResenia = async (req, res) => {
  try {
    const result = await ReseniaService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
