import { FavoritosService } from "../services/favoritosService.js";

export const getFavoritos = async (req, res) => {
  try {
    const data = await FavoritosService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavoritoById = async (req, res) => {
  try {
    const data = await FavoritosService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFavorito = async (req, res) => {
  try {
    const result = await FavoritosService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFavorito = async (req, res) => {
  try {
    const result = await FavoritosService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFavorito = async (req, res) => {
  try {
    const result = await FavoritosService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
