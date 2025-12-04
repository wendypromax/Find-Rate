// controladores/calificacionController.js
import { CalificacionService } from "../servicios/calificacionService.js";

export const getCalificaciones = async (req, res) => {
  try {
    const data = await CalificacionService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCalificacionById = async (req, res) => {
  try {
    const data = await CalificacionService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCalificacion = async (req, res) => {
  try {
    const result = await CalificacionService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCalificacion = async (req, res) => {
  try {
    const result = await CalificacionService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCalificacion = async (req, res) => {
  try {
    const result = await CalificacionService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import { CalificacionService } from "../services/calificacionService.js";

export const getPromedioPorLugar = async (req, res) => {
  try {
    const data = await CalificacionService.getPromedioPorLugar();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

