import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import GraficoSensor from '../GraficoSensor/GraficoSensor';

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
    <div>
      <div className="container mt-4">
        <h1 className="text-center">Sensor Techo</h1>
        
        <table className="table table-bordered mt-3">
          <thead className="bg-dark text-light text-center">
            <tr>
              <th>Fecha</th>
              <th>Datos</th>
            </tr>
          </thead>
          <tbody>
            {datosSensor.length > 0 ? (
              datosSensor.map((sensor, index) => (
                <tr key={index}>
                  <td className='fs-4'>{sensor.fecha}</td>
                  <td className='fs-4'>{sensor.datos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <GraficoSensor />
      </div>
    </div>
  );
}
