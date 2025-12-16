import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ReporteResenas = () => {
  const [reporte, setReporte] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [idLugar, setIdLugar] = useState("");

  // 🔹 cargar lugares
  const cargarLugares = async () => {
    const res = await axios.get("http://localhost:5003/api/lugares");
    const lista = Array.isArray(res.data) ? res.data : res.data.data;
    setLugares(lista || []);
  };

  // 🔹 cargar reporte
  const cargarReporte = async () => {
    const url = idLugar
      ? `http://localhost:5003/api/reportes/resenas-por-lugar?idLugar=${idLugar}`
      : "http://localhost:5003/api/reportes/resenas-por-lugar";

    const res = await axios.get(url);
    setReporte(res.data);
  };

  useEffect(() => {
    cargarLugares();
    cargarReporte();
  }, []);

  /* 📊 KPIs */
  const totalLugares = reporte.length;
  const totalResenas = reporte.reduce(
    (acc, item) => acc + Number(item.total_resenas),
    0
  );
  const sinResenas = reporte.filter(
    (item) => Number(item.total_resenas) === 0
  ).length;

  /* 📄 EXPORTAR PDF */
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Reseñas por Lugar", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Lugar", "Número de reseñas"]],
      body: reporte.map((r) => [
        r.nombre_lugar,
        r.total_resenas
      ])
    });

    doc.save("reporte_resenas.pdf");
  };

  /* 📊 EXPORTAR EXCEL */
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reporte.map((r) => ({
        Lugar: r.nombre_lugar,
        Reseñas: r.total_resenas
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reporte"
    );

    XLSX.writeFile(workbook, "reporte_resenas.xlsx");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "24px" }}
    >
      <h2 style={titleStyle}>📊 Reporte de Reseñas por Lugar</h2>

      {/* 🔢 CONTADORES */}
      <div style={kpiGrid}>
        <KPI title="Lugares" value={totalLugares} />
        <KPI title="Total Reseñas" value={totalResenas} />
        <KPI title="Sin Reseñas" value={sinResenas} />
      </div>

      {/* 🔎 FILTROS */}
      <div style={filterBox}>
        <select
          value={idLugar}
          onChange={(e) => setIdLugar(e.target.value)}
          style={selectStyle}
        >
          <option value="">Todos los lugares</option>
          {lugares.map((lugar) => (
            <option key={lugar.id_lugar} value={lugar.id_lugar}>
              {lugar.nombre_lugar}
            </option>
          ))}
        </select>

        <button onClick={cargarReporte} style={btnPrimary}>
          🔍 Generar
        </button>

        <button onClick={exportarPDF} style={btnSecondary}>
          📄 PDF
        </button>

        <button onClick={exportarExcel} style={btnSecondary}>
          📊 Excel
        </button>
      </div>

      {/* 📊 TABLA + GRÁFICA */}
      <div style={gridLayout}>
        {/* TABLA */}
        <motion.div whileHover={{ scale: 1.01 }} style={cardStyle}>
          <h3>📋 Detalle</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Lugar</th>
                <th>Reseñas</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((r) => (
                <tr key={r.id_lugar}>
                  <td>{r.nombre_lugar}</td>
                  <td>
                    <span style={badgeStyle}>{r.total_resenas}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* GRÁFICA */}
        <motion.div whileHover={{ scale: 1.01 }} style={cardStyle}>
          <h3>📊 Gráfica</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reporte}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre_lugar" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="total_resenas"
                fill="#6c4ccf"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* 🔢 KPI */
const KPI = ({ title, value }) => (
  <motion.div whileHover={{ scale: 1.05 }} style={kpiCard}>
    <h4>{title}</h4>
    <span style={kpiValue}>{value}</span>
  </motion.div>
);

/* 🎨 ESTILOS */
const titleStyle = { marginBottom: "16px" };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
  marginBottom: "20px"
};

const kpiCard = {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
};

const kpiValue = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#6c4ccf"
};

const filterBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const selectStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btnPrimary = {
  padding: "8px 14px",
  background: "#6c4ccf",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "8px 14px",
  background: "#ece7ff",
  color: "#6c4ccf",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const gridLayout = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "20px"
};

const cardStyle = {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const badgeStyle = {
  background: "#ece7ff",
  color: "#6c4ccf",
  padding: "4px 10px",
  borderRadius: "12px",
  fontWeight: "bold"
};

export default ReporteResenas;
