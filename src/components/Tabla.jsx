// Tabla.jsx
import React, { use, useState } from "react";
import PropTypes from "prop-types";
import * as Images from "../assets/img/imagesExportation";
import DropdownIcon from "../assets/icons/accionesMenu.png";
import cerrarMenu from "../assets/icons/cerrarMenu.png";
import ModalFechaRango from "./modals/FechaRango";
import { useNavigate } from "react-router-dom";
import { useExportarExcel } from "../hooks/useReportes";
import { acctionSucessful } from "./alertSuccesful";
import { Alerta } from "../assets/img/imagesExportation";
import Procesar from "../assets/icons/procesar.png"

const getRoleImage = (role) => {
  switch (role) {
    case "SuperAdmin": return Images.superAdminIcon;
    case "Admin": return Images.adminIcon;
    case "Alterno": return Images.alternoIcon;
    default: return Images.adminIcon;
  }
};

const Tabla = ({ columnas, datos, acciones, onAddUser, mostrarAgregar, enableSelection = false, vista,
}) => {
  const [showAllActions, setShowAllActions] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const allIds = datos.map((fila) => fila.id);
  const mostrarFotoPerfil = columnas.some((col) => col.key === "fotoPerfil");
  const columnasSinFoto = columnas.filter((col) => col.key !== "fotoPerfil");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rangoFechas, setRangoFechas] = useState({ fechaInicio: null, fechaFin: null });
  const navigate = useNavigate();

  const {obtenerRangoFecha} = useExportarExcel()
  const { reporteSensores } = useExportarExcel()

  // Construcción de encabezados
  const encabezados = [];
  if (enableSelection) encabezados.push({ key: 'seleccionar', label: '' });
  if (mostrarFotoPerfil) encabezados.push({ key: 'fotoPerfil', label: '' });
  encabezados.push(...columnasSinFoto);
  const totalCols = encabezados.length;

  // Select all toggle
  const toggleAll = () => {
    if (seleccionados.length === datos.length) setSeleccionados([]);
    else setSeleccionados(allIds);
  };

  const toggleSeleccion = id => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Abrir modal para confirmar selección
  const procesarSeleccionados = () => {
    if(seleccionados.length == 0){
      acctionSucessful.fire({
        imageUrl: Alerta,
        title: `¡Seleccione al menos 1 item!`
      });
      return
    }
    setModalAbierto(true);
  };

  const handleConfirmRango = async ({ fechaInicio, fechaFin }) => {
    setRangoFechas({ fechaInicio, fechaFin });
  
    if (vista === "/reporte") {
      // Transformar seleccionados (ids) a objetos {id, nombre} usando los datos completos
      const seleccionadosConNombre = seleccionados.map(id => {
        const item = datos.find(d => d.id === id);
        return item ? { id: item.id, nombre: item.nombre || item.name || '' } : { id, nombre: '' };
      });
  
      console.log("Seleccionados con nombre:", seleccionadosConNombre);
  
      const actividades = await obtenerRangoFecha(seleccionadosConNombre, fechaInicio, fechaFin);
      // aquí actividades es según la función, ya ajusta según necesites
    } else if (vista === "/estadistica") {
      navigate(vista, { state: { ids: seleccionados, fechaInicio, fechaFin } });
    }
    else if (vista === "/sensores") {
      const sensores = await reporteSensores(seleccionados, fechaInicio, fechaFin)
    }
  };

  console.log("jojojoj",enableSelection)
  
  return (
    <div className="container mx-auto px-0 pb-4">
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[640px] pr-4 rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-white">
              {encabezados.map((col, idx) => {
                const isAcc = col.key === 'acciones';
                const base = "p-2 md:p-3 text-sm md:text-base border-t border-b border-gray-300 bg-[#00304D] align-middle";
                const sticky = isAcc ? "sticky right-0 z-20" : "";
                const roundedLeft = idx === 0 ? 'rounded-l-full' : '';
                const roundedRight = idx === totalCols - 1 ? 'rounded-r-full' : '';
                const textAlign = col.key === 'seleccionar' ? 'text-center' : 'text-left';
                return (
                  <th
                    key={idx}
                    className={`${base} ${textAlign} ${sticky} ${roundedLeft} ${roundedRight} h-14`}
                    style={isAcc ? { right: '-1rem' } : undefined}
                  >
                    {col.key === 'seleccionar' ? (
                      <input
                        type="checkbox"
                        className="mx-auto rounded-full border-2 align-middle"
                        checked={seleccionados.length === datos.length}
                        onChange={toggleAll}
                      />
                    ) : col.key === 'fotoPerfil' ? (
                      <span />
                    ) : (
                      <div className="flex items-center">
                        {col.icon2 && <img src={col.icon2} alt={col.label} className="mr-2" />}
                        <span>{col.label}</span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {datos.map((fila, ridx) => {
              let colIdx = 0;
              return (
                <tr key={fila.id || ridx}>
                  {enableSelection && (() => {
                    const isFirst = colIdx === 0;
                    const classes = `p-2 md:p-3 text-center border-t border-b border-gray-300 bg-white align-middle ${isFirst ? 'rounded-l-full' : ''}`;
                    colIdx++;
                    return (
                      <td className={classes}>
                        <input
                          type="checkbox"
                          className="align-middle"
                          checked={seleccionados.includes(fila.id)}
                          onChange={() => toggleSeleccion(fila.id)}
                        />
                      </td>
                    );
                  })()}
                  {mostrarFotoPerfil && (() => {
                    const isFirst = colIdx === 0;
                    const isLast = colIdx === totalCols - 1;
                    const classes = `p-2 md:p-3 text-sm md:text-base h-14 border-t border-b border-gray-300 bg-white align-middle ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`;
                    colIdx++;
                    return (
                      <td className={classes}>
                        <img src={getRoleImage(fila.id_rol)} alt="Perfil" className="w-10 h-10 rounded-full" />
                      </td>
                    );
                  })()}
                  {columnasSinFoto.map((col, cidx) => {
                    if (col.key === 'acciones') {
                      const isLast = colIdx === totalCols - 1;
                      const classes = `sticky right-0 z-10 p-2 md:p-3 border-t border-b border-gray-300 bg-white align-middle ${isLast ? 'rounded-r-full' : ''}`;
                      colIdx++;
                      return (
                        <td key={cidx} className={classes} style={{ right: '-1rem' }}>
                          <div className="hidden md:flex gap-2">
                            {acciones(fila)}
                          </div>
                          <div className="flex md:hidden relative">
                            {showAllActions ? (
                              <div className="absolute right-full top-0 bg-white p-2 rounded-md shadow-lg" onClick={e => e.stopPropagation()}>
                                {acciones(fila)}
                                <button onClick={e => { e.stopPropagation(); setShowAllActions(false); }} className="absolute top-1 right-1">
                                  <img src={cerrarMenu} alt="Cerrar" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={e => { e.stopPropagation(); setShowAllActions(true); }}>
                                <img src={DropdownIcon} alt="Acciones" />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    }
                    const isFirst = colIdx === 0;
                    const isLast = colIdx === totalCols - 1;
                    const classes = `p-2 md:p-3 text-left text-sm md:text-base h-14 border-t border-b border-gray-300 bg-white align-middle ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`;
                    colIdx++;
                    return (
                      <td key={cidx} className={classes}>
                        {col.key === '#' ? ridx + 1 : fila[col.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {enableSelection && (
        <div className="flex justify-end mt-2">
          <button
            onClick={procesarSeleccionados}
            className="bg-[#39A900] text-white w-36 flex px-3 py-2 rounded-3xl"
          >
            <img src={Procesar} alt="" srcset="" className="w-6 h-6 mr-1" />
            Procesar
          </button>
        </div>
      )}
      {mostrarAgregar && (
        <div className="w-full sm:w-[60%] mx-auto flex items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 py-2 cursor-pointer hover:shadow-md hover:scale-95 m-3" onClick={onAddUser}>
          <span className="text-[#009E00] text-base font-semibold">Crear</span>
          <div className="ml-2 w-8 h-8 bg-[#009E00] rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">+</span>
          </div>
        </div>
      )}

      <ModalFechaRango
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={handleConfirmRango}
        vista={vista}
      />
    </div>
  );
};

Tabla.propTypes = {
  columnas: PropTypes.array.isRequired,
  datos: PropTypes.array.isRequired,
  acciones: PropTypes.func.isRequired,
  onAddUser: PropTypes.func,
  mostrarAgregar: PropTypes.bool,
  enableSelection: PropTypes.bool,
};

export default Tabla;
