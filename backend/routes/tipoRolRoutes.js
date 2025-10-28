import express from "express";
import {
  getTiposRol,
  getTipoRolById,
  createTipoRol,
  updateTipoRol,
  deleteTipoRol,
} from "../controllers/tipoRolController.js";

const router = express.Router();

router.get("/", getTiposRol);
router.get("/:id", getTipoRolById);
router.post("/", createTipoRol);
router.put("/:id", updateTipoRol);
router.delete("/:id", deleteTipoRol);

export default router;
