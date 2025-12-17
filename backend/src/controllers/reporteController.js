import express from "express";
import {
  reporteResenasPorLugar,
  reporteGeneralResenas
} from "../controllers/reporteController.js";

const router = express.Router();

// Reporte por lugar (parametrizado por idLugar)
router.get("/resenas-por-lugar", reporteResenasPorLugar);

// Reporte general con filtros
router.get("/general-resenas", reporteGeneralResenas);

export default router;
