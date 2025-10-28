import express from "express";
import {
  getCalificaciones,
  getCalificacionById,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion,
} from "../controllers/calificacionController.js";

const router = express.Router();

router.get("/", getCalificaciones);
router.get("/:id", getCalificacionById);
router.post("/", createCalificacion);
router.put("/:id", updateCalificacion);
router.delete("/:id", deleteCalificacion);

export default router;
