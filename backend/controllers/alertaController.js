import { AlertaService } from "../services/alertaService.js";

export const getAlertas = async (req, res) => {
  try {
    const data = await AlertaService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlertaById = async (req, res) => {
  try {
    const data = await AlertaService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlerta = async (req, res) => {
  try {
    const result = await AlertaService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAlerta = async (req, res) => {
  try {
    const result = await AlertaService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAlerta = async (req, res) => {
  try {
    const result = await AlertaService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
