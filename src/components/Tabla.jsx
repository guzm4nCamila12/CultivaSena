import { useState } from "react";
import PropTypes from "prop-types";
import buscarAzul from "../assets/icons/buscarAzul.png";
import microfono from "../assets/icons/microfono.png";
import superAdminIcon from "../assets/img/PerfilSuperAdmin.png";
import adminIcon from "../assets/img/PerfilAdmin.png";
import alternoIcon from "../assets/img/PerfilAlterno.png";

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
                if (mostrarFotoPerfil) {
                  if (columna.key === "fotoPerfil") {
                    borderClasses = "rounded-l-full";
                  }
                } else {
                  if (columna.key === "nombre" || columna.key === "cultivo"|| columna.key === "#") {
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
                        <span>{columna.label}</span>
                      </div>
                      {index !== columnasAUsar.length - 1 && columna.key !== "acciones" && (
                        <div className="h-8 w-[1px] bg-gray-300" />
                      )}
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
                    if (!mostrarFotoPerfil && columna.key === "nombre" || !mostrarFotoPerfil && columna.key === "cultivo"|| !mostrarFotoPerfil && columna.key === "#") {
                      borderClasses = "rounded-l-full";
                    }
                    if (i === columnasSinFoto.length - 1) {
                      borderClasses += " rounded-r-full";
                    }
                    return (
                      <td
                        key={i}
                        className={`p-2 md:p-3 text-left text-sm md:text-base h-14 ${borderClasses} border-t border-b border-gray-300 bg-[#ffffff]`}
                      >
                        <div className="flex items-center justify-start">
                          <span className="flex-1">
                            {columna.key === "#" ? (
                              index + 1
                            ) : columna.key === "acciones" ? (
                              <div className="flex gap-2">{acciones(fila)}</div>
                            ) : (
                              fila[columna.key]
                            )}
                          </span>
                        </div>
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