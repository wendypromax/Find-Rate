import { useEffect, useState } from "react";
import axios from "axios";

const ReporteGeneralResenas = () => {
  const [datos, setDatos] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");

  const cargarReporte = async () => {
    const params = new URLSearchParams();

    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    if (estado) params.append("estado", estado);

    const res = await axios.get(
      `http://localhost:5003/api/reportes/general-resenas?${params}`
    );

    setDatos(res.data);
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Reporte General de Reseñas</h2>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input type="date" onChange={(e) => setFechaInicio(e.target.value)} />
        <input type="date" onChange={(e) => setFechaFin(e.target.value)} />

        <select onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <button onClick={cargarReporte}>🔍 Generar</button>
      </div>

      {/* KPIs */}
      {datos && (
        <div style={{ display: "flex", gap: 20 }}>
          <div>🧾 Total: <strong>{datos.total_resenas}</strong></div>
          <div>⭐ Promedio: <strong>{Number(datos.promedio_calificacion).toFixed(1)}</strong></div>
          <div>🟢 Activas: {datos.activas}</div>
          <div>🟡 Pendientes: {datos.pendientes}</div>
          <div>🔴 Canceladas: {datos.canceladas}</div>
        </div>
      )}
    </div>
  );
};

export default ReporteGeneralResenas;
