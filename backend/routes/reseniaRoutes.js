import express from "express";
import {
  getResenias,
  getReseniaById,
  createResenia,
  updateResenia,
  deleteResenia,
} from "../controllers/reseniaController.js";

const router = express.Router();

router.get("/", getResenias);
router.get("/:id", getReseniaById);
router.post("/", createResenia);
router.put("/:id", updateResenia);
router.delete("/:id", deleteResenia);

export default router;
