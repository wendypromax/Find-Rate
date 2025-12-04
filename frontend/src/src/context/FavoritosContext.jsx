// src/context/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritosContext = createContext();

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operacionLoading, setOperacionLoading] = useState(false); // Nuevo estado para operaciones

  // Función para cargar favoritos
  const cargarFavoritos = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      setFavoritos([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Cargando favoritos para usuario:", user.id_usuario);
      const res = await axios.get(
        `http://localhost:5000/api/favoritos/usuario/${user.id_usuario}`
      );
      console.log("Favoritos cargados:", res.data);
      setFavoritos(res.data || []);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setFavoritos([]);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un lugar es favorito
  const esFavorito = (idLugar) => {
    return favoritos.some(fav => fav.id_lugar === idLugar);
  };

  // Alternar favorito
  const toggleFavorito = async (lugar) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      throw new Error("Debes iniciar sesión para agregar favoritos");
    }

    const idLugar = lugar.id_lugar;
    const yaEsFavorito = esFavorito(idLugar);

    setOperacionLoading(true); // Solo para esta operación
    try {
      if (yaEsFavorito) {
        // Eliminar de favoritos
        await axios.delete(
          `http://localhost:5000/api/favoritos/usuario/${user.id_usuario}/lugar/${idLugar}`
        );
        setFavoritos(prev => prev.filter(fav => fav.id_lugar !== idLugar));
      } else {
        // Agregar a favoritos
        await axios.post(
          `http://localhost:5000/api/favoritos/usuario/${user.id_usuario}/lugar/${idLugar}`
        );
        setFavoritos(prev => [...prev, lugar]);
      }
      return !yaEsFavorito;
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      throw error;
    } finally {
      setOperacionLoading(false);
    }
  };

  // Eliminar favorito específico
  const eliminarFavorito = async (idLugar) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setOperacionLoading(true); // Solo para esta operación
    try {
      await axios.delete(
        `http://localhost:5000/api/favoritos/usuario/${user.id_usuario}/lugar/${idLugar}`
      );
      setFavoritos(prev => prev.filter(fav => fav.id_lugar !== idLugar));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      throw error;
    } finally {
      setOperacionLoading(false);
    }
  };

  // Cargar favoritos cuando el componente se monta
  useEffect(() => {
    console.log("FavoritosProvider montado, cargando favoritos...");
    cargarFavoritos();
  }, []);

  const value = {
    favoritos,
    loading,
    operacionLoading, // Exportar el nuevo estado
    esFavorito,
    toggleFavorito,
    eliminarFavorito,
    cargarFavoritos
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};