import express from "express";
import { reporteResenasPorLugar } from "../controllers/reporteController.js";
import { reporteGeneralResenas } from "../controllers/reporteController.js";
const router = express.Router();

router.get("/resenas-por-lugar", reporteResenasPorLugar);
router.get("/general-resenas", reporteGeneralResenas);
export default router;
