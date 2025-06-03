// src/screens/Zonas.jsx
import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useZonas } from "../../../hooks/useZonas"; // nuevo hook
import Navbar from "../../../components/navbar";
import MostrarInfo from "../../../components/mostrarInfo";
import FormularioModal from "../../../components/modals/FormularioModal";
import ConfirmationModal from "../../../components/confirmationModal/confirmationModal";
import { zonasIcon, actividadesIcon, ajustes, editar, eliminar, nombreZona, sensoresIcon } from '../../../assets/icons/IconsExportation';

const Zonas = () => {
  const { idUser, id } = useParams();
  const { state } = useLocation();
  const enableSelectionButton = state?.enableSelectionButton ?? false;
  const vista = state?.vista ?? "";
  const isReporte = vista === "/reporte";

  const {
    fincas, zonas, abrirModalCrear, abrirModalEditar, abrirModalEliminar,
    modalFormularioAbierto, setModalFormularioAbierto, handleSubmitFormulario,
    zonaFormulario, handleChangeZona, modoFormulario,
    modalEliminarAbierto, setModalEliminarAbierto, handleEliminarZona, zonaEliminada
  } = useZonas(id, idUser);

  const tituloMostrar = state?.titulo || `Zonas de la finca: ${fincas?.nombre || "..."}`;

  // Columnas base
  const columnasBase = [
    { key: "nombre", label: "Nombre", icon2: zonasIcon },
    { key: "verSensores", label: "Sensores", icon: sensoresIcon, icon2: sensoresIcon },
    { key: "actividades", label: "Actividades", icon: actividadesIcon, icon2: actividadesIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes }
  ];
  // Filtrar columnas para reporte
  const columnas = isReporte
    ? columnasBase.filter(col => !["verSensores", "acciones"].includes(col.key))
    : columnasBase;

  // Acciones solo si no es reporte
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEditar(fila)}
        >
          <img src={editar} alt="Editar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>

      {fila.nombre !== "Zona general" && (
        <div className="relative group">
          <button
            className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => abrirModalEliminar(fila.id)}
          >
            <img src={eliminar} alt="Eliminar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </div>
      )}
    </div>
  );

  const zonasMapeadas = zonas.map(z => ({
    ...z,
    verSensores: !isReporte ? (
      <Link className="text-[#3366CC] font-bold" to={`/sensoresZonas/${z.id}/${idUser}`}>
        ({z.cantidad_sensores ?? 0}) Ver más...
      </Link>
    ) : undefined,
    actividades: isReporte ? (
      <span className="font-bold">Seleccione para generar reporte</span>
    ) : (
      <Link className="text-[#3366CC] font-bold" to={`/actividadesZonas/${z.id}`}>
        Ver más...
      </Link>
    ),
  }));

  return (
    <div>
      <Navbar />
      <MostrarInfo
        titulo={tituloMostrar}
        columnas={columnas}
        datos={zonasMapeadas}
        onAddUser={abrirModalCrear}
        mostrarAgregar={!isReporte}
        enableSelectionButton={enableSelectionButton}
        {...(!isReporte && { acciones })}
      />

      <FormularioModal
        isOpen={modalFormularioAbierto}
        onClose={() => setModalFormularioAbierto(false)}
        onSubmit={handleSubmitFormulario}
        titulo={modoFormulario === "crear" ? `Crear zona en finca ${fincas.nombre}` : "Editar zona"}
        textoBoton={modoFormulario === "crear" ? "Crear" : "Guardar y actualizar"}
        valores={zonaFormulario}
        onChange={handleChangeZona}
        campos={[{ name: "nombre", placeholder: "Nombre", icono: nombreZona }]}
      />

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarZona}
        title="Eliminar finca"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>
              Se eliminará la zona <strong className="text-red-600">{zonaEliminada?.nombre}</strong> de manera permanente.
            </h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default Zonas;
