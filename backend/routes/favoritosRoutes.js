import express from "express";
import {
  getFavoritos,
  getFavoritoById,
  createFavorito,
  updateFavorito,
  deleteFavorito,
} from "../controllers/favoritosController.js";

const router = express.Router();

router.get("/", getFavoritos);
router.get("/:id", getFavoritoById);
router.post("/", createFavorito);
router.put("/:id", updateFavorito);
router.delete("/:id", deleteFavorito);

export default router;
