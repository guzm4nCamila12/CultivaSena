// src/screens/VerSensores.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import * as Icons from '../../assets/icons/IconsExportation';
import NavBar from '../../components/navbar';
import GraficoSensores from './GraficoSensores';
import MostrarInfo from "../../components/mostrarInfo";
import BotonAtras from '../../components/botonAtras';
import { getSensor, getHistorialSensores } from '../../services/sensores/ApiSensores';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useExportarExcel } from '../../hooks/useReportes';

// Formatea una ISO date string a dd/mm/yyyy y hh:mm:ss
const formatearFechaYHora = (fechaIso) => {
  const date = new Date(fechaIso);
  const pad = n => String(n).padStart(2, '0');
  return {
    fecha: `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`,
    hora: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`,
  };
};

// Limita decimales
const limitarValor = (valor, decimales = 4) =>
  parseFloat(valor).toFixed(decimales);

export default function VerSensores() {
  const { id } = useParams();
  const [sensores, setSensores] = useState({});
  const [rawHistorial, setRawHistorial] = useState([]);      // ← datos crudos
  const [datosSensor, setDatosSensores] = useState([]);      // ← datos formateados para la tabla
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [cargando, SetCargando] = useState(true);
  const [hayDatos, setHayDatos] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const { exportarExcel } = useExportarExcel();


  // Fetch sensor + historial
  useEffect(() => {
    SetCargando(true);
    getSensor(id)
      .then(data => {
        setSensores(data);
        return data.mac;
      })
      .then(mac => getHistorialSensores(mac))
      .then(historial => {
        setRawHistorial(historial || []);
        if (!historial || historial.length === 0) {
          setHayDatos(false);
        }
        // Prepara los últimos 24 registros ordenados
        const ultimos = (historial || [])
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 24);
        const datosGrafico = ultimos.map(item => {
          const { fecha, hora } = formatearFechaYHora(item.fecha);
          return { fecha, hora, valor: limitarValor(item.valor) };
        });
        setDatosSensores(datosGrafico);
      })
      .catch(err => {
        console.error(err);
        setHayDatos(false);
      })
      .finally(() => SetCargando(false));
  }, [id]);

  // Filtrado por fecha para la tabla
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

  // Preparar datos de la tabla
  const datosTabla = datosFinales.map((fila, i) => ({
    "#": i + 1,
    fecha: fila.fecha,
    hora: fila.hora,
    valor: fila.valor + " °C"
  }));
  const itemsPorPagina = 12;
  const totalPaginas = Math.ceil(datosTabla.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const datosPaginados = datosTabla.slice(inicio, inicio + itemsPorPagina);

  // Exportar Excel

  const columnas = [
    { key: "#", icon2: Icons.idSensor },
    { key: "fecha", label: "Fecha", icon: Icons.fecha, icon2: Icons.fecha },
    { key: "hora", label: "Hora", icon: Icons.hora, icon2: Icons.hora },
    { key: "valor", label: "Datos", icon: Icons.dato, icon2: Icons.dato }
  ];

  return (
    <div>
      <NavBar />
      <div className='mb-4'>
        <div className="px-4 mt-2 mb-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex w-auto items-center">
              <BotonAtras />
              <h1 className="sm:text-2xl w-full text-lg font-semibold">
                Datos del sensor: {sensores.nombre || `ID ${id}`}
              </h1>
            </div>
            <div className="flex items-end">
              {/* <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              className="p-2 border rounded-xl mr-2"
            /> */}
              <button
                onClick={() => exportarExcel(datosTabla, `sensor_${sensores.nombre || id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Exportar
              </button>
            </div>
          </div>

          {cargando ? (
            <p className="text-center">Cargando datos…</p>
          ) : !hayDatos ? (
            <p className="text-center text-red-500">No hay datos para este sensor.</p>
          ) : (
            <>
              {/* Gráfico individual */}
              <div className="flex justify-center mb-8">
                <GraficoSensores sensoresData={[{ sensor: sensores, historial: rawHistorial }]} />
              </div>

              {/* Tabla paginada */}
              {totalPaginas > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from({ length: totalPaginas }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPaginaActual(i + 1)}
                      className={`px-3 py-1 mb-8 rounded-full flex items-center justify-center transition-all ${paginaActual === i + 1 ? 'bg-[#00304D] hover:bg-[#002438] text-white' : 'bg-white text-[#00304D] hover:bg-gray'}`}

                    >
                      Página {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <MostrarInfo
          columnas={columnas}
          datos={datosPaginados}
          mostrarAgregar={false}
          mostrarBotonAtras={false}
        />
      </div>
    </div >
  );
}