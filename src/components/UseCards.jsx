// UserCards.jsx
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as Images from '../assets/img/imagesExportation';
import ModalFechaRango from "./modals/FechaRango";
import { useNavigate } from "react-router-dom";
import { useExportarExcel } from "../hooks/useReportes";
import { acctionSucessful } from "./alertSuccesful";
import { Alerta } from "../assets/img/imagesExportation";
import Procesar from "../assets/icons/procesar.png"

const UserCards = ({ columnas, datos, vista, acciones, onAddUser, mostrarAgregar, enableSelection = false,seleccionados, setSeleccionados
 }) => {
  const [busqueda, setBusqueda] = useState("");
  const [descripcionModal, setDescripcionModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [rangoFechas, setRangoFechas] = useState(null);
  const navigate = useNavigate();
  const { obtenerRangoFecha } = useExportarExcel();
  const { reporteSensores } = useExportarExcel();

  const containerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setIsScrollable(container.scrollHeight > container.clientHeight);
    }
  }, [datos, busqueda]);
  

  const datosFiltrados = datos.filter(fila =>
    columnas.some(col => String(fila[col.key] || "").toLowerCase().includes(busqueda.toLowerCase()))
  );

  const getRoleImage = (role) => {
    switch (role) {
      case "SuperAdmin": return Images.superAdminIcon;
      case "Admin": return Images.adminIcon;
      case "Alterno": return Images.alternoIcon;
      default: return Images.cultivaIcon;
    }
  };

  const handleVerMas = (descripcion) => {
    setDescripcionModal(descripcion);
    setModalOpen(true);
  };
  const handleCerrarModal = () => {
    setModalOpen(false);
    setDescripcionModal("");
  };

  // Selección
  const toggleSeleccion = (id) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const procesarSeleccionados = () => {
    if (seleccionados.length == 0) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        title: `¡Seleccione al menos 1 item!`
      });
      return
    }
    const seleccionData = datosFiltrados.filter(d => seleccionados.includes(d.id));
    setModalAbierto(true)
  };

  const handleConfirmRango = async ({ fechaInicio, fechaFin }) => {
    setRangoFechas({ fechaInicio, fechaFin });

    if (vista === "/reporte") {
      // Transformar seleccionados (ids) a objetos {id, nombre} usando los datos completos
      const seleccionadosConNombre = seleccionados.map(id => {
        const item = datos.find(d => d.id === id);
        return item ? { id: item.id, nombre: item.nombre || item.name || '' } : { id, nombre: '' };
      });

      const actividades = await obtenerRangoFecha(seleccionadosConNombre, fechaInicio, fechaFin);
      // aquí actividades es según la función, ya ajusta según necesites
    } else if (vista === "/estadistica") {
      navigate(vista, { state: { ids: seleccionados, fechaInicio, fechaFin } });
    } else if (vista === "/sensores") {
      const sensores = await reporteSensores(seleccionados, fechaInicio, fechaFin)
    }
  };

  return (
    <div className="">

      {enableSelection && (
        <div className="flex justify-end mb-2">
          <button
            onClick={procesarSeleccionados}
            className="bg-[#39A900] justify-center hover:bg-[#005F00] shadow-lg  flex rounded-3xl text-white px-3 w-36 py-2"
          >
            <img src={Procesar} alt="" className="w-6 h-6 mr-1" />
            Procesar</button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full mx-auto overflow-y-auto max-h-[710px] grid gap-4 pb-1 ${datosFiltrados.length === 0 ? 'grid-cols-1 place-items-center' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} ${isScrollable ? 'sm:pr-4' : 'pr-0'}`}
      >
        {datosFiltrados.length === 0 ? (
          mostrarAgregar ? (
            <div onClick={onAddUser} className="w-full h-52 flex flex-col items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] cursor-pointer hover:scale-95">
              <span className="text-[#009E00] text-2xl font-semibold">Crear</span>
              <div className="w-12 h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-3">
                <span className="text-white text-3xl font-bold">+</span>
              </div>
            </div>
          ) : <p className="text-center text-gray-500 col-span-full">No hay datos.</p>
        ) : (
          <>
            {mostrarAgregar && (
              <div id="crearSteps" onClick={onAddUser} className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 sm:px-6 py-2 sm:py-6 cursor-pointer hover:scale-95">
                <span className="text-[#009E00] text-base sm:text-2xl font-semibold">Crear</span>
                <div className="ml-2 sm:ml-0 w-8 sm:w-12 h-8 sm:h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-0 sm:mt-2">
                  <span className="text-white text-xl sm:text-3xl font-bold">+</span>
                </div>
              </div>
            )}

            {datosFiltrados.map((fila, idx) => (
              <div key={fila.id || idx} onClick={() => toggleSeleccion(fila.id)} className="cursor-pointer relative bg-white shadow-md rounded-[36px] overflow-hidden flex flex-col transition hover:scale-95">
                {enableSelection && (
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(fila.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSeleccion(fila.id)}
                    className="absolute top-5 accent-[#39A900] left-5 w-5 h-5 cursor-pointer rounded-full "
                  />
                )}
                <div className="bg-[#00304D] text-white text-xl p-4 font-semibold text-center">
                  {fila.nombre || `Dato ${idx + 1}`}
                </div>
                <div className="p-4 flex flex-col gap-1">
                  {columnas.filter(c => !['acciones', '#', 'nombre', 'fotoPerfil'].includes(c.key)).map((col, i) => (
                    <div key={i} className="text-sm flex items-center">
                      {col.icon && <img src={col.icon} alt={col.label} className="mr-2" />}
                      <strong>{col.label}:</strong>
                      <span className="ml-1">
                        {col.key === 'descripcion' && fila[col.key]?.length > 0 ? (
                          <button onClick={() => handleVerMas(fila[col.key])} className="text-blue-500">Ver todo</button>
                        ) : fila[col.key]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <img src={getRoleImage(fila.id_rol)} alt="Perfil" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                </div>
                <hr />
                <div className="flex items-center justify-center p-3">
                  {acciones && acciones(fila)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-5 mx-4">
            <h5 className="text-2xl font-bold mb-1 text-center">Descripción</h5>
            <hr />
            <p className="text-xl text-center mt-2 font-normal">{descripcionModal}</p>
            <button onClick={handleCerrarModal} className="mt-4 w-full bg-[#00304D] text-white py-2 rounded-full">Cerrar</button>
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

UserCards.propTypes = {
  columnas: PropTypes.array.isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func,
  onAddUser: PropTypes.func.isRequired,
  mostrarAgregar: PropTypes.bool,
  enableSelection: PropTypes.bool,
};

export default UserCards;