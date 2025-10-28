import { UserModel } from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const result = await UserModel.register(req.body);
    res.status(201).json({ success: true, message: "Usuario registrado correctamente", ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo_usuario, password_usuario } = req.body;
    const user = await UserModel.login(correo_usuario, password_usuario);
    res.json({ success: true, message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
