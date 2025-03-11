import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GraficoSensor({ datos }) {
  return (
    <div className="bg-[#EEEEEE] w-full shadow-lg p-5 my-20 mx-20 rounded-xl">
      <h2 className="text-center text-lg font-semibold mb-4">Registro de sensores</h2>
      <ResponsiveContainer width="95%" height={300} className="">
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="valor" stroke="#6B21A8" strokeWidth={2} dot={{ r: 5 }} />
          {/* Si tienes otro dato, por ejemplo pH, descomenta esta línea y agrega la clave adecuada */}
          {/* <Line type="monotone" dataKey="pH" stroke="#15803D" strokeWidth={2} dot={{ r: 5 }} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
