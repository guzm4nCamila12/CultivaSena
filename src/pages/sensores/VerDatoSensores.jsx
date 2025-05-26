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
//menu scroll
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

// Función para formatear la fecha
const formatearFechaYHora = (fecha) => {
  const date = new Date(fecha);
  const dia = String(date.getUTCDate()).padStart(2, '0');
  const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
  const año = date.getUTCFullYear();
  const horas = String(date.getUTCHours()).padStart(2, '0');
  const minutos = String(date.getUTCMinutes()).padStart(2, '0');
  const segundos = String(date.getUTCSeconds()).padStart(2, '0');
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
  const [cargando, SetCargando] = useState(true);
  const [hayDatos, setHayDatos] = useState(true);

  useEffect(() => {
    SetCargando(true)

    getSensor(id)
      .then(data => {
        console.log("Datos del sensor:", data);
        setSensores(data);
        setDatosSensores(data.datos || []);
        console.log("datos mac:", data.mac);
        getHistorialSensores(data.mac)
          .then(historial => {
            console.log("Historial completo:", historial);

            if (!historial || historial.length === 0) {
              setHayDatos(false);
            }

            const ahora = new Date(); // Fecha actual
            const hace12Horas = new Date(ahora.getTime() - (10 * 60 * 1000)); // 12 horas antes
            console.log("hora actual:", hace12Horas);

            const historialFiltrado = historial
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar del más reciente al más antiguo
              .slice(0, 10); // Tomar los 10 más recientes

            console.log("Historial filtrado (últimos 5 min):", historialFiltrado);


            const datosGrafico = historialFiltrado.map(item => {
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
      }).finally(() => {
        SetCargando(false)
      })
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
      {cargando ? (
        <div className="flex justify-center items-center">
          <p>Cargando datos...</p>
        </div>
      ) : hayDatos ? (
        <div>
          <div className='flex flex-row justify-center'>

            <GraficoSensor datos={datosFinales} />
          </div>

          <MostrarInfo
            columnas={columnas}
            mostrarAgregar={false}
            datos={datosTabla} // Pasamos los datos ya procesados para la tabla
          />
        </div>
      ) : (
        <div className='flex flex-row justify-center '><p className='m-0'>no hay datos</p></div>
      )}

    </div>
  );
}
