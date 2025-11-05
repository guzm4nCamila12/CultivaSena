// src/screens/ActivarSensores.jsx
import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
// Componentes reutilizables
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";

import { ReporteSteps, sensoresDriverSteps } from "../../utils/aplicationSteps";
import { useDriverTour } from "../../hooks/useTourDriver";

// Iconos e imágenes
import {
  sensoresIcon,
  mac,
  zonasIcon,
  descripcion,
  estadoIcon,
  ajustes,
  editar,
  ver,
  eliminar,
  sensorAzul,
  descripcionAzul
} from "../../assets/icons/IconsExportation";

// Hooks personalizados
import { useSensores } from "../../hooks/useSensores";
import { usePermisos } from "../../hooks/usePermisos";

//funcion de activación
function ActivarSensor({ sensor, index, rol, isEstadisticaView, cambiarEstadoSensor }) {
  const isAdmin = rol === "1" && !isEstadisticaView;
  const toggleId = isAdmin ? "activarSensor" : "noPoderActivar";

  const handleChange = () => {
    if (isAdmin) cambiarEstadoSensor(sensor, index);
  };

  return (
    <label
      id={toggleId}
      className="relative flex items-center cursor-pointer"
      aria-label={
        isAdmin
          ? "Activar o desactivar sensor"
          : "No puede modificar el estado del sensor"
      }
    >
      <input
        type="checkbox"
        checked={sensor.estado}
        disabled={!isAdmin}
        onChange={handleChange}
        className="sr-only"
      />
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? "bg-[#39A900]" : "bg-gray-400"
          }`}
      >
        <div
          className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? "translate-x-6" : "translate-x-0"
            }`}
        />
      </div>
    </label>
  );
}


function ActivarSensores() {
  const { id, idUser } = useParams();
  const { state } = useLocation();
  const enableSelectionButton = state?.enableSelectionButton ?? false;
  const vista = state?.vista ?? "";
  const isEstadisticaView = ["/estadistica", "/reporte", "/sensores"].includes(vista);

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  const {
    sensores,
    tiposSensores,
    formData,
    handleChange,
    crearNuevoSensor,
    sensorEditar,
    setSensorEditar,
    handleChangeEditar,
    actualizarSensor,
    setSensorAEliminar,
    sensorEliminado,
    setSensorEliminado,
    eliminarSensor,
    cambiarEstadoSensor,
    fincas,
    zonas,
    rol,
    setSensorOriginal,
    modalInsertarAbierto,
    setModalInsertarAbierto,
    modalEditarAbierto,
    setModalEditarAbierto,
  } = useSensores(id, idUser);

  const { permisos } = usePermisos()

  // Tour
  const pasosTour = sensoresDriverSteps.filter(paso => {
    if (paso.element === "#activarSensor") return rol === "1";
    if (paso.element === "#noPoderActivar") return rol !== "1";
    return true;
  });
  const steps = vista === state?.titulo
    ? ReporteSteps
    : pasosTour;

  useDriverTour(steps);

  const tituloMostrar = state?.titulo || `Sensores de la Finca ${fincas?.nombre || "..."}`;

  // Columnas
  const columnasBase = [
    { key: "nombre", label: "Nombre", icon2: sensoresIcon },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "idzona", label: "Zona", icon: zonasIcon, icon2: zonasIcon },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon, icon2: estadoIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes }
  ];
  const columnas = isEstadisticaView
    ? columnasBase.filter(col => col.key !== "acciones")
    : columnasBase;

  // Nombre zona
  const asignarZonaNombre = idZona => {
    const zona = zonas.find(z => z.id === idZona);
    return zona ? zona.nombre : "Sin zona";
  };

  // Lista sensores condicional
  const listaSensores = isEstadisticaView
    ? sensores.filter(s => s.mac && s.mac.trim() !== "")
    : sensores;
  const sensoresFiltrados = listaSensores.map((sensor, index) => ({
    ...sensor,
    idzona: asignarZonaNombre(sensor.idzona),
    mac: sensor.mac || "Sin mac",
    estado: (
      <ActivarSensor
        sensor={sensor}
        index={index}
        rol={rol}
        isEstadisticaView={isEstadisticaView}
        cambiarEstadoSensor={cambiarEstadoSensor}
      />
    ),
  }));

  // Acciones fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      {permisos["editar sensores"]?.tienePermiso && (
        <div id="editarSensor" className="relative group">
          <button
            className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => enviarForm(fila.id)}>
            <img src={editar} alt="Editar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </div>
      )}

      <div id="verDatosSensor" className="relative group">
        <Link to={`/datos-sensor/${fila.id}`}>
          <button className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={ver} alt="Ver" className='absolute' />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Datos
            </span>
          </button>
        </Link>
      </div>
      {permisos["eliminar sensores"]?.tienePermiso && (
        <div id="eliminarSensor" className="relative group">
          <button
            onClick={() => abrirModalEliminar(fila.id)}
            className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={eliminar} alt="Eliminar" className='absolute' />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Eliminar
            </span>
          </button>
        </div>
      )}
    </div>
  );

  const abrirModalEliminar = sensorId => {
    const sensor = sensores.find(s => s.id === sensorId);
    setSensorAEliminar(sensorId);
    setSensorEliminado(sensor);
    setModalEliminarAbierto(true);
  };
  const enviarForm = sensorId => {
    const sensor = sensores.find(s => s.id === sensorId);
    setSensorEditar(sensor);
    setSensorOriginal(sensor);
    setModalEditarAbierto(true);
  };

  const obtenerNombreTipo = (sensorEditar) => {
    const tipo = tiposSensores.find(t => t.id === sensorEditar.tipo_id);
    if (!tipo) return sensorEditar; // Si no se encuentra el tipo, retorna el sensor sin cambios
    return {
      ...sensorEditar,
      tipo_id: tipo.nombre // Reemplazas el ID por el nombre
    };
  }

  // Selects
  const asignarZona = onChange => (
    <div className="relative w-full mt-2">
      <select name="idzona" onChange={onChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl">
        {zonas.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
      </select>
    </div>
  );
  const tipoSensor = onChange => (
    <div className="relative w-full mt-2">
      <select name="tipo_id" onChange={onChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl">
        <option value="">Tipo de sensor</option>
        {tiposSensores.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
      </select>
    </div>
  );

  return (
    <>
      {permisos["ver sensores"]?.tienePermiso && (
        <div>
          <Navbar />
          <MostrarInfo
            titulo={tituloMostrar}
            columnas={columnas}
            datos={sensoresFiltrados}
            acciones={isEstadisticaView ? undefined : acciones}
            onAddUser={() => setModalInsertarAbierto(true)}
            mostrarAgregar={permisos["crear sensores"]?.tienePermiso && !isEstadisticaView}
            enableSelectionButton={enableSelectionButton}
            vista={vista}
          />

          <FormularioModal
            titulo="Crear Sensor"
            isOpen={modalInsertarAbierto}
            onClose={() => setModalInsertarAbierto(false)}
            onSubmit={e => { e.preventDefault(); crearNuevoSensor(); }}
            valores={formData}
            onChange={handleChange}
            textoBoton="Crear"
            campos={[
              { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
              { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul }
            ]}
          >
            {asignarZona(handleChange)}
            {tipoSensor(handleChange)}
          </FormularioModal>

          <FormularioModal
            titulo="Editar Sensor"
            isOpen={modalEditarAbierto}
            onClose={() => setModalEditarAbierto(false)}
            onSubmit={e => { e.preventDefault(); actualizarSensor(); }}
            valores={obtenerNombreTipo(sensorEditar)}
            onChange={handleChangeEditar}
            textoBoton="Guardar y actualizar"
            campos={[
              { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
              { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul }
            ]}
          >
            {asignarZona(handleChangeEditar)}
            {tipoSensor(handleChangeEditar)}
          </FormularioModal>

          <ConfirmationModal
            isOpen={modalEliminarAbierto}
            onCancel={() => setModalEliminarAbierto(false)}
            onConfirm={e => { e.preventDefault(); eliminarSensor(); setModalEliminarAbierto(false); }}
            title="Eliminar Sensor"
            message={
              <>
                ¿Estás seguro?<br />
                <span className="text-gray-400">Se eliminará el sensor <strong className="text-red-600">{sensorEliminado?.nombre}</strong> de manera permanente.</span>
              </>
            }
            confirmText="Sí, eliminar"
          />
        </div>
      )}
    </>
  );
}

ActivarSensor.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nombre: PropTypes.string,
    estado: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  rol: PropTypes.string.isRequired,
  isEstadisticaView: PropTypes.bool.isRequired,
  cambiarEstadoSensor: PropTypes.func.isRequired,
};

export default ActivarSensores;
