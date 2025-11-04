import express from "express";
import { insertarLugar, obtenerLugarPorId, buscarLugares } from "../controllers/lugarController.js";

const router = express.Router();

// 🚀 Poner la ruta de búsqueda ANTES que la de ID
router.get("/buscar", buscarLugares);
router.get("/:id", obtenerLugarPorId);

router.post("/", insertarLugar);

export default router;
