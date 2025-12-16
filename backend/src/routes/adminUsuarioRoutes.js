import express from "express";
import {
  obtenerUsuarios,
  cambiarEstadoUsuario,
  cambiarRolUsuario,
  eliminarUsuario
} from "../controllers/adminUsuarioController.js";

const router = express.Router();

router.get("/", obtenerUsuarios);
router.put("/:id/estado", cambiarEstadoUsuario);
router.put("/:id/rol", cambiarRolUsuario);
router.delete("/:id", eliminarUsuario);

export default router;
