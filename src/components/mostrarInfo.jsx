import { useState } from "react";
// Importación necesaria para recibir props o parámetros en el componente
import PropTypes from "prop-types";
// Iconos utilizados en el buscador
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";
import Opcion from "../components/Opcion";
import Tabla from "./Tabla";
import Tarjetas from "./UseCards";
function MostrarInfo({ columnas, datos, titulo, acciones, onAddUser, mostrarAgregar }) {
    const [busqueda, setBusqueda] = useState("");
    const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem('vistaActiva') || 'tarjetas');


    const handleVistaChange = (vista) => {
        setVistaActiva(vista); 
    };

     // Filtra la información según la búsqueda
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key] || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );
    return (
        <div className="container mx-auto p-4 sm:px-0">
            {/* Sección del buscador y cambio de vista */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <h1 className="text-2xl font-semibold ml-[1.8%]">{titulo}</h1>
                <div className="relative flex items-center w-full sm:w-80 bg-gray-100 rounded-full border border-gray-300">
                    <img src={search} alt="Buscar" className="absolute left-3" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
                    />
                    <button className="absolute right-3 bg-[#00304D] text-white px-[10px] rounded-full">
                        <img src={microphone} alt="Micrófono" />
                    </button>
                </div>
                <Opcion onChangeVista={handleVistaChange} />
            </div>
             {vistaActiva === "tabla" ? (
                    <Tabla
                      titulo={titulo}
                      columnas={columnas}
                      datos={datosFiltrados}  // Se usan los datos filtrados
                      acciones={acciones}
                      onAddUser={onAddUser}
                      mostrarAgregar={mostrarAgregar}
                    />
                  ) : (
                    <Tarjetas
                    titulo={titulo}
                    columnas={columnas}
                    datos={datosFiltrados}  // Se usan los datos filtrados
                    acciones={acciones}
                    onAddUser={onAddUser}
                    mostrarAgregar={mostrarAgregar}
                    />
                  )
                }
        </div>
    )
}

export default MostrarInfo