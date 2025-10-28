import { BitacoraService } from "../services/bitacoraService.js";

export const getBitacoras = async (req, res) => {
  try {
    const data = await BitacoraService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBitacoraById = async (req, res) => {
  try {
    const data = await BitacoraService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBitacora = async (req, res) => {
  try {
    const result = await BitacoraService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBitacora = async (req, res) => {
  try {
    const result = await BitacoraService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBitacora = async (req, res) => {
  try {
    const result = await BitacoraService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
