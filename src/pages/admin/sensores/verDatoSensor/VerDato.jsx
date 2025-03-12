import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import NavBar from '../../../../components/navbar';
import GraficoSensor from '../grafico/Grafico';
import { getSensor, getHistorialSensores } from '../../../../services/sensores/ApiSensores';
import data from "../../../../assets/icons/dataWhite.png";
import horaIcon from "../../../../assets/icons/relojWhite.png";
import fechaIcon from  "../../../../assets/icons/fechaWhite.png";

// Función para formatear la fecha
const formatearFechaYHora = (fecha) => {
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const año = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  const segundos = String(date.getSeconds()).padStart(2, '0');
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
  const [fechaFiltro, setFechaFiltro] = useState('');
  const { id } = useParams();

  useEffect(() => {
    getSensor(id)
      .then(data => {
        setSensores(data);
        setDatosSensores(data.datos || []);
        getHistorialSensores(data.mac)
          .then(historial => {
            const datosGrafico = historial.map(item => {
              const { fecha, hora } = formatearFechaYHora(item.fecha);
              return {
                fecha,
                hora,
                valor: limitarValor(item.valor),
              };
            });
            setDatosSensores(datosGrafico || []);
          })
          .catch(error => console.error("Error al obtener el historial de sensores", error));
      })
      .catch(error => console.error("Error al obtener los datos del sensor", error));
  }, [id]);


  const filtrarDatos = () => {
    return datosSensor.filter(item => {
      const { fecha } = item;

      // Comprobar si se ha establecido un filtro de fecha
      if (fechaFiltro) {
        const [añoFiltro, mesFiltro, diaFiltro] = fechaFiltro.split('-');
        const [diaItem, mesItem, añoItem] = fecha.split('/');

        const coincideDia = diaFiltro ? diaItem === diaFiltro : true;
        const coincideMes = mesFiltro ? mesItem === mesFiltro : true;
        const coincideAño = añoFiltro ? añoItem === añoFiltro : true;

        return coincideDia && coincideMes && coincideAño;
      }

      return true; // Si no hay filtro, devuelve todos los datos
    });
  };

  const datosFinales = filtrarDatos();


  return (
    <div className='bg-white'>
      <NavBar />
      <div className="w-auto pt-10 xl:mx-36 mx-5 lg:mx-16 sm:mx-5 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="p-4">
            <h3 className="text-center mb-2 font-semibold">Filtrar por Fecha</h3>
            <div>
              <input
                type="date"
                value={fechaFiltro}
                onChange={e => setFechaFiltro(e.target.value)}
                className="mb-2 p-2 border rounded"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto max-h-64 p-0 m-0">
          <table className="w-full table-fixed border-separate border-spacing-y-3">
            <thead className="sticky top-0 bg-[#00304D] text-white text-left">
              <tr>
                <th className="p-2 rounded-l-full">#</th>
                <th className="p-2 justify-items-center">
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
                    <img src={data} alt="Icono datos" className="mr-1 mb-1 h-4 w-4" />
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
      <div className='flex flex-row justify-center bg-white'>
        <GraficoSensor datos={datosFinales} />
      </div>
    </div>
  );
}