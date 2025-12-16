import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Ejemplo de datos: reemplaza con datos reales de tu backend
const data = [
  { nombre_lugar: "Hotel Andino", total_resenas: 12 },
  { nombre_lugar: "Restaurante El Sabor", total_resenas: 8 },
  { nombre_lugar: "Museo de Arte Moderno", total_resenas: 5 },
  { nombre_lugar: "Café Aroma", total_resenas: 3 },
  { nombre_lugar: "Librería Central", total_resenas: 7 },
  { nombre_lugar: "Gimnasio Vital", total_resenas: 4 },
  { nombre_lugar: "Teatro Principal", total_resenas: 6 },
];

const GraficaResenas = () => {
  return (
    <div className="w-full h-[500px] bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        📊 Número de reseñas por lugar
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="nombre_lugar"
            angle={-35}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: 14 }}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Bar
            dataKey="total_resenas"
            name="Reseñas"
            fill="url(#colorResenas)"
            radius={[8, 8, 0, 0]}
          >
            <defs>
              <linearGradient id="colorResenas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaResenas;
