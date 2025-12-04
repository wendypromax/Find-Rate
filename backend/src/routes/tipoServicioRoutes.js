import express from "express";
import {
  getTiposServicio,
  getTipoServicioById,
  createTipoServicio,
  updateTipoServicio,
  deleteTipoServicio,
} from "../controllers/tipoServicioController.js";

const router = express.Router();

router.get("/", getTiposServicio);
router.get("/:id", getTipoServicioById);
router.post("/", createTipoServicio);
router.put("/:id", updateTipoServicio);
router.delete("/:id", deleteTipoServicio);

export default router;
