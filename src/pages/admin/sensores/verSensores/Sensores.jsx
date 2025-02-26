import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { getSensoresById, insertarSensor, actualizarSensor, eliminarSensores } from "../../../../services/sensores/ApiSensores";
import { getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";
import Tabla from "../../../../components/Tabla";
import NavBar from "../../../../components/gov/navbar"
import macIcon from "../../../../assets/icons/mac.png";
import nombreIcon from "../../../../assets/icons/nombre.png";
import descripcionIcon from "../../../../assets/icons/descripcion.png";
import estadoIcon from "../../../../assets/icons/estado.png";
import accionesIcon from "../../../../assets/icons/config.png";
import editIcon from "../../../../assets/icons/edit.png";
import verIcon from "../../../../assets/icons/view.png";
import deletIcon from "../../../../assets/icons/delete.png";
import Eliminar from "../../../../assets/icons/Disposal.png"

function Sensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  const [editarSensor, setEditarSensor] = useState({ id: null, nombre: "", descripcion: "" });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const { id, idUser } = useParams();

  const [formData, setFormData] = useState({
    mac: "",
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });

  useEffect(() => {
    getSensoresById(idUser).then(setSensores);
    getUsuarioById(id).then(setUsuario);
    getFincasByIdFincas(idUser).then(setFincas);
  }, [id, idUser]);

  useEffect(() => {
    if (usuario && fincas) {
      setFormData({
        mac: "",
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuario.id,
        idfinca: fincas.id,
      });
    }
  }, [usuario, fincas]);

  const columnas = [
    { key: "#", label: "#" },
    { key: "mac", label: "MAC", icon: macIcon },
    { key: "nombre", label: "Nombre", icon: nombreIcon },
    { key: "descripcion", label: "Descripción", icon: descripcionIcon },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon },
    { key: "acciones", label: "Acciones", icon: accionesIcon },
  ];


  const acciones = (fila) => (
    <div className="flex justify-center gap-2">



      <button onClick={() => abrirModalEditar(fila)} className="group relative">
        <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">


          <img src={editIcon} alt="Editar" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700  text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Editar
        </span>
      </button>


      <button onClick={() => abrirModalEliminar(fila.id)} className="group relative">
        <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">

          <img src={deletIcon} alt="Eliminar" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Eliminar
        </span>
      </button>


      <Link to={`/datos-sensor/${fila.id}`}>
        <button className="group relative">
          <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">

            <img src={verIcon} alt="Ver" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-14 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Ver Datos
          </span>
        </button>
      </Link>
    </div>
  );


  const abrirModalEditar = (sensor) => {
    setEditarSensor(sensor);
    setModalEditarAbierto(true);
  };

  const abrirModalEliminar = (sensor) => {
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

  const HandlEliminarSensor = () => {
    eliminarSensores(sensorAEliminar).then(() => {
      setSensores(sensores.filter(sensor => sensor.id !== sensorAEliminar));
      setModalEliminarAbierto(false);
      acctionSucessful.fire({ icon: "success", title: "Sensor eliminado correctamente" });
    }).catch(console.error);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertarSensor(formData).then((response) => {
      if (response) {
        setSensores([...sensores, response]);
        acctionSucessful.fire({
          icon: "success",
          title: "Sensor agregado correctamente"
        });
        setModalInsertarAbierto(false);
      }
    });
  };

  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarSensor(editarSensor.id, editarSensor).then(() => {
      setSensores(sensores.map(u => u.id === editarSensor.id ? editarSensor : u));
      acctionSucessful.fire({
        icon: "success",
        title: "Sensor editado correctamente"
      });
      setModalEditarAbierto(false);
    });
  };

  const handleChangeEditar = (e) => {
    setEditarSensor({ ...editarSensor, [e.target.name]: e.target.value });

  };

  const handleSwitch = (event, sensorId) => {
    // Actualizar el estado del sensor en la lista de sensores
    setSensores(prevSensores =>
      prevSensores.map(sensor =>
        sensor.id === sensorId ? { ...sensor, estado: event.target.checked } : sensor
      )
    );
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto mt-4">
        <h1 className="text-center text-2xl font-semibold">{usuario.nombre}</h1>
        <h1 className="text-center text-2xl font-semibold">{fincas.nombre}</h1>
        <Tabla columnas={columnas} datos={sensores.map((sensor, index) => ({
          ...sensor, "#": index + 1,
          estado: (
            <div className="flex justify-center items-center">
              <label className="relative flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={sensor.estado} // Se mantiene el estado actual del sensor
                  disabled // Evita que el usuario lo modifique
                  className="sr-only"
                />
                <div className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-blue-500' : ''}`}>
                  <div
                    className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
                  ></div>
                </div>
              </label>
            </div>
          ),
        }))} acciones={acciones} />

        <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-[#005F00] text-white rounded-3xl font-semibold" onClick={() => setModalInsertarAbierto(true)}>
          Agregar Sensor
        </button>

        {modalInsertarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-1/3 p-6">
              <h5 className="text-2xl font-bold mb-4 text-center">Agregar sensor</h5>
              <hr />
              <form onSubmit={handleSubmit}>
                <div className="relative w-full mt-2">
                  <img
                    src={nombreIcon} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="relative w-full mt-2">
                  <img
                    src={descripcionIcon} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    className="w-full bg-[#00304D] text-white font-bold py-3 rounded-full text-lg"
                    onClick={() => setModalInsertarAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="w-full bg-[#009E00] text-white font-bold py-3 rounded-full text-lg">
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {modalEditarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-1/3 p-6">
              <h5 className="text-2xl font-bold mb-4 text-center">Editar sensor</h5>
              <hr />
              <form onSubmit={handleEditarSensor}>
                <div className="relative w-full mt-2">
                  <img
                    src={nombreIcon} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    name="nombre"
                    placeholder="Nombre"
                    value={editarSensor.nombre}
                    type="text"
                    onChange={handleChangeEditar}
                  />
                </div>
                <div className="relative w-full mt-2">
                  <img
                    src={descripcionIcon} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={editarSensor.descripcion}
                    onChange={handleChangeEditar}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    className="w-full bg-[#00304D] text-white font-bold py-3 rounded-full text-lg"
                    onClick={() => setModalEditarAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="w-full bg-[#009E00] text-white font-bold py-3 rounded-full text-lg">
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEliminarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-1/3 p-6">
              <h5 className="text-2xl font-bold mb-4 text-center">Eliminar sensor</h5>
              <hr />
              <form onSubmit={HandlEliminarSensor}>
                <div className="flex justify-center my-4">
                  <div className="bg-[#00304D] p-4 rounded-full">
                    <img
                      src={Eliminar} // Reemplaza con la ruta de tu icono
                      alt="icono"
                    />
                  </div>
                </div>
                <p className="text-lg text-center font-semibold">¿Estás seguro?</p>
                <p className="text-gray-500 text-center text-sm">Se eliminará el sensor de manera permanente.</p>

                <div className="flex justify-between mt-6 space-x-4">
                  <button className="w-full bg-[#00304D] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalEliminarAbierto(false)} >
                    Cancelar
                  </button>
                  <button className="w-full bg-[#009E00] text-white font-bold py-3 rounded-full text-lg" >
                    Eliminar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensores;