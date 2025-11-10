// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Si no está logueado → redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no es admin → redirigir al inicio
  if (user.id_tipo_rolfk !== 3) {
    return <Navigate to="/" replace />;
  }

  // Si es admin → mostrar la página protegida
  return children;
}
