// GraficoSensores.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Paleta de colores predeterminada para las líneas
const DEFAULT_COLORS = ["#3CB23C", "#FF5733", "#3375FF", "#FFC300", "#8E44AD"];

/**
 * Toma una fecha en formato ISO y devuelve un string "DD/MM/YYYY H:mm"
 * (sin ceros a la izquierda en hora, pero sí en día, mes y minuto).
 */
function formatFecha(isoString) {
  const date = new Date(isoString); // se convierte a hora local
  const dd = String(date.getDate()).padStart(2, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const H = date.getHours(); // sin padStart para no forzar dos dígitos
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${MM}/${yyyy} ${H}:${mm}`;
}

export default function GraficoSensores({ sensoresData = [] }) {
  console.log("SensoresData en GraficoSensores:", sensoresData);

  if (!Array.isArray(sensoresData) || sensoresData.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        <p className="text-center text-gray-700">
          Selecciona al menos un sensor para ver el gráfico.
        </p>
      </div>
    );
  }

  // Recoger todas las fechas únicas (ISO) y ordenarlas
  const allFechasISO = Array.from(
    new Set(
      sensoresData.flatMap(({ historial }) =>
        Array.isArray(historial) ? historial.map(item => item.fecha) : []
      )
    )
  ).sort();

  // Mantener último valor conocido para cada sensor para dibujar líneas continuas
  const lastValues = {};
  sensoresData.forEach(({ sensor }) => {
    const key = sensor.nombre || `Sensor-${sensor.id}`;
    lastValues[key] = 0;
  });

  // Construir mergedData con fechas ya formateadas
  const mergedData = allFechasISO.map(fechaISO => {
    const point = {
      fecha: formatFecha(fechaISO)
    };
    sensoresData.forEach(({ sensor, historial }) => {
      const key = sensor.nombre || `Sensor-${sensor.id}`;
      let valor = null;
      if (Array.isArray(historial)) {
        const registro = historial.find(item => item.fecha === fechaISO);
        if (registro && !isNaN(Number(registro.valor))) {
          valor = Number(registro.valor);
          lastValues[key] = valor;
        } else {
          valor = lastValues[key];
        }
      } else {
        valor = lastValues[key];
      }
      point[key] = valor;
    });
    return point;
  });

  // Recolectar todos los valores numéricos para dominio Y
  const valores = mergedData
    .flatMap(d => Object.values(d))
    .filter(v => typeof v === "number");

  const minValor = valores.length > 0 ? Math.floor(Math.min(...valores)) : 0;
  const maxValor = valores.length > 0 ? Math.ceil(Math.max(...valores)) : 0;

  return (
    <div className="bg-white w-full shadow-lg my-2 mx-auto rounded-xl">
      <h2 className="text-center text-xl font-semibold mb-2 mt-2">
        Registro de sensores
      </h2>
      <div className="overflow-x-auto w-full">
        <div style={{ width: `${mergedData.length * 50}px`, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[minValor - 1, maxValor + 1]} />
              <Tooltip />
              <Legend />
              {sensoresData.map((s, idx) => {
                const key = s.sensor.nombre || `Sensor-${s.sensor.id}`;
                const color = DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
