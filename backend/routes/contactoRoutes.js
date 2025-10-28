    import express from "express";
import {
  getContactos,
  getContactoById,
  createContacto,
  updateContacto,
  deleteContacto,
} from "../controllers/contactoController.js";

const router = express.Router();

router.get("/", getContactos);
router.get("/:id", getContactoById);
router.post("/", createContacto);
router.put("/:id", updateContacto);
router.delete("/:id", deleteContacto);

export default router;
