// backend/routes/reseniaRoutes.js
import express from "express";
import {
  getResenias,
  getReseniaById,
  getReseniasByLugar,
  getReseniasByUsuario,
  createResenia,
  updateResenia,
  deleteResenia,
  verificarPropietarioResenia
} from "../controllers/reseniaController.js";

const router = express.Router();

// Todas las reseñas
router.get("/", getResenias);

// Reseñas por lugar
router.get("/lugar/:id_lugar", getReseniasByLugar);

// Reseñas por usuario
router.get("/usuario/:id_usuario", getReseniasByUsuario);

// Verificar propietario de reseña
router.post("/verificar-propietario/:id_resenia", verificarPropietarioResenia);

// Reseña por ID
router.get("/:id", getReseniaById);

// CRUD
router.post("/", createResenia);
router.put("/:id", updateResenia);
router.delete("/:id", deleteResenia);

export default router;