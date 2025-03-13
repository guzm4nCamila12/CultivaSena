import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GraficoSensor({ datos }) {
  // Obtener los valores mínimos y máximos de "valor" y redondearlos a enteros
  const minValor = Math.floor(Math.min(...datos.map((item) => item.valor)));
  const maxValor = Math.ceil(Math.max(...datos.map((item) => item.valor)));

  return (
    <div className="bg-[#EEEEEE] w-10/12 shadow-lg p-5 my-20 mx-20 rounded-xl">
      <h2 className="text-center text-lg font-semibold mb-4">Registro de sensores</h2>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          {/* Ajustamos el eje Y para que se ajuste al rango de valores en los datos, usando enteros */}
          <YAxis domain={[minValor - 1, maxValor + 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valor" stroke="#3CB23C" strokeWidth={2} dot={{ r: 5 }} />
          {/* Si tienes otro dato, por ejemplo pH, descomenta esta línea y agrega la clave adecuada */}
          {/* <Line type="monotone" dataKey="pH" stroke="#15803D" strokeWidth={2} dot={{ r: 5 }} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
