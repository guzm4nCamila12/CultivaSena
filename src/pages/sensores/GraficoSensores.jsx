// GraficoSensores.jsx
import PropTypes from "prop-types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Paleta de colores predeterminada para las líneas
const DEFAULT_COLORS = ["#3CB23C", "#FF5733", "#3375FF", "#FFC300", "#8E44AD"];

/**
 * Toma una fecha en formato ISO y devuelve un string "DD/MM/YYYY H:mm"
 * (en formato UTC).
 */
function formatFecha(isoString) {
  const date = new Date(isoString); // fecha en formato ISO
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  const H = date.getUTCHours(); // obtener hora en UTC
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${dd}/${MM}/${yyyy} ${H}:${mm}`;
}

export default function GraficoSensores({ sensoresData = [] }) {
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
  ).sort((a, b) => new Date(a) - new Date(b));

  // Mantener último valor conocido para cada sensor para dibujar líneas continuas
  const lastValues = {};
  for (const { sensor } of sensoresData) {
    const key = sensor.nombre || `Sensor-${sensor.id}`;
    lastValues[key] = 0;
  }


  // Construir mergedData con fechas formateadas en UTC
  const mergedData = allFechasISO.map(fechaISO => {
    const point = {
      fecha: formatFecha(fechaISO)
    };
    for (const { sensor, historial } of sensoresData) {
      const key = sensor.nombre || `Sensor-${sensor.id}`;
      let valor = null;

      if (Array.isArray(historial)) {
        const registro = historial.find(item => item.fecha === fechaISO);
        if (registro && !Number.isNaN(Number(registro.valor))) {
          valor = Number(registro.valor);
          lastValues[key] = valor;
        } else {
          valor = lastValues[key];
        }
      } else {
        valor = lastValues[key];
      }
      point[key] = valor;
    }
    return point;
  });

  // Recolectar todos los valores numéricos para dominio Y
  const valores = mergedData
    .flatMap(d => Object.values(d))
    .filter(v => typeof v === "number");

  const minValor = valores.length > 0 ? Math.floor(Math.min(...valores)) : 0;
  const maxValor = valores.length > 0 ? Math.ceil(Math.max(...valores)) : 0;

  return (
    <div className="bg-white w-full shadow-lg my-2 rounded-xl">
      <h2 className="text-center text-lg sm:text-xl font-bold mb-2 mt-2">
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

GraficoSensores.propTypes = {
  sensoresData: PropTypes.array
};