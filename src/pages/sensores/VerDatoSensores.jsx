//importaciones necesarios de react
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import * as Icons from '../../assets/icons/IconsExportation'
//componentes reutilizados
import NavBar from '../../components/navbar';
import GraficoSensor from './GraficoSensores';
import MostrarInfo from "../../components/mostrarInfo";
//endpoint para consumir api
import { getSensor, getHistorialSensores } from '../../services/sensores/ApiSensores';

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

      if (fechaFiltro) {
        const [añoFiltro, mesFiltro, diaFiltro] = fechaFiltro.split('-');
        const [diaItem, mesItem, añoItem] = fecha.split('/');
        const coincideDia = diaFiltro ? diaItem === diaFiltro : true;
        const coincideMes = mesFiltro ? mesItem === mesFiltro : true;
        const coincideAño = añoFiltro ? añoItem === añoFiltro : true;
        return coincideDia && coincideMes && coincideAño;
      }
      return true;
    });
  };

  const datosFinales = filtrarDatos();

  const columnas = [
    { key: "#", icon2: Icons.idSensor },
    { key: "fecha", label: "Fecha", icon: Icons.fecha, icon2: Icons.fecha },
    { key: "hora", label: "Hora", icon: Icons.hora, icon2: Icons.hora },
    { key: "valor", label: "Datos", icon: Icons.dato, icon2: Icons.dato }
  ];

  // En lugar de datosTabla con lógica de JSX, devolver los datos simples para que los renderice MostrarInfo
  const datosTabla = datosFinales.map((fila, index) => ({
    "#": index + 1,
    fecha: fila.fecha,
    hora: fila.hora,
    valor: fila.valor + " °C"
  }));

  return (
    <div >
      <NavBar />
      {/* Filtrar datos por fecha */}
      <div className="w-auto pt-2 xl:mx-36 mx-5 lg:mx-16 sm:mx-5">
        <div className="flex justify-between items-center mb-1 px-1">
          <div className="flex-grow text-left">
            <h3 className='text-2xl font-semibold -ml-6'> Datos del sensor: {sensores.nombre}</h3>
          </div>
          <div className='text-right -mr-20'>
            <h3 className="mb-1 font-semibold text-center">Filtrar por fecha</h3>
            <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              className="mb-2 p-2 border rounded-xl"
            />
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-center '>
        <GraficoSensor datos={datosFinales} />
      </div>
      <MostrarInfo
        columnas={columnas}
        mostrarAgregar={false}
        datos={datosTabla} // Pasamos los datos ya procesados para la tabla
      />
      {/* </div> */}
    </div>
  );
}
