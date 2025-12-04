// routes/favoritosRoutes.js
import express from "express";
import {
  getFavoritos,
  getFavoritoById,
  createFavorito,
  updateFavorito,
  deleteFavorito,
  getFavoritosByUsuario,
  verificarFavorito,
  agregarFavorito,
  eliminarFavorito,
} from "../controllers/favoritosController.js";

const router = express.Router();

// === RUTAS GENERALES CRUD ===
router.get("/", getFavoritos);
router.get("/:id", getFavoritoById);
router.post("/", createFavorito);
router.put("/:id", updateFavorito);
router.delete("/:id", deleteFavorito);

// === RUTAS NUEVAS PARA FAVORITOS POR USUARIO ===

// Obtener favoritos de un usuario
router.get("/usuario/:idUsuario", getFavoritosByUsuario);

// Verificar si un lugar es favorito
router.get("/usuario/:idUsuario/lugar/:idLugar", verificarFavorito);

// Agregar a favoritos
router.post("/usuario/:idUsuario/lugar/:idLugar", agregarFavorito);

// Eliminar de favoritos
router.delete("/usuario/:idUsuario/lugar/:idLugar", eliminarFavorito);

export default router;