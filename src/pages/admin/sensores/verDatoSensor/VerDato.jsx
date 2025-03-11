import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import NavBar from '../../../../components/navbar';
import GraficoSensor from '../grafico/Grafico';
import { getSensor, getHistorialSensores } from '../../../../services/sensores/ApiSensores';
import data from "../../../../assets/icons/dataWhite.png"
import horaIcon from "../../../../assets/icons/relojWhite.png"
import fechaIcon from  "../../../../assets/icons/fechaWhite.png"

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
  const [horaFiltro, setHoraFiltro] = useState(''); // Estado para la hora del filtro
  const { id } = useParams();

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
                fecha,
                hora,
                valor: limitarValor(item.valor), // Limitar el valor a 4 decimales
              };
            });

            setDatosSensores(datosGrafico || []); // Guardamos los datos procesados en el estado
          })
          .catch(error => console.error("Error al obtener el historial de sensores", error));
      })
      .catch(error => console.error("Error al obtener los datos del sensor", error));
  }, [id]);

  // Filtrar los datos por hora
  const filtrarDatos = () => {
    if (horaFiltro) {
      return datosSensor.filter(item => item.hora.includes(horaFiltro));
    }
    return datosSensor;
  };

  const datosFinales = filtrarDatos();

  return (
    <div className='bg-white'>
      <NavBar />

      <div className="w-auto pt-10 xl:mx-36 mx-5 lg:mx-16 sm:mx-5 bg-white">
        <div className="flex justify-between items-center mb-4">
          {/* Filtro de hora */}
          <div className="p-4">
            <h3 className="text-center mb-2 font-semibold">Filtrar por Hora</h3>
            <div>
              <input
                type="time"
                value={horaFiltro}
                onChange={e => setHoraFiltro(e.target.value)}
                className="mb-2 p-2 border rounded"
                placeholder="Filtrar por hora"
              />
              <button
                onClick={filtrarDatos}
                className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-64 p-0 m-0">
          <table className="w-full table-fixed border-separate border-spacing-y-3">
            <thead className="sticky top-0 bg-[#00304D] text-white  text-left">
              <tr>
                <th className="p-2 rounded-l-full">#</th>
                <th className="p-2  justify-items-center">
                  <span className='inline-block align-middle'>
                    <img src={fechaIcon} alt="Icono fecha" className='mr-1 mb-1 h-4 w-4' />
                  </span>
                  Fecha
                </th>
                <th className="p-2 justify-items-center">
                  <span className='inline-block align-middle'>
                    <img src={horaIcon} alt="Icono Hora" className="mr-1 mb-1 h-4 w-4" />
                  </span>
                  Hora
                </th>
                <th className="p-2 rounded-r-full">
                  <span className='inline-block align-middle'>
                    <img src={data} alt="Icono fecha" className="mr-1 mb-1 h-4 w-4" />
                  </span>
                  Datos
                </th>
              </tr>
            </thead>
            <tbody>
              {datosFinales.length > 0 ? (
                datosFinales.map((fila, index) => (
                  <tr key={index} className="bg-[#EEEEEE] hover:bg-[#e4dddd44] text-left">
                    <td className="p-3 rounded-l-full">{index + 1}</td>
                    <td className="p-3">{fila.fecha}</td>
                    <td className="p-3">{fila.hora}</td>
                    <td className="p-3 rounded-r-full">{fila.valor + " °C"}</td>
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
      </div>

      {/* Gráfico */}
      <div className='flex flex-row justify-center bg-white'>
        <GraficoSensor datos={datosFinales} /> {/* Pasamos los datos al gráfico */}
      </div>
    </div>
  );
}
