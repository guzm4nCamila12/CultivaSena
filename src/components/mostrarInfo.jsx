/* global globalThis */
/* MostrarInfo.jsx */
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import buscar from "../assets/icons/buscar.png";
import Opcion from "../components/Opcion";
import Tabla from "./Tabla";
import Tarjetas from "./UseCards";
import BotonAtras from "./botonAtras";
import ProcesarIcon from "../assets/icons/procesar.png"; // Nuevo icono Procesar

function MostrarInfo({
  columnas,
  datos,
  titulo,
  acciones,
  onAddUser,
  mostrarAgregar,
  enableSelectionButton = false,
  vista,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [vistaActiva, setVistaActiva] = useState(
    () => localStorage.getItem('vistaActiva') || 'tarjetas'
  );

  const [seleccionados, setSeleccionados] = useState([]);

  const location = useLocation()
  const mostrarBotonAtras =  !location.pathname.includes('/datos-sensor/');

  useEffect(() => {
    setSeleccionados([]);
  }, [vista]);

  const datosFiltrados = datos.filter((fila) =>
    columnas.some((col) =>
      String(fila[col.key] || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );

  // Función delegada para procesar selección (se ejecuta dentro de Tarjetas o Tabla)
  const handleProcesar = () => {
    // Emitir evento personalizado o usar callback de props si lo necesitas
    const event = new CustomEvent('procesarSeleccionados');
    globalThis.dispatchEvent(event);
  };

  return (
    <div className="px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 mx-auto">
      <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center mb-4 gap-4 mx-auto">
        <div className="flex flex-col my-2 w-full lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex justify-between">
            <div className="flex w-auto items-center">
              {mostrarBotonAtras && <BotonAtras />}
              <h1 id="tituloSteps" className="sm:text-2xl w-full text-lg font-semibold">
                {titulo}
              </h1>
            </div>
          </div>
          <div className="lg:hidden">
            {enableSelectionButton && (
              <button
                onClick={handleProcesar}
                className="flex w-full font-bold mt-4 lg:m-0 lg:w-36 justify-center bg-[#39A900] hover:bg-[#005F00] text-white px-3 py-2 rounded-3xl"
              >
                <img src={ProcesarIcon} alt="Procesar" className="w-6 h-6 mr-1" />
                Procesar ({seleccionados.length})
              </button>
            )}
          </div>
          <div className="flex space-x-5">
            <div id="buscadorSteps" className="relative flex items-center w-full lg:justify-end lg:w-64 sm:w-70 bg-white rounded-full border border-gray-300">
              <img src={buscar} alt="Buscar" className="absolute left-3 border-r-2 pr-1 border-[#EEEEEE]" />
              <input
                type="text"
                placeholder="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
              />
            </div>
            <div className="block lg:hidden">
              <Opcion onChangeVista={setVistaActiva} />
            </div>
          </div>
        </div>

        {/* Controles derecha: Procesar y Opción */}
        <div className="flex-row flex lg:flex-row items-center gap-4 w-full lg:w-auto">
          {enableSelectionButton && (
            <div className="hidden lg:block">
              <button
                id="procesarSteps"
                onClick={handleProcesar}
                className="flex-row flex w-full font-bold mt-4 lg:m-0 lg:w-40 justify-center bg-[#39A900] hover:bg-[#005F00] text-white px-3 py-2 rounded-3xl"
              >
                <img src={ProcesarIcon} alt="Procesar" className="w-6 h-6 mr-1" />
                Procesar ({seleccionados.length})
              </button>
            </div>
          )}
          <div id="opcionSteps" className="hidden lg:block">
            <Opcion onChangeVista={setVistaActiva} />
          </div>
        </div>
      </div>

      {vistaActiva === "tabla" ? (
        <Tabla
          titulo={titulo}
          columnas={columnas}
          datos={datosFiltrados}
          acciones={acciones}
          onAddUser={onAddUser}
          mostrarAgregar={mostrarAgregar}
          enableSelection={enableSelectionButton}
          vista={vista}
          seleccionados={seleccionados}
          setSeleccionados={setSeleccionados}
        />
      ) : (
        <Tarjetas
          titulo={titulo}
          columnas={columnas}
          datos={datosFiltrados}
          acciones={acciones}
          onAddUser={onAddUser}
          mostrarAgregar={mostrarAgregar}
          enableSelection={enableSelectionButton}
          vista={vista}
          seleccionados={seleccionados}
          setSeleccionados={setSeleccionados}
        />
      )}
    </div>
  );
}

MostrarInfo.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  datos: PropTypes.arrayOf(PropTypes.object).isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.arrayOf(PropTypes.object),
  onAddUser: PropTypes.func,
  mostrarAgregar: PropTypes.bool,
  enableSelectionButton: PropTypes.bool,
  vista: PropTypes.string,
};

export default MostrarInfo;