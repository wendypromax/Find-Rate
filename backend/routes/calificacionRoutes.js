// 📂 routes/calificacionRoutes.js
import express from "express";
import { CalificacionService } from "../services/calificacionService.js";

const router = express.Router();

// ✅ Obtener todas las calificaciones
router.get("/", async (req, res) => {
  try {
    const data = await CalificacionService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener calificaciones", error: error.message });
  }
});

// ✅ Obtener una calificación por ID
router.get("/:id", async (req, res) => {
  try {
    const data = await CalificacionService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Calificación no encontrada" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la calificación", error: error.message });
  }
});

// ✅ Crear nueva calificación
router.post("/", async (req, res) => {
  try {
    const data = await CalificacionService.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la calificación", error: error.message });
  }
});

// ✅ Actualizar calificación
router.put("/:id", async (req, res) => {
  try {
    const data = await CalificacionService.update(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la calificación", error: error.message });
  }
});

// ✅ Eliminar calificación
router.delete("/:id", async (req, res) => {
  try {
    const data = await CalificacionService.delete(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la calificación", error: error.message });
  }
});

// ✅ Promedio por lugar
router.get("/promedio/lugares", async (req, res) => {
  try {
    const data = await CalificacionService.getPromedioPorLugar();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener promedio por lugar", error: error.message });
  }
});

export default router;
