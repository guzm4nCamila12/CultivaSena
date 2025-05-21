import React from "react";
// Importamos componentes de la librería Recharts para construir el gráfico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GraficoSensor({ datos }) {
  // Calculamos el valor mínimo y máximo de los datos de "valor" para ajustar el rango del eje Y
  const minValor = Math.floor(Math.min(...datos.map((item) => item.valor)));  // Redondeamos hacia abajo el valor mínimo
  const maxValor = Math.ceil(Math.max(...datos.map((item) => item.valor)));  // Redondeamos hacia arriba el valor máximo

  return (
    <div className="bg-white w-[92%] shadow-lg my-2 mx-auto rounded-xl ">
      <h2 className="text-center text-xl font-semibold mb-2 mt-2 ">Registro de sensores</h2>
      <div className="overflow-x-auto w-full">
      <div style={{ width: `${datos.length * 50}px`, minWidth: "100%" }}>


      {/* ResponsiveContainer asegura que el gráfico se ajuste bien en diferentes tamaños de pantalla */}
      <ResponsiveContainer width="100%" height={400}>
        {/* LineChart es el componente principal para dibujar un gráfico de líneas */}
        <LineChart data={datos}>
          {/* CartesianGrid agrega una cuadrícula en el fondo del gráfico */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* XAxis es el eje horizontal, que usa la propiedad "fecha" de los datos */}
          <XAxis dataKey="fecha" />

          {/* YAxis es el eje vertical, cuyo dominio (rango) se ajusta dinámicamente en función de los valores calculados */}
          <YAxis domain={[minValor - 1, maxValor + 1]} />

          {/* Tooltip muestra información detallada al pasar el cursor sobre el gráfico */}
          <Tooltip />

          {/* Legend agrega una leyenda para identificar qué línea representa qué dato */}
          <Legend />

          {/* Línea principal del gráfico que muestra el valor de los sensores. Se personaliza con color y tamaño de los puntos */}
          <Line type="monotone" dataKey="valor" stroke="#3CB23C" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
