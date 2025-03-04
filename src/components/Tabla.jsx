import { useState } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";

const Tabla = ({ columnas, datos, titulo, acciones }) => {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar datos según la búsqueda
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key]).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4 ">
      {/* Contenedor del título y el buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-[27px] font-medium">{titulo}</h1>

        {/* Input de búsqueda con iconos */}
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
      </div>

      {/* Tabla en pantallas grandes - Tarjetas en móviles */}
      <div className="w-full overflow-y-auto  rounded-lg ">
        <div className="hidden md:block lg:max-h-[400px]">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className=" text-white">
                {columnas.map((columna, index) => (
                  <th
                    key={index}
                    className={`p-2 md:p-3 text-left text-sm md:text-base 
          ${index === 0 ? "rounded-l-full" : ""} 
          ${index === columnas.length - 1 ? "rounded-r-full" : ""}
          border-t border-b border-gray-300 bg-[#00304D]`} // Añadir bordes explícitos a las celdas del encabezado
                  >
                    <div className="flex items-center">
                      <span className="flex-1">
                        {columna.icon && (
                          <img src={columna.icon} alt={columna.label} className="inline mr-2 hidden md:inline" />
                        )}
                        {columna.label}
                      </span>
                      {index !== columnas.length - 1 && columna.key !== "acciones" && (
                        <div className="h-8 w-[1px] bg-gray-300"></div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>



            <tbody>
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map((fila, index) => (
                  <tr key={fila.id || index} className="">
                    {columnas.map((columna, i) => (
                      <td
                        key={i}
                        className={`p-2 md:p-3 text-left text-sm md:text-base h-14 
              ${i === 0 ? "rounded-l-full text-center font-bold" : ""} 
              ${i === columnas.length - 1 ? "rounded-r-full text-center" : ""}
              border-t border-b border-gray-300 bg-[#EEEEEE]`} // Añadir bordes explícitos a las celdas
                      >
                        <div className="flex items-center">
                          <span className="flex-1">
                            {columna.key === "#" ? (  // Aquí chequeamos si es la columna del índice
                              index + 1 // Mostrar el número de índice
                            ) : columna.key === "acciones" ? (
                              <div className="flex gap-2">{acciones(fila)}</div>
                            ) : (
                              fila[columna.key]  // Mostrar el valor de la fila según la columna
                            )}
                          </span>
                          {i !== columnas.length - 1 && columna.key !== "acciones" && (
                            <div className="h-8 w-[1px] bg-gray-300"></div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columnas.length} className="text-center p-4 text-sm">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>





          </table>
        </div>

        {/* Vista en tarjetas para móviles */}
        <div className="md:hidden">
          {datosFiltrados.length > 0 ? (
            datosFiltrados.map((fila, index) => (
              <div
                key={fila.id || index}
                className="bg-white shadow-md rounded-lg p-4 mb-4 border flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="bg-black text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex gap-2">{acciones(fila)}</div>
                </div>
                <div>
                  {columnas
                    .filter((columna) => columna.key !== "#" && columna.key !== "acciones")
                    .map((columna, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-semibold">{columna.label}: </span>
                        {fila[columna.key]}
                      </div>
                    ))}
                </div>

              </div>
            ))
          ) : (
            <p className="text-center p-4 text-sm">No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
};

Tabla.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func.isRequired,
};

export default Tabla;
