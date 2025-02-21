import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoSensor = () => {
  // Datos del gráfico
  const data = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"], // Etiquetas de las barras
    datasets: [
      {
        label: "Ventas", // Etiqueta de la serie de datos
        data: [65, 59, 80, 81, 56, 55], // Datos del gráfico
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Color de fondo de las barras
        borderColor: "rgba(75, 192, 192, 1)", // Color del borde de las barras
        borderWidth: 1, // Ancho del borde de las barras
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posición de la leyenda
      },
      title: {
        display: true,
        text: "Gráfico de Ventas", // Título del gráfico
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraficoSensor;
