import express from "express";
import {
  getBitacoras,
  getBitacoraById,
  createBitacora,
  updateBitacora,
  deleteBitacora,
} from "../controllers/bitacoraController.js";

const router = express.Router();

router.get("/", getBitacoras);
router.get("/:id", getBitacoraById);
router.post("/", createBitacora);
router.put("/:id", updateBitacora);
router.delete("/:id", deleteBitacora);

export default router;
