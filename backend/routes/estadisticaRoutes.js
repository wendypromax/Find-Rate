import express from "express";
import {
  getEstadisticas,
  getEstadisticaById,
  createEstadistica,
  updateEstadistica,
  deleteEstadistica,
} from "../controllers/estadisticaController.js";

const router = express.Router();

router.get("/", getEstadisticas);
router.get("/:id", getEstadisticaById);
router.post("/", createEstadistica);
router.put("/:id", updateEstadistica);
router.delete("/:id", deleteEstadistica);

export default router;
