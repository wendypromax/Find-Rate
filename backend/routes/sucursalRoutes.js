import express from "express";
import {
  getSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "../controllers/sucursalController.js";

const router = express.Router();

router.get("/", getSucursales);
router.get("/:id", getSucursalById);
router.post("/", createSucursal);
router.put("/:id", updateSucursal);
router.delete("/:id", deleteSucursal);

export default router;
