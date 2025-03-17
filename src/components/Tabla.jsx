import { useState } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";
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


    // Filtrar columnas para excluir "foto_perfil"
    const columnasFiltradas = columnas.filter(columna => columna.key !== "fotoPerfil");

    // Filtrar datos según la búsqueda
    const datosFiltrados = datos.filter((fila) =>
        columnasFiltradas.some((columna) =>
            String(fila[columna.key] || "").toLowerCase().includes(busqueda.toLowerCase())
        )
    );

    // Agregar una columna vacía al principio
    const columnasConVacia = [{ key: "vacía", label: "" }, ...columnasFiltradas];

    return (
        <div className="container mx-auto px-0 ">

            <div className="w-full overflow-x-auto rounded-lg">
                <table className="min-w-full border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-white">
                            {columnasConVacia.map((columna, index) => (
                                <th
                                    key={index}
                                    className={`p-2 md:p-3 text-left text-sm md:text-base 
                      ${index === 0 ? "rounded-l-full" : ""} 
                      ${index === columnasConVacia.length - 1 ? "rounded-r-full" : ""}
                      border-t border-b border-gray-300 bg-[#00304D]`}
                                >
                                    <div className="flex items-center">
                                        <span className="flex-1">{columna.label}</span>
                                        {index !== columnasConVacia.length - 1 && columna.key !== "acciones" && (
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
                                    <td className="rounded-l-full text-left p-2 md:p-3 text-sm md:text-base h-14 border-t border-b border-gray-300 bg-[#EEEEEE] w-16 items-center justify-center">
                                        <img
                                            src={getRoleImage(fila.id_rol)}
                                            alt={fila.key}
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                                        />
                                    </td>
                                    {columnasFiltradas.map((columna, i) => (
                                        <td
                                            key={i}
                                            className={`p-2 md:p-3 text-left text-sm md:text-base h-14 
                          ${i === 0 ? "font-bold" : ""} 
                          ${i === columnasFiltradas.length - 1 ? "rounded-r-full" : ""}
                          border-t border-b border-gray-300 bg-[#EEEEEE]`}
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
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columnasConVacia.length} className="text-center p-4 text-sm">
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
                    <span className="text-[#009E00] text-sm sm:text-base font-semibold">Agregar</span>
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
        })
    ).isRequired,
    datos: PropTypes.array.isRequired,
    titulo: PropTypes.string.isRequired,
    acciones: PropTypes.func.isRequired,
    onAddUser: PropTypes.func,
    mostrarAgregar: PropTypes.bool,
};

export default Tabla;