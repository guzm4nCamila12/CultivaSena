// Tabla.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as Images from "../assets/img/imagesExportation";
import DropdownIcon from "../assets/icons/accionesMenu.png";
import cerrarMenu from "../assets/icons/cerrarMenu.png";
import ModalFechaRango from "./modals/FechaRango";
import { useNavigate } from "react-router-dom";
import { useExportarExcel } from "../hooks/useReportes";
import { acctionSucessful } from "./alertSuccesful";
import { Alerta } from "../assets/img/imagesExportation";

const getRoleImage = (role) => {
  switch (role) {
    case "SuperAdmin": return Images.superAdminIcon;
    case "Admin": return Images.adminIcon;
    case "Alterno": return Images.alternoIcon;
    default: return Images.adminIcon;
  }
};

const Tabla = ({
  columnas,
  datos,
  acciones,
  onAddUser,
  mostrarAgregar,
  enableSelection = false,
  vista,
  colorEncabezado = "#00304D",
  colorTextoEncabezado = "#FFFFFF",
  seleccionados,
  setSeleccionados
}) => {
  const [showAllActions, setShowAllActions] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
  const { obtenerRangoFecha, reporteSensores } = useExportarExcel();

  const allIds = datos.map((fila) => fila.id);
  const mostrarFotoPerfil = columnas.some((col) => col.key === "fotoPerfil");
  const columnasSinFoto = columnas.filter((col) => col.key !== "fotoPerfil");

  // Escuchar evento global de procesar
  useEffect(() => {
    window.addEventListener('procesarSeleccionados', procesarSeleccionados);
    return () => window.removeEventListener('procesarSeleccionados', procesarSeleccionados);
  }, [seleccionados, datos]);

  // Construcción de encabezados
  const encabezados = [];
  if (enableSelection) encabezados.push({ key: 'seleccionar', label: '' });
  if (mostrarFotoPerfil) encabezados.push({ key: 'fotoPerfil', label: '' });
  encabezados.push(...columnasSinFoto);

  // Toggle selección
  const toggleAll = () => {
    if (seleccionados.length === datos.length) setSeleccionados([]);
    else setSeleccionados(allIds);
  };
  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Procesar seleccionados (invocado por evento)
  function procesarSeleccionados() {
    if (seleccionados.length === 0) {
      acctionSucessful.fire({ imageUrl: Alerta, title: `¡Seleccione al menos 1 item!` });
      return;
    }
    setModalAbierto(true);
  }

  const handleConfirmRango = async ({ fechaInicio, fechaFin }) => {
    if (vista === "/reporte") {
      const seleccionadosConNombre = seleccionados.map(id => {
        const item = datos.find(d => d.id === id);
        return item ? { id: item.id, nombre: item.nombre || item.name || '' } : { id, nombre: '' };
      });
      await obtenerRangoFecha(seleccionadosConNombre, fechaInicio, fechaFin);
    } else if (vista === "/estadistica") {
      navigate(vista, { state: { ids: seleccionados, fechaInicio, fechaFin } });
    } else if (vista === "/sensores") {
      await reporteSensores(seleccionados, fechaInicio, fechaFin);
    }
    setModalAbierto(false);
  };

  return (
    <div className="pb-4 w-full min-h-full h-auto max-h-[640px] flex flex-col">
      <div className="w-full overflow-x-auto overflow-y-auto h-auto rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-4 h-auto">
        <thead>
            <tr className="text-white">
              {encabezados.map((col, idx) => {
                const isAcc = col.key === 'acciones';
                const base = "p-2 md:p-3 text-left text-sm md:text-base border-t border-b border-gray-300 bg-[#00304D]";
                let roundedL = '';
                if (enableSelection) {
                  if (col.key === 'seleccionar') roundedL = 'rounded-l-full';
                } else {
                  if (mostrarFotoPerfil && col.key === 'fotoPerfil') roundedL = 'rounded-l-full px-7';
                  else if (!mostrarFotoPerfil && ['nombre','cultivo','#', 'operacion', 'finca_nombre','zona'].includes(col.key)) roundedL = 'rounded-l-full';
                }
                const roundedR = idx === encabezados.length - 1 ? ' rounded-r-full' : '';
                const sticky = isAcc ? 'sticky right-0 z-20' : '';

                return (
                  <th
                    key={idx}
                    className={`${base} ${roundedL}${roundedR} ${sticky} `}
                    style={{ color: colorTextoEncabezado, backgroundColor: colorEncabezado, ...(isAcc && { right: '-1rem' }) }}
                  >
                    <div className="flex items-center">
                      {col.key === 'seleccionar' ? (
                        <input
                          id="seleccionarTodoSteps"
                          type="checkbox"
                          title="Seleccionar todos"
                          checked={seleccionados.length === datos.length}
                          onChange={toggleAll}
                          className="mx-auto cursor-pointer bg-white accent-[#39A900] rounded-full border-2"
                        />
                      ) : (
                        <>
                          {/* Si es columna de acciones, mostramos el label siempre en pantallas md+ */}
                          {col.icon2 && <img src={col.icon2} alt={col.label} className="mr-2" />}
                          {isAcc ? (
                            <>
                              <span className="hidden md:inline">{col.label}</span>
                              <span className="md:hidden">{showAllActions ? col.label : ''}</span>
                            </>
                          ) : (
                            <span className="pr-4">{col.label}</span>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? datos.map((fila, rowIndex) => {
              let colIndex = 0;
              return (
                <tr key={fila.id || rowIndex}>
                  {enableSelection && (() => { colIndex++; return (
                    <td className="p-2 md:p-3 text-center border-t border-b border-gray-300 bg-white align-middle rounded-l-full">
                      <input id="checkboxSteps" type="checkbox" className="cursor-pointer accent-[#39A900]" checked={seleccionados.includes(fila.id)} onChange={() => toggleSeleccion(fila.id)} />
                    </td>
                  ); })()}

                  {/* Foto Perfil */}
                  {mostrarFotoPerfil && (() => {
                    colIndex++;
                    const isFirst = colIndex === 1;
                    const isLast = colIndex === encabezados.length;
                    return (
                      <td className={`rounded-l-full p-2 md:p-3 text-sm md:text-base h-14 border-t border-b border-gray-300 bg-white w-16 ${isLast ? 'rounded-r-full' : ''}`}> 
                        <img src={getRoleImage(fila.id_rol)} alt="Perfil" className="w-10 h-10 rounded-full mx-auto" />
                      </td>
                    );
                  })()}

                  {/* Celdas Sin Foto */}
                  {columnasSinFoto.map((columna, cidx) => {
                    
                    const isAcciones = columna.key === 'acciones';
                    let borderL = enableSelection? 'rounded-l-none' : !mostrarFotoPerfil && ['nombre','cultivo','#', 'operacion', 'finca_nombre','zona'].includes(columna.key) ? 'rounded-l-full' : '';
                    let borderR = cidx === columnasSinFoto.length - 1 ? ' rounded-r-full' : '';
                    colIndex++;
                    if (isAcciones) {
                      return (
                        <td
                          key={cidx}
                          className={`sticky  lg:static right-0 z-50 p-2 md:p-3 text-left text-sm md:text-base h-14 border-t border-b border-gray-300 bg-white ${borderL}${borderR}`}
                          style={{ right: '-1rem' }}
                        >
                          <div className="hidden md:flex justify-start gap-2">
                            {acciones(fila)}
                          </div>
                          <div className="flex md:hidden relative justify-start">
                            {showAllActions ? (
                              <div
                                className="right-full top-0 z-50 flex flex-row items-start gap-6 w-56 p-2 bg-white rounded-md"
                                onClick={e => e.stopPropagation()}
                                style={{ boxShadow: '-3px 0px 0px rgba(0,0,0,0.15)' }}
                              >
                                {acciones(fila)}
                                <button onClick={e => { e.stopPropagation(); setShowAllActions(false); }} className="absolute right-0">
                                  <img src={cerrarMenu} alt="Cerrar" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={e => { e.stopPropagation(); setShowAllActions(true); }} className="rounded-full text-white ">
                                <img src={DropdownIcon} alt="Desplegar acciones" className="mr-14" />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={cidx} className={`p-2 md:p-3 text-left text-sm md:text-base h-14 border-t border-b border-gray-300 bg-white ${borderL}${borderR}`}> 
                        {columna.key === '#' ? rowIndex + 1 : fila[columna.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            }) : (
              <tr><td colSpan={encabezados.length} className="text-center p-4 text-sm">No hay datos</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {mostrarAgregar && (
        <div id="crearSteps" onClick={onAddUser} className="w-full sm:w-[60%] mx-auto flex items-center justify-center bg-[#009E00]/10 border-dashed border-2 border-green-500 rounded-[36px] px-4 py-2 cursor-pointer hover:shadow-md hover:scale-95 m-3">
          <span className="text-[#009E00] text-base font-semibold">Crear</span>
          <div className="ml-2 w-8 h-8 bg-[#009E00] rounded-full flex items-center justify-center"><span className="text-white text-2xl font-bold">+</span></div>
        </div>
      )}
      <ModalFechaRango isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onConfirm={handleConfirmRango} vista={vista} />
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
  colorEncabezado: PropTypes.string,
};

export default Tabla;
