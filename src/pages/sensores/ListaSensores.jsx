import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

// Componentes reutilizables
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";

// Iconos e imágenes
import {
  sensoresIcon, mac, zonasIcon, descripcion, estadoIcon, ajustes,
  editar, ver, eliminar, sensorAzul, descripcionAzul
} from '../../assets/icons/IconsExportation';

// Hooks personalizados
import { useSensores } from "../../hooks/useSensores";

function ActivarSensores() {
  const { id, idUser } = useParams();
  const { state } = useLocation();
  const enableSelectionButton = state?.enableSelectionButton ?? false;
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  const {
    sensores, tiposSensores, formData, handleChange, crearNuevoSensor,
    sensorEditar, setSensorEditar, handleChangeEditar,
    actualizarSensor, setSensorAEliminar, setSensorEliminado,
    eliminarSensor, cambiarEstadoSensor,
    fincas, zonas, rol, setSensorOriginal
  } = useSensores(id, idUser);

  console.log("Sensores:", sensores);
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: sensoresIcon },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "idzona", label: "Zona", icon: zonasIcon, icon2: zonasIcon },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon, icon2: estadoIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  const asignarZonaNombre = (id) => {
    const zona = zonas.find(z => z.id === id);
    return zona ? zona.nombre : "Sin zona";
  };

  const ActivarSensor = (sensor, index) => {
    return (
      <label className="relative flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={sensor.estado}
          disabled={rol !== "1"}
          onChange={() => rol === "1" && cambiarEstadoSensor(sensor, index)}
          className="sr-only"
        />
        <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-green-500' : 'bg-gray-400'}`}>
          <div className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </label>
    );
  };

  const sensoresDeFinca = sensores.map((sensor, index) => ({
    ...sensor,
    idzona: asignarZonaNombre(sensor.idzona),
    mac: sensor.mac || "Sin mac",
    estado: ActivarSensor(sensor, index),
  }));

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <button
          className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => enviarForm(fila.id)}>
          <img src={editar} alt="Editar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>

      <div className="relative group">
        <Link to={`/datos-sensor/${fila.id}`}>
          <button className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={ver} alt="Ver" className='absolute' />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Datos
            </span>
          </button>
        </Link>
      </div>

      <div className="relative group">
        <button
          onClick={() => abrirModalEliminar(fila.id)}
          className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={eliminar} alt="Eliminar" className='absolute' />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </button>
      </div>
    </div>
  );

  const abrirModalEliminar = (sensorId) => {
    const sensor = sensores.find(s => s.id === sensorId);
    setSensorAEliminar(sensorId);
    setSensorEliminado(sensor);
    setModalEliminarAbierto(true);
  };

  const enviarForm = (id) => {
    const sensor = sensores.find(s => s.id === id);
    setSensorEditar(sensor);
    setSensorOriginal(sensor);
    setModalEditarAbierto(true);
  };

  const asignarZona = (onChange) => (
    <div className="relative w-full mt-2">
      <select name="idzona" onChange={onChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl">
        
        {zonas.map((zona) => (
          <option key={zona.id} value={zona.id}>{zona.nombre}</option>
        ))}
      </select>
    </div>
  );

  const tipoSensor = (onChange) => (
    <div className="relative w-full mt-2">
      <select name="tipo_id" onChange={onChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl">
        <option value="">Tipo de sensor</option>

        {tiposSensores.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <Navbar />
      <MostrarInfo
        titulo={`Sensores de la finca: ${fincas?.nombre || "..."}`}
        columnas={columnas}
        datos={sensoresDeFinca}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
        enableSelectionButton={enableSelectionButton}
      />

      <FormularioModal
        titulo="Crear Sensor"
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={(e) => { e.preventDefault(); crearNuevoSensor(); setModalInsertarAbierto(false); }}
        valores={formData}
        onChange={handleChange}
        textoBoton="Crear"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
        {asignarZona(handleChange)}
        {tipoSensor(handleChange)}
      </FormularioModal>

      <FormularioModal
        titulo="Editar Sensor"
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={(e) => { e.preventDefault(); actualizarSensor(); setModalEditarAbierto(false); }}
        valores={sensorEditar}
        onChange={handleChangeEditar}
        textoBoton="Guardar y actualizar"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
        {asignarZona(handleChangeEditar)}
        {tipoSensor(handleChangeEditar)}
      </FormularioModal>

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={(e) => { e.preventDefault(); eliminarSensor(); setModalEliminarAbierto(false); }}
        title="Eliminar Sensor"
        message={
          <>
            ¿Estás seguro?<br />
            <span className='text-gray-400'>Se eliminará el sensor <strong className="text-red-600">{sensorEditar?.nombre}</strong> de manera permanente.</span>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
}

export default ActivarSensores;