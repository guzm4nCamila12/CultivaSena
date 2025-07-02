//importaciones necesarias de react
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { sensoresIcon, mac, descripcion, estadoIcon, ajustes, ver, editar, eliminar, descripcionAzul, sensorAzul } from '../../assets/icons/IconsExportation'
//componentes reutilizados
import MostrarInfo from "../../components/mostrarInfo";
import NavBar from "../../components/navbar"
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import { useSensores } from "../../hooks/useSensores";

import { sensoresDriverSteps } from "../../utils/aplicationSteps";
import { useDriverTour } from "../../hooks/useTourDriver";

function Sensores() {
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const { id, idUser } = useParams();

  const {
    sensoresZona, tiposSensores, formData, handleChange, crearNuevoSensor,
    sensorEditar, setSensorEditar, handleChangeEditar,
    actualizarSensor, setSensorAEliminar, setSensorEliminado,
    eliminarSensor, cambiarEstadoSensor,
    zona, rol, setSensorOriginal,
    modalInsertarAbierto,
    setModalInsertarAbierto,
    modalEditarAbierto,
    setModalEditarAbierto,
  } = useSensores(id, idUser);

  const pasosTour = sensoresDriverSteps.filter(paso => {
      if (paso.element === "#activarSensor") return rol === "1";
      if (paso.element === "#noPoderActivar") return rol !== "1";
      return true; // conservar todos los demás pasos
    });
    
    useDriverTour(pasosTour);

  //se declaran las columnas de la tabla
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: sensoresIcon },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon, icon2: estadoIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  //se trae el id del sensor para traerlo y editarlo
  const enviarForm = (id) => {
    //se trae el id del sensor de la columna para traerlo y enviarlo como objeto
    const sensorEnviado = sensoresZona.find(sensor => sensor.id === id);
    setSensorEditar(sensorEnviado);
    setSensorOriginal(sensorEnviado);
    setModalEditarAbierto(true);
    // abrirModalEditar(sensorEnviado);
  }

  //se declaran las acciones de la tabla
  const acciones = (fila) => (
    rol !== "3" ? (
      <div className="flex justify-center gap-4">
        <div id="editarSensor" className="relative group">
          <button
            className="px-7 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => enviarForm(fila.id)}>
            <img src={editar} alt="Editar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </div>
        <div id="verDatosSensor" className="relative group">
          <Link to={`/datos-sensor/${fila.id}`}>
            <button
              className="px-7 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
              <img src={ver} alt="Ver" className='absolute' />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver Datos
              </span>
            </button>
          </Link>
        </div>
        <div id="eliminarSensor" className="relative group">
          <button
            className="px-7 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => abrirModalEliminar(fila.id)}>
            <img src={eliminar} alt="Eliminar" className='absolute' />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Eliminar
            </span>
          </button>
        </div>
      </div>
    ) : (
      <div className="flex justify-center gap-4">
        <div className="relative group">
          <Link to={`/datos-sensor/${fila.id}`}>
            <button
              className="px-7 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
              <img src={ver} alt="Ver" className='absolute' />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver Datos
              </span>
            </button>
          </Link>
        </div>

      </div>
    )

  );

  const ActivarSensor = (sensor, index) => {
    return (
      <label id={rol === "1" ? 'activarSensor' : 'noPoderActivar'} className="relative flex items-center cursor-pointer">
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

  //modal para eliminar, se guarda el sensor traido en el estado de sensorAEliminar
  const abrirModalEliminar = (sensor) => {
    const sensorPrev = sensoresZona.find(sensores => sensores.id === sensor)
    setSensorEliminado(sensorPrev)
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

  const agregar = rol !== "3";

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
      <NavBar />

      <MostrarInfo
        titulo={`Sensores de la Zona ${zona.nombre}`}
        columnas={columnas}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={agregar}
        datos={sensoresZona.map((sensor, index) => ({
          ...sensor,
          estado: (
            ActivarSensor(sensor, index)
          ),
        }))} />

      <FormularioModal
        titulo="Crear Sensor"
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={(e) => { e.preventDefault(); crearNuevoSensor();  }}
        valores={formData}
        onChange={handleChange}
        textoBoton="Crear"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
        {tipoSensor(handleChange)}

      </FormularioModal>




      <FormularioModal
        titulo="Editar Sensor"
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={(e) => { e.preventDefault(); actualizarSensor();  }}
        valores={sensorEditar}
        onChange={handleChangeEditar}
        textoBoton="Guardar y actualizar"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
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

export default Sensores;