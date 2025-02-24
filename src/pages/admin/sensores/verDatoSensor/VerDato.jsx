import React, { useEffect, useState } from 'react';
import GraficoSensor from '../grafico/Grafico';

export default function VerSensores() {
  // Estado para almacenar los datos de los sensores
  const [datosSensor, setDatosSensores] = useState([]);

  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    setDatosSensores([
      {
        id: 1,
        fecha: "17-03-2006",
        datos: "La temperatura estuvo a 30 grados"
      },
      {
        id: 2,
        fecha: "20-05-2010",
        datos: "La temperatura es de 20 grados"
      }
    ]);
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-center text-3xl font-semibold mb-4">Sensor Techo</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Datos</th>
            </tr>
          </thead>
          <tbody>
            {datosSensor.length > 0 ? (
              datosSensor.map((sensor, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-gray-800">{sensor.fecha}</td>
                  <td className="px-6 py-4 text-gray-800">{sensor.datos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-600">
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <GraficoSensor/>
      </div>
    </div>
  );
}
