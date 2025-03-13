import { useState } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";
import superAdminIcon from "../assets/img/fotoPerfil.png";
import adminIcon from "../assets/img/fotoPerfil.png";
import alternoIcon from "../assets/img/fotoPerfil.png";
import Opcion from "./Opcion";

const getRoleImage = (role) => {
  switch (role) {
    case "SuperAdmin":
      return superAdminIcon;
    case "Admin":
      return adminIcon;
    case "Alterno":
      return alternoIcon;
    default:
      return adminIcon;
  }
};

const Tabla = ({ columnas, datos, titulo, acciones, onAddUser, mostrarAgregar }) => {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar datos según la búsqueda
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key] || "").toLowerCase().includes(busqueda.toLowerCase())
    )
  );


  return (
    <div className="container mx-auto p-4">
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
        <Opcion/>
      </div>

      {/* Botón de agregar */}
      {mostrarAgregar && (
        <div
          className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 sm:px-6 py-2 sm:py-6 cursor-pointer transition duration-300 hover:shadow-md hover:shadow-black/25 hover:scale-95 mb-4"
          onClick={onAddUser}
        >
          <span className="text-[#009E00] text-base sm:text-2xl font-semibold">Agregar</span>
          <div className="ml-2 sm:ml-0 w-8 sm:w-12 h-8 sm:h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-0 sm:mt-2">
            <span className="text-white text-xl sm:text-3xl font-bold">+</span>
          </div>
        </div>
      )}

      {/* Tabla en pantallas grandes - Tarjetas en móviles */}
      <div className="w-full overflow-y-auto rounded-lg">
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
          border-t border-b border-gray-300 bg-[#00304D]`}
                  >
                    <div className="flex items-center">
                      <span className="flex-1">{columna.label}</span>
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
                  <tr key={fila.id || index}>
                    {columnas.map((columna, i) => (
                      <td
                        key={i}
                        className={`p-2 md:p-3 text-left text-sm md:text-base h-14 
              ${i === 0 ? "rounded-l-full text-center font-bold" : ""} 
              ${i === columnas.length - 1 ? "rounded-r-full text-center" : ""}
              border-t border-b border-gray-300 bg-[#EEEEEE]`}
                      >
                        <div className="flex items-center">
                          {columna.key === "id_rol" && (
                            <img src={getRoleImage(fila[columna.key])} alt={fila[columna.key]} className="w-10 h-10 rounded-full mr-2" />
                          )}
                          <span className="flex-1">
                            {columna.key === "#" ? (
                              index + 1
                            ) : columna.key === "acciones" ? (
                              <div className="flex gap-2">{acciones(fila)}</div>
                            ) : (
                              fila[columna.key]
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
  onAddUser: PropTypes.func,
  mostrarAgregar: PropTypes.bool,
};

export default Tabla;