// src/Data/api.js
const API_URL = "http://localhost:5000"; // Cambia 5000 por tu puerto

export const obtenerClientes = async () => {
  try {
    const response = await fetch(`${API_URL}/clientes`);
    if (!response.ok) throw new Error("Error al obtener clientes");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
