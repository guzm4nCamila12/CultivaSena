import { useState } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png"
import microphone from "../assets/icons/Microphone.png"

const Tabla = ({ columnas, datos, titulo, acciones }) => {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar datos según la búsqueda
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key]).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto ">
      {/* Contenedor del título y el buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-[27px] font-medium">{titulo}</h1>

        {/* Contenedor del input con iconos personalizados */}
        <div className="relative flex items-center w-full sm:w-80 bg-gray-100 rounded-full border border-gray-300">
          <img
            src={search} // Ruta del icono de lupa
            alt="Buscar"
            className="absolute left-3 "
          />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
          />
          <button className="absolute right-3 bg-[#00304D] text-white px-[10px] rounded-full">
            <img
              src={microphone} // Ruta del icono de micrófono
              alt="Micrófono"
              
            />
          </button>
        </div>
      </div>

      {/* Tabla con scroll horizontal */}
      <div className="w-full overflow-x-auto border rounded-lg shadow-md">
        <div className="max-h-[300px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-y-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-y-4">
            <thead>
              <tr className="bg-[#00304D] text-white">
                {columnas.map((columna, index) => (
                  <th
                    key={index}
                    className={`p-2 md:p-3 text-left text-sm md:text-base ${
                      index === 0 ? "rounded-l-3xl" : ""
                    } ${index === columnas.length - 1 ? "rounded-r-3xl" : ""}`}
                  >
                    <span className="inline-flex items-center gap-1 md:gap-2">
                      {columna.icon && <img src={columna.icon} alt={columna.label} />}
                      {columna.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map((fila, index) => (
                  <tr key={fila.id || index} className="bg-[#EEEEEE] rounded-lg">
                    {columnas.map((columna, i) => (
                      <td
                        key={i}
                        className={`p-2 md:p-3 text-left text-sm md:text-base h-14 ${
                          i === 0 ? "rounded-l-3xl" : ""
                        } ${i === columnas.length - 1 ? "rounded-r-3xl" : ""}`}
                      >
                        {columna.key === "#" ? (
                          index + 1
                        ) : columna.key === "acciones" ? (
                          <div className="flex justify-start gap-1 md:gap-2">{acciones(fila)}</div>
                        ) : (
                          fila[columna.key]
                        )}
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
      </div>
    </div>
  );
};

Tabla.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func.isRequired,
};

export default Tabla;
