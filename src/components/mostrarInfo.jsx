import React, { useState } from "react";
import buscar from "../assets/icons/buscar.png";
import Opcion from "../components/Opcion";
import Tabla from "./Tabla";
import Tarjetas from "./UseCards";
import BotonAtras from "./botonAtras";

function MostrarInfo({columnas, datos, titulo, acciones, onAddUser, mostrarAgregar, enableSelectionButton = false, vista, 
}) {
  const [busqueda, setBusqueda] = useState("");
  const [vistaActiva, setVistaActiva] = useState(
    () => localStorage.getItem('vistaActiva') || 'tarjetas'
  );
  const [seleccionEnabled, setSeleccionEnabled] = useState(false);

  const datosFiltrados = datos.filter((fila) =>
    columnas.some((col) =>
      String(fila[col.key] || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4 sm:px-0 ">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 mx-auto">
        <div className="flex items-center ">
          <BotonAtras />
          <h1 className="text-2xl font-semibold pl-4">{titulo}</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-80 bg-gray-100 rounded-full border border-gray-300">
            <img src={buscar} alt="Buscar" className="absolute left-3" />
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
            />
          </div>
          <Opcion onChangeVista={setVistaActiva} />
          {enableSelectionButton && (
            <button
              onClick={() => setSeleccionEnabled((prev) => !prev)}
              className="bg-blue-500 text-white px-3 py-2 rounded-3xl"
            >
              {seleccionEnabled ? 'Cancelar selección' : 'Seleccionar varios'}
            </button>
          )}
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
        />
      )}
    </div>
  );
}

export default MostrarInfo;
