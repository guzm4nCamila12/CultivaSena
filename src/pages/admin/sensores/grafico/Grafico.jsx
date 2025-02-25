import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { mes: "Enero", Calor: 24, pH: 14 },
  { mes: "Febrero", Calor: 2, pH: 22 },
  { mes: "Marzo", Calor: 0, pH: 2 },
  { mes: "Abril", Calor: 12, pH: 12 },
  { mes: "Mayo", Calor: 14, pH: 14 },
  { mes: "Junio", Calor: 8, pH: 10 },
  { mes: "Julio", Calor: 6, pH: 4 },
];

export default function GraficoSensor() {
  return (
    <div className="bg-white shadow-lg p-4 rounded-xl">
      <h2 className="text-center text-lg font-semibold mb-4">Registro de sensores</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Calor" stroke="#6B21A8" strokeWidth={2} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="pH" stroke="#15803D" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
