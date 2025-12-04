import express from "express";
import {
  getDias,
  getDiaById,
  createDia,
  updateDia,
  deleteDia,
} from "../controllers/diasController.js";

const router = express.Router();

router.get("/", getDias);
router.get("/:id", getDiaById);
router.post("/", createDia);
router.put("/:id", updateDia);
router.delete("/:id", deleteDia);

export default router;
