import express from "express";
import {
  getResenias,
  getReseniaById,
  getReseniasByLugar,
  createResenia,
  updateResenia,
  deleteResenia,
} from "../controllers/reseniaController.js";

const router = express.Router();

// Todas las reseñas
router.get("/", getResenias);

// ✅ Reseñas por lugar (poner antes de /:id)
router.get("/lugar/:id_lugar", getReseniasByLugar);

// Reseña por ID
router.get("/:id", getReseniaById);

// CRUD
router.post("/", createResenia);
router.put("/:id", updateResenia);
router.delete("/:id", deleteResenia);

export default router;
