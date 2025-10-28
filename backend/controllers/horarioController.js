import { HorarioService } from "../services/horarioService.js";

export const getHorarios = async (req, res) => {
  try {
    const data = await HorarioService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHorarioById = async (req, res) => {
  try {
    const data = await HorarioService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHorario = async (req, res) => {
  try {
    const result = await HorarioService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHorario = async (req, res) => {
  try {
    const result = await HorarioService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHorario = async (req, res) => {
  try {
    const result = await HorarioService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
