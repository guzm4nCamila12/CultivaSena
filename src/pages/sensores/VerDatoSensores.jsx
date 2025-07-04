// src/screens/VerSensores.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import * as Icons from '../../assets/icons/IconsExportation';
import NavBar from '../../components/navbar';
import GraficoSensores from './GraficoSensores';
import MostrarInfo from "../../components/mostrarInfo";
import BotonAtras from '../../components/botonAtras';
import { getSensor, getHistorialSensores, getTipoSensor } from '../../services/sensores/ApiSensores';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useExportarExcel } from '../../hooks/useReportes';
import exportarIcon from '../../assets/icons/subir.png'

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
  const [tipoSensor, setTipoSensor] = useState({});
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [cargando, SetCargando] = useState(true);
  const [hayDatos, setHayDatos] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const { exportarSensorIndividual } = useExportarExcel();


  // Fetch sensor + historial
  useEffect(() => {
    SetCargando(true);
    getSensor(id)
      .then(data => {
        setSensores(data);
        getTipoSensor(data.tipo_id).then(tipo => setTipoSensor(tipo));
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
    return rawHistorial
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) // ordenar cronológicamente
      .slice(-24) // ← limitar a los últimos 24 antes de filtrar
      .map(item => {
        const { fecha, hora } = formatearFechaYHora(item.fecha);
        return {
          ...item, // mantiene fecha ISO
          fechaFormateada: fecha,
          horaFormateada: hora,
          valorFormateado: limitarValor(item.valor)
        };
      })
      .filter(item => {
        if (!fechaFiltro) return true;

        const [añoFiltro, mesFiltro, diaFiltro] = fechaFiltro.split('-');
        const [diaItem, mesItem, añoItem] = item.fechaFormateada.split('/');

        const coincideDia = diaFiltro ? diaItem === diaFiltro : true;
        const coincideMes = mesFiltro ? mesItem === mesFiltro : true;
        const coincideAño = añoFiltro ? añoItem === añoFiltro : true;

        return coincideDia && coincideMes && coincideAño;
      });
  };


  const datosFinales = filtrarDatos();

  const datosTabla = datosFinales.map((item, i) => ({
    "#": i + 1,
    fecha: item.fechaFormateada,
    hora: item.horaFormateada,
    valor: item.valorFormateado + ` ${tipoSensor.unidad || ''}`,
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
      <div className="px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 mt-[1.5rem] pt-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <BotonAtras />
            <h3 className="text-2xl font-semibold ml-4">
              Datos del sensor: {sensores.nombre || `ID ${id}`}
            </h3>
          </div>
          <div className="flex items-end">
            {/* <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              className="p-2 border rounded-xl mr-2"
            /> */}
            <button
              id='exportarSteps'
              onClick={() => exportarSensorIndividual(id)}
              className="px-4 flex py-2 justify-center items-center bg-[#009E00] hover:bg-[#005F00] text-white rounded-xl"
            >
              <img src={exportarIcon} alt="" className='w-4 h-4 sm:mr-2' />
              <h3 className='hidden sm:block'> Exportar</h3>
            </button>
          </div>
        </div>
        {/* Gráfico individual */}
        <div id='graficaSteps' className="flex justify-center mb-8">
          <GraficoSensores
            sensoresData={[{
              sensor: sensores,
              historial: datosFinales
                .slice(-24) // últimos 24
                .map(item => ({
                  fecha: item.fecha, // fecha ISO
                  valor: item.valorFormateado
                }))
            }]}
          />

        </div>
      </div>
      {cargando ? (
        <p className="text-center">Cargando datos…</p>
      ) : !hayDatos ? (
        <p className="text-center text-red-500">No hay datos para este sensor.</p>
      ) : (
        <>

          {/* Tabla paginada */}
          <MostrarInfo
            columnas={columnas}
            datos={datosPaginados}
            mostrarAgregar={false}
            mostrarBotonAtras={false}
          />

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
    </div >
  );
}