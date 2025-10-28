import express from "express";
import { insertarLugar } from "../controllers/lugarController.js";

const router = express.Router();

router.post("/lugares", insertarLugar);

export default router;
