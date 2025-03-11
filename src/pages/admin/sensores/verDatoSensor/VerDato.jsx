import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import NavBar from '../../../../components/navbar';
import GraficoSensor from '../grafico/Grafico';
import { getSensor, getHistorialSensores } from '../../../../services/sensores/ApiSensores';
import macBlue from "../../../../assets/icons/fincaWhite.png";
import descripcionBlue from "../../../../assets/icons/descripcionBlue.png";

// Función para formatear la fecha
const formatearFechaYHora = (fecha) => {
  const date = new Date(fecha);

  const dia = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
  const mes = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga 2 dígitos
  const año = date.getFullYear();

  const horas = String(date.getHours()).padStart(2, '0'); // Asegura que las horas tengan 2 dígitos
  const minutos = String(date.getMinutes()).padStart(2, '0'); // Asegura que los minutos tengan 2 dígitos
  const segundos = String(date.getSeconds()).padStart(2, '0'); // Asegura que los segundos tengan 2 dígitos

  // Devuelve un objeto con fecha y hora separadas
  return {
    fecha: `${dia}/${mes}/${año}`,
    hora: `${horas}:${minutos}:${segundos}`,
  };
};

// Función para limitar los decimales del valor
const limitarValor = (valor, decimales = 4) => {
  return parseFloat(valor).toFixed(decimales);
};

export default function VerSensores() {
  const [datosSensor, setDatosSensores] = useState([]);
  const [sensores, setSensores] = useState({});
  const { id } = useParams();

  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    getSensor(id)
      .then(data => {
        setSensores(data);
        setDatosSensores(data.datos || []); // Asignamos los datos del sensor si están disponibles
        getHistorialSensores(data.mac)
          .then(historial => {
            console.log("Historial de sensores:", historial);

            // Transformamos los datos para ajustarlos al formato que espera el gráfico
            const datosGrafico = historial.map(item => {
              const { fecha, hora } = formatearFechaYHora(item.fecha); // Usamos la función para separar fecha y hora
              return {
                fecha, // Fecha sin la hora
                hora, // Hora separada
                valor: limitarValor(item.valor), // Limitar el valor a 4 decimales
              };
            });

            setDatosSensores(datosGrafico || []); // Guardamos los datos procesados en el estado
          })
          .catch(error => console.error("Error al obtener el historial de sensores", error));
      })
      .catch(error => console.error("Error al obtener los datos del sensor", error));
  }, [id]);


  const datosFinales = Array.isArray(datosSensor) && datosSensor.length > 0 ? datosSensor : [];

  return (
    <div>
      <NavBar />

      <div className="flex justify-center bg-white">
        <table className="w-11/12 table-auto border-separate border-spacing-y-2 mt-4">
          <thead>
            <tr className="bg-[#00304D] text-white">
              <th className="p-2 text-left rounded-l-full">#</th> {/* Redondeamos la esquina superior izquierda */}
              <th className="p-2 text-left flex" >Fecha</th>
              <th className="p-2 text-left">Hora</th>
              <th className="p-2 text-left rounded-r-full">Datos</th> {/* Redondeamos la esquina superior derecha */}
            </tr>
          </thead>
          <tbody className="overflow-y-auto max-h-64"> {/* Habilita el scroll vertical */}
            {datosFinales.length > 0 ? (
              datosFinales.map((fila, index) => (
                <tr key={index} className="bg-[#EEEEEE] hover:bg-[#e4dddd44]">
                  <td className="p-3 rounded-l-full">{index + 1}</td> {/* Aumentamos el padding para filas más altas */}
                  <td className="p-3">{fila.fecha}</td>
                  <td className="p-3">{fila.hora}</td>
                  <td className="p-3 rounded-r-full">{fila.valor+" °C"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Gráfico */}
      <div className='flex flex-row justify-center bg-white'>
      <GraficoSensor datos={datosFinales} /> {/* Pasamos los datos al gráfico */}
      </div>
    </div>
  );
}
