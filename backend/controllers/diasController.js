import { DiasService } from "../services/diasService.js";

export const getDias = async (req, res) => {
  try {
    const data = await DiasService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiaById = async (req, res) => {
  try {
    const data = await DiasService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDia = async (req, res) => {
  try {
    const result = await DiasService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDia = async (req, res) => {
  try {
    const result = await DiasService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDia = async (req, res) => {
  try {
    const result = await DiasService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
