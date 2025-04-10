// importaciones necesarias de react
import { useState } from "react";
import PropTypes from "prop-types";

// imgs de perfil según rol
import superAdminIcon from "../assets/img/perfilSuperAdmin.png";
import adminIcon from "../assets/img/perfilAdmin.png";
import alternoIcon from "../assets/img/perfilAlterno.png";
// ícono para desplegar acciones en móvil
import DropdownIcon from "../assets/icons/accionesMenu.png";

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
  // Estado para controlar la fila expandida en vista móvil
  const [expandedRow, setExpandedRow] = useState(null);

  // Determinar si se debe mostrar la columna de fotoPerfil
  const mostrarFotoPerfil = columnas.some((columna) => columna.key === "fotoPerfil");
  // Filtrar columnas para usar en búsqueda y renderizado (sin fotoPerfil)
  const columnasSinFoto = columnas.filter((columna) => columna.key !== "fotoPerfil");
  // Filtrar datos según la búsqueda usando solo las columnas que contienen texto
  const datosFiltrados = datos.filter((fila) =>
    columnasSinFoto.some((columna) =>
      String(fila[columna.key] || "").toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  // Armar las columnas a usar en el header: si hay foto, la agregamos al inicio.
  const columnasAUsar = mostrarFotoPerfil
    ? [{ key: "fotoPerfil", label: "" }, ...columnasSinFoto]
    : columnasSinFoto;

  return (
    <div className="container mx-auto px-0 py-4">
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px] pr-4 rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-white">
              {columnasAUsar.map((columna, index) => {
                let borderClasses = "";
                // Comprobamos si se debe mostrar la foto de perfil o no
                if (mostrarFotoPerfil) {
                  if (columna.key === "fotoPerfil") {
                    borderClasses = "rounded-l-full px-7";
                  }
                } else {
                  if (columna.key === "nombre" || columna.key === "cultivo" || columna.key === "#") {
                    borderClasses = "rounded-l-full";
                  }
                }
                if (index === columnasAUsar.length - 1) {
                  borderClasses += " rounded-r-full";
                }
                return (
                  <th
                    key={index}
                    className={`p-2 md:p-3 text-left text-sm md:text-base ${borderClasses} border-t border-b border-gray-300 bg-[#00304D]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {columna.icon2 && (
                          <img
                            src={columna.icon2}
                            alt={columna.label}
                            className="mr-2"
                          />
                        )}
                        <span className="mr-7">{columna.label}</span>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length > 0 ? (
              datosFiltrados.map((fila, index) => (
                <tr key={fila.id || index}>
                  {mostrarFotoPerfil && (
                    <td className="rounded-l-full text-left p-2 md:p-3 text-sm md:text-base h-14 border-t border-b border-gray-300 bg-[#ffffff] w-16">
                      <img
                        src={getRoleImage(fila.id_rol)}
                        alt="Foto de perfil"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    </td>
                  )}
                  {columnasSinFoto.map((columna, i) => {
                    let borderClasses = "";
                    if (
                      !mostrarFotoPerfil &&
                      (columna.key === "nombre" ||
                        columna.key === "cultivo" ||
                        columna.key === "#")
                    ) {
                      borderClasses = "rounded-l-full";
                    }
                    if (i === columnasSinFoto.length - 1) {
                      borderClasses += " rounded-r-full";
                    }

                    // Para la columna "acciones" adaptamos la interfaz para responsive
                    if (columna.key === "acciones") {
                      return (
                        <td
                          key={i}
                          className={`sticky right-0 z-10 p-2 md:p-3 text-left text-sm md:text-base h-14 ${borderClasses} border-t border-b border-gray-300 bg-[#ffffff]`}
                          style={{ right: "-20px" }}  // Desplaza la celda 20px hacia la derecha
                        >
                          {/* Vista de escritorio: muestra los botones directamente */}
                          <div className="hidden md:flex justify-center gap-2">
                            {acciones(fila)}
                          </div>
                          {/* Vista móvil: botón para desplegar acciones */}
                          <div className="flex md:hidden relative justify-center">
                            {expandedRow === index ? (
                              <div
                                className="right-full top-0 z-50 flex flex-row items-center gap-6 p-2 bg-[#ffffff] rounded-md "
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  boxShadow: "-3px 0px 0px rgba(0, 0, 0, 0.15)", // sombra hacia la izquierda
                                }}
                              >
                                {acciones(fila)}
                                {/* Botón para cerrar el menú */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedRow(null);
                                  }}
                                  className="text-red hover:bg-gray-200 transition-all"
                                  
                                >
                                  <img
                                  src={DropdownIcon}
                                  alt="Desplegar acciones"
                                  className="absolute" 
                                />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRow(expandedRow === index ? null : index);
                                }}
                                className="p-2 rounded-full  text-white transition-all duration-300"
                              >
                                <img
                                  src={DropdownIcon}
                                  alt="Desplegar acciones"
                                />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={i}
                          className={`p-2 md:p-3 text-left text-sm md:text-base h-14 ${borderClasses} border-t border-b border-gray-300 bg-[#ffffff]`}
                        >
                          <div className="flex items-center justify-start">
                            <span className="flex-1">
                              {columna.key === "#" ? index + 1 : fila[columna.key]}
                            </span>
                          </div>
                        </td>
                      );
                    }
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnasAUsar.length} className="text-center p-4 text-sm">
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {mostrarAgregar && (
        <div
          className="w-full sm:w-[60%] mx-auto flex flex-row items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 py-2 cursor-pointer transition duration-300 hover:shadow-md hover:shadow-black/25 hover:scale-95 mb-4"
          onClick={onAddUser}
        >
          <span className="text-[#009E00] text-sm sm:text-base font-semibold">Crear</span>
          <div className="ml-2 w-6 h-6 sm:w-8 sm:h-8 bg-[#009E00] rounded-full flex items-center justify-center">
            <span className="text-white text-xl sm:text-2xl font-bold">+</span>
          </div>
        </div>
      )}
    </div>
  );
};

Tabla.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon2: PropTypes.string,
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func.isRequired,
  onAddUser: PropTypes.func,
  mostrarAgregar: PropTypes.bool,
};

export default Tabla;
