import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../controllers/authController.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Cambiar estado (activo / inactivo)
router.put("/:id", updateUserStatus);

// Eliminar usuario
router.delete("/:id", deleteUser);

export default router;
