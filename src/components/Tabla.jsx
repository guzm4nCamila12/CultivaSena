import React, { useState } from "react";
import PropTypes from "prop-types";
// imgs de perfil según rol
import * as Images from "../assets/img/imagesExportation"
// íconos
import DropdownIcon from "../assets/icons/accionesMenu.png";
import cerrarMenu from "../assets/icons/cerrarMenu.png";
import accionesIcon from "../assets/icons/acciones.png";

const getRoleImage = (role) => {
  switch (role) {
    case "SuperAdmin":
      return Images.superAdminIcon;
    case "Admin":
      return Images.adminIcon;
    case "Alterno":
      return Images.alternoIcon;
    default:
      return Images.adminIcon;
  }
};

const Tabla = ({ columnas, datos, titulo, acciones, onAddUser, mostrarAgregar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [showAllActions, setShowAllActions] = useState(false);

  const mostrarFotoPerfil = columnas.some((col) => col.key === "fotoPerfil");
  const columnasSinFoto = columnas.filter((col) => col.key !== "fotoPerfil");
  const datosFiltrados = datos.filter((fila) =>
    columnasSinFoto.some((col) =>
      String(fila[col.key] || "").toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  const columnasAUsar = mostrarFotoPerfil
    ? [{ key: "fotoPerfil", label: "" }, ...columnasSinFoto]
    : columnasSinFoto;

  return (
    <div className="container  mx-auto px-0  pb-4">
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[640px] pr-4 rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-4 ">
          <thead>
            <tr className="text-white">
              {columnasAUsar.map((columna, index) => {
                const isAcciones = columna.key === "acciones";
                const baseClasses =
                  "p-2 md:p-3 text-left text-sm md:text-base border-t border-b border-gray-300 bg-[#00304D]";
                let borderClasses = "";
                if (mostrarFotoPerfil && columna.key === "fotoPerfil") borderClasses = "rounded-l-full px-7";
                else if (!mostrarFotoPerfil && ["nombre", "cultivo", "#"].includes(columna.key)) borderClasses = "rounded-l-full";
                if (index === columnasAUsar.length - 1) borderClasses += " rounded-r-full";
                const stickyClasses = isAcciones ? "sticky right-0 z-20" : "";

                return (
                  <th
                    key={index}
                    className={`${baseClasses} ${borderClasses} ${stickyClasses}`}
                    style={isAcciones ? { right: '-1rem' } : undefined}
                  >
                    <div className="flex items-center justify-start">
                      {isAcciones ? (
                        <>
                          <img src={accionesIcon} alt="Acciones" className="mr-2" />
                          <span className="mr-7">
                            {/* móvil: solo cuando abierto; escritorio: siempre */}
                            <span className="md:hidden">{showAllActions ? columna.label : null}</span>
                            <span className="hidden md:inline ">{columna.label}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          {columna.icon2 && (
                            <img src={columna.icon2} alt={columna.label} className="mr-2" />
                          )}
                          <span className="mr-7">{columna.label}</span>
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length > 0 ? (
              datosFiltrados.map((fila, rowIndex) => (
                <tr key={fila.id || rowIndex}>
                  {mostrarFotoPerfil && (
                    <td className="rounded-l-full p-2 md:p-3 text-sm md:text-base h-14 border-t border-b border-gray-300 bg-[#ffffff] w-16">
                      <img
                        src={getRoleImage(fila.id_rol)}
                        alt="Foto de perfil"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                  )}
                  {columnasSinFoto.map((columna, colIndex) => {
                    const isAcciones = columna.key === "acciones";
                    let cellBorder = "";
                    if (!mostrarFotoPerfil && ["nombre", "cultivo", "#"].includes(columna.key)) cellBorder = "rounded-l-full";
                    if (colIndex === columnasSinFoto.length - 1) cellBorder += " rounded-r-full";

                    return isAcciones ? (
                      <td
                        key={colIndex}
                        className={`sticky right-0 z-10 p-2 md:p-3 text-left text-sm md:text-base h-14 justify-start ${cellBorder} border-t border-b border-gray-300 bg-[#ffffff]`}
                        style={{ right: '-1rem' }}
                      >
                        <div className="hidden md:flex justify-start gap-2">
                          {acciones(fila)}
                        </div>
                        <div className="flex md:hidden relative justify-start">
                          {showAllActions ? (
                            <div
                              className="right-full top-0 z-50 flex flex-row items-start gap-6 w-56 p-2 bg-[#ffffff] rounded-md"
                              onClick={(e) => e.stopPropagation()}
                              style={{ boxShadow: "-3px 0px 0px rgba(0,0,0,0.15)" }}
                            >
                              {acciones(fila)}
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowAllActions(false); }}
                                className="absolute right-0"
                              >
                                <img src={cerrarMenu} alt="Cerrar" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowAllActions(true); }}
                              className="rounded-full text-white"
                            >
                              <img src={DropdownIcon} alt="Desplegar acciones" className="mr-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    ) : (
                      <td
                        key={colIndex}
                        className={`p-2 md:p-3 text-left text-sm md:text-base h-14 ${cellBorder} border-t border-b border-gray-300 bg-[#ffffff]`}
                      >
                        <span>
                          {columna.key === "#" ? rowIndex + 1 : fila[columna.key]}
                        </span>
                      </td>
                    );
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
          className="w-full sm:w-[60%] mx-auto flex items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 py-2 cursor-pointer hover:shadow-md hover:scale-95 m-3 "
          onClick={onAddUser}
        >
          <span className="text-[#009E00] text-base font-semibold">Crear</span>
          <div className="ml-2 w-8 h-8 bg-[#009E00] rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">+</span>
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
