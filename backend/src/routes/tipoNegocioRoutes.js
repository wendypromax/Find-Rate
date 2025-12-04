import express from "express";
import {
  getTiposNegocio,
  getTipoNegocioById,
  createTipoNegocio,
  updateTipoNegocio,
  deleteTipoNegocio,
} from "../controllers/tipoNegocioController.js";

const router = express.Router();

router.get("/", getTiposNegocio);
router.get("/:id", getTipoNegocioById);
router.post("/", createTipoNegocio);
router.put("/:id", updateTipoNegocio);
router.delete("/:id", deleteTipoNegocio);

export default router;
