import React, { useState } from "react";
import buscar from "../assets/icons/buscar.png";
import Opcion from "../components/Opcion";
import Tabla from "./Tabla";
import Tarjetas from "./UseCards";
import BotonAtras from "./botonAtras";
import Seleccionar from "../assets/icons/seleccionar.png"
import Cancelar from "../assets/icons/cancelar.png"

function MostrarInfo({
  columnas,
  datos,
  titulo,
  acciones,
  onAddUser,
  mostrarAgregar,
  enableSelectionButton = false, // nuevo prop para mostrar el botón
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
              className={`flex ${ seleccionEnabled ? 'bg-red-500' : 'bg-[#39A900]'} text-white px-3 py-2 rounded-3xl`}
            >
              <img
                src={seleccionEnabled ? Cancelar : Seleccionar}
                alt="ícono selección"
                className="w-6 h-6 mr-1"
              />
              {seleccionEnabled ? 'Cancelar' : 'Seleccionar'}
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
        />
      )}
    </div>
  );
}

export default MostrarInfo;
