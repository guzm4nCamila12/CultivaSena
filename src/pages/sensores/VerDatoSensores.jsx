//importaciones necesarios de react
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import * as Icons from '../../assets/icons/IconsExportation'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
//componentes reutilizados
import NavBar from '../../components/navbar';
import GraficoSensor from './GraficoSensores';
import MostrarInfo from "../../components/mostrarInfo";
import BotonAtras from '../../components/botonAtras';
//endpoint para consumir api
import { getSensor, getHistorialSensores, getTipoSensorById } from '../../services/sensores/ApiSensores';
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
  const [paginaActual, setPaginaActual] = useState(1);
  const [tipoSensor, setTipoSensor] = useState({});


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
              .slice(0, 24); // Tomar los 10 más recientes

            console.log("Historial filtrado (últimos 5 min):", historialFiltrado);


            const datosGrafico = historialFiltrado.map(item => {
              const { fecha, hora } = formatearFechaYHora(item.fecha);
              return {
                fecha,
                hora,
                valor: limitarValor(item.valor),
              };
            });

            getTipoSensorById(data.tipo_id)
            .then((data) => {
              setTipoSensor(data);
            })
            

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

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(datosTabla);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Sensor');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(file, `sensor_${sensores.nombre || 'datos'}.xlsx`);
  };

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
    valor: fila.valor + ` ${tipoSensor.unidad || ''}` // Agregar unidad si existe
  }));

  const itemsPorPagina = 12;
  const totalPaginas = Math.ceil(datosTabla.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const datosPaginados = datosTabla.slice(inicio, fin);

  return (
    <div >
      <NavBar />
      {/* Filtrar datos por fecha */}
      <div className="w-auto pt-2 xl:mx-36 mx-5 lg:mx-16 sm:mx-5">
        <div className="flex justify-between items-center mb-1 px-1">
          <div className="flex items-center ml-[-80px]">
            <BotonAtras/>
            <h3 className='text-2xl font-semibold pl-4'> Datos del sensor: {sensores.nombre}</h3>
          </div>

          <div className='text-right -mr-20'>
            <h3 className="mb-1 font-semibold text-left ml-4">Filtrar por fecha</h3>
            <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              className="mb-2 p-2 border rounded-xl"
            />
            <button
              onClick={exportarExcel}
              className='ml-2 px-4 py-2 bg-[#39A900] text-white rounded-xl hover:bg-green-700'
            >
              Exportar Excel
            </button>
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
            datos={datosTabla.slice((paginaActual - 1) * 12, paginaActual * 12)}
            mostrarBotonAtras={false}
          />

          {datosTabla.length > 12 && (
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(Math.ceil(datosTabla.length / 12))].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 mb-8 rounded-full flex items-center justify-center transition-all ${paginaActual === i + 1 ? 'bg-[#00304D] hover:bg-[#002438] text-white' : 'bg-white text-[#00304D] hover:bg-gray'}`}
                  onClick={() => setPaginaActual(i + 1)}
                >
                  Página {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className='flex flex-row justify-center '>
          <p className='m-0'>No hay datos</p>
        </div>
      )}


    </div>
  );
}