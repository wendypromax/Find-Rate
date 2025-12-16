import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  unlockAccount,
  getLockStatus 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/registro", registerUser);
router.post("/login", loginUser);

// RUTAS DE BLOQUEO
router.put("/:id/unlock", unlockAccount);      // Desbloquear cuenta
router.get("/:id/lock-status", getLockStatus); // Ver estado de bloqueo

// RUTAS CRUD
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;