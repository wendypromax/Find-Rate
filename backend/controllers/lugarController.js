import { LugarModel } from "../models/LugarModel.js";

export const insertarLugar = async (req, res) => {
  try {
    const result = await LugarModel.insertarLugar(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
