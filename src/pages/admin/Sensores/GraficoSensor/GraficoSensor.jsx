import React from 'react';

//Libreria para gráficas
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registra los componentes necesarios para la grafica
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Datos del grafico
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],  //EN QUE TIEMPOS LO QUEREMOS
    datasets: [
      {
        label: 'Calor',  // Nombre de la linea
        data: [12, 19, 3, 5, 2, 3],  // Datos traidos del sensor
        borderColor: 'rgba(75, 192, 192, 1)',  //Color de la linea
        tension: 0.1,  // Curvatura de linea
      },
      {
        label: 'ph',  
        data: [20, 2, 3, 5, 2, 0.1], 
        borderColor: 'rgb(31, 194, 72)',  
        tension: 0.1,  
      }
    ],
  };

  // Vistas del grafico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de Líneas de Ventas',  // Título del gráfico
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,  // Iniciar el eje X en cero
      },
      y: {
        beginAtZero: true,  // Iniciar el eje Y en cero
      },
    },
  };

  return (
    <div>
      <h2>Gráfico de Línea en React</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
