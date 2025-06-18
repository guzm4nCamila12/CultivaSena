import React, { useState } from "react";
import buscar from "../assets/icons/buscar.png";
import Opcion from "../components/Opcion";
import Tabla from "./Tabla";
import Tarjetas from "./UseCards";
import BotonAtras from "./botonAtras";
import Seleccionar from "../assets/icons/seleccion.png"
import Cancelar from "../assets/icons/cancelar.png"
import { useEffect } from "react";

function MostrarInfo({ columnas, datos, titulo, acciones, onAddUser, mostrarAgregar, mostrarBotonAtras = true, enableSelectionButton = false, vista,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [vistaActiva, setVistaActiva] = useState(
    () => localStorage.getItem('vistaActiva') || 'tarjetas'
  );
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionEnabled, setSeleccionEnabled] = useState();

  useEffect(() => {
    setSeleccionEnabled(enableSelectionButton);
  }, [enableSelectionButton]);

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


  return (
    <div className="px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 mx-auto">
      <div className="flex flex-col-reverse lg:flex-row justify-between lg:items-center mb-4 gap-4 mx-auto">
        {/* IZQUIERDA: Botón atrás + título + barra de búsqueda */}
        <div className="flex flex-col my-2 w-full lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex justify-between">
            <div  className="flex w-auto items-center">
              {mostrarBotonAtras && <BotonAtras />}
              <h1 id="tituloSteps" className="sm:text-2xl w-full text-lg font-semibold">{titulo}</h1>
            </div>
            {/* Mover Opción aquí en móviles */}
            <div className="block lg:hidden">
              <Opcion onChangeVista={setVistaActiva} />
            </div>
          </div>
          {/* Barra de búsqueda */}
          <div id="buscadorSteps" className=" relative flex items-center w-full  lg:justify-end lg:w-64 sm:w-70 bg-white rounded-full border border-gray-300">
            <img src={buscar} alt="Buscar" className="absolute left-3 border-r-2 pr-1 border-[#EEEEEE]" />
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
            />
          </div>
          {enableSelectionButton && (
            <div className="flex w-auto justify-end">
              <button
                onClick={() => setSeleccionEnabled((prev) => !prev)}
                className={`flex w-36 justify-center  ${seleccionEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-[#39A900] hover:bg-[#005F00]'} text-white px-3 py-2 rounded-3xl`}
              >
                <img
                  src={seleccionEnabled ? Cancelar : Seleccionar}
                  alt="ícono selección"
                  className="w-6 h-6 mr-1"
                />
                {seleccionEnabled ? 'Cancelar' : 'Seleccionar'}
              </button>
            </div>
          )}
        </div>

        {/* DERECHA: Botón seleccionar + Opción (visible solo en sm+) */}
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Opción solo visible en sm+ */}
          <div id="opcionSteps" className="hidden lg:block bg-">
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
          enableSelection={seleccionEnabled}
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
          enableSelection={seleccionEnabled}
          vista={vista}
          seleccionados={seleccionados}
          setSeleccionados={setSeleccionados}
        />
      )}
    </div>
  );
}

export default MostrarInfo;
