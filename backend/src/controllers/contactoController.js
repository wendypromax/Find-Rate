import { ContactoService } from "../services/contactoService.js";

export const getContactos = async (req, res) => {
  try {
    const data = await ContactoService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactoById = async (req, res) => {
  try {
    const data = await ContactoService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContacto = async (req, res) => {
  try {
    const result = await ContactoService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContacto = async (req, res) => {
  try {
    const result = await ContactoService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContacto = async (req, res) => {
  try {
    const result = await ContactoService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
