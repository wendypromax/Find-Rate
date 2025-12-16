import express from "express";
import { reporteResenasPorLugar } from "../controllers/reporteController.js";

const router = express.Router();

router.get("/resenas-por-lugar", reporteResenasPorLugar);

export default router;
