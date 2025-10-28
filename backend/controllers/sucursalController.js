import { SucursalService } from "../services/sucursalService.js";

export const getSucursales = async (req, res) => {
  try {
    const data = await SucursalService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSucursalById = async (req, res) => {
  try {
    const data = await SucursalService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSucursal = async (req, res) => {
  try {
    const result = await SucursalService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSucursal = async (req, res) => {
  try {
    const result = await SucursalService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const result = await SucursalService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
