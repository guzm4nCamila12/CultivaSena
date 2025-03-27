//iconos de las columnas
import macBlue from "../../../../assets/icons/macBlue.png";
import descripcionBlue from "../../../../assets/icons/descripcionBlue.png";
import estadoBlue from "../../../../assets/icons/estadoBlue.png"
//iconos de las acciones
import editWhite from "../../../../assets/icons/editWhite.png";
import viewWhite from "../../../../assets/icons/viewWhite.png"
import deletWhite from "../../../../assets/icons/deleteWhite.png";
//iconos de los modales
import userGray from "../../../../assets/icons/userGray.png";
import descripcionGray from "../../../../assets/icons/descripcionWhite.png";
import sensorWhite from "../../../../assets/icons/sensorWhite.png"
//imgs de los modales
import ConfirmarEliminar from "../../../../assets/img/Eliminar.png"
import usuarioCreado from "../../../../assets/img/UsuarioCreado.png"
import UsuarioEliminado from "../../../../assets/img/UsuarioEliminado.png"
//componentes reutilizados
import Tabla from "../../../../components/Tabla";
import MostrarInfo from "../../../../components/mostrarInfo";
import UserCards from "../../../../components/UseCards";
import Opcion from "../../../../components/Opcion";
import NavBar from "../../../../components/navbar"
import { acctionSucessful } from "../../../../components/alertSuccesful";

//endpoints para consumir api
import { getSensoresById, insertarSensor, actualizarSensor, eliminarSensores } from "../../../../services/sensores/ApiSensores";
import { getFincasByIdFincas, getZonasByIdFinca } from "../../../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function Sensores() {
  //estados para almacenar el usuario, su finca, los sensores de la finca, los sensores a eliminar o editar y los estados de los modales
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);

  const [usuario, setUsuario] = useState({});
  const [editarSensor, setEditarSensor] = useState({ id: null, nombre: "", descripcion: "" });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const { id, idUser } = useParams();
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");

  //se declaran los datos de un sensor desactivado por defecto, se traen los sensores y las fincas
  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idzona: null,
    idfinca: "",
  });

  useEffect(() => {
    getSensoresById(idUser).then(
      (data) => {
        if (data == null) {
          setSensores([]);
          return
        }
        setSensores(data);
      }
    );
    getUsuarioById(id).then(setUsuario);
    getFincasByIdFincas(idUser).then(setFincas);
    getZonasByIdFinca(idUser).then((data) => {

      setZonas(data)
    })
  }, [id, idUser]);

  //si se traen los datos del usuario y la finca, se utilizan los ID de estos como valores por defecto para los sensores
  useEffect(() => {
    if (usuario && fincas) {
      setFormData({
        mac: null,
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuario.id,
        idzona: null,
        idfinca: fincas.id,
      });
    }
  }, [usuario, fincas]);

  //se declaran las columnas de la tabla
  const columnas = [
    { key: "nombre", label: "Nombre" },
    { key: "mac", label: "MAC", icon: macBlue },
    { key: "idzona", label: "Zona" },
    { key: "descripcion", label: "Descripción", icon: descripcionBlue },
    { key: "estado", label: "Inactivo/Activo", icon: estadoBlue },
    { key: "acciones", label: "Acciones" },
  ];

  //se trae el id del sensor para traerlo y editarlo
  const enviarForm = (id) => {
    //se trae el id del sensor de la columna para traerlo y enviarlo como objeto
    const sensorEnviado = sensores.find(sensor => sensor.id === id);
    abrirModalEditar(sensorEnviado);
  }

  //se declaran las acciones de la tabla
  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <button
          className="px-7 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => enviarForm(fila.id)}
        >
          <img src={editWhite} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <Link to={`/datos-sensor/${fila.id}`}>
          <button
            className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={viewWhite} alt="Ver" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Datos
            </span>
          </button>
        </Link>
      </div>
      <div className="relative group">
        <button
          className="px-7 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}
        >
          <img src={deletWhite} alt="Eliminar" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </button>
      </div>
    </div>
  );

  //modal para editar, se guarda el sensor traido en el estado de editarSensor
  const abrirModalEditar = (sensor) => {
    setEditarSensor(sensor);
    setModalEditarAbierto(true);
  };

  //modal para eliminar, se guarda el sensor traido en el estado de sensorAEliminar
  const abrirModalEliminar = (sensor) => {
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

  //accion que ejecutara el modal de eliminar, se eliminara el sensor y se cerrara el modal
  const HandlEliminarSensor = (e) => {
    e.preventDefault();
    eliminarSensores(sensorAEliminar).then(() => {
      setSensores(sensores.filter(sensor => sensor.id !== sensorAEliminar));
      setModalEliminarAbierto(false);
    }).catch(console.error);
    acctionSucessful.fire({
      imageUrl: UsuarioEliminado,
      imageAlt: 'Icono personalizado',
      title: "¡Sensor eliminado correctamente!"
    });
  };

  //actualiza dinamicamente los datos de un sensor para agregarlo
  const handleChange = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };


  //accion que ejecuta el modal insertar para crear un nuevo sensor
  const handleSubmit = (e) => {
    e.preventDefault();
    insertarSensor(formData).then((response) => {
      if (response) {
        setSensores([...sensores, response]);
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: 'Icono personalizado',
          title: "¡Sensor agregado correctamente!"
        });
        setModalInsertarAbierto(false);
      }
    });
  };

  //accion que ejecuta el modal editar para actualizar un sensor
  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarSensor(editarSensor.id, editarSensor).then((data) => {
      const nuevosSensores = [...sensores]; // Copiar el arreglo de sensores
      const index = nuevosSensores.findIndex(sensor => sensor.id === editarSensor.id);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "¡Sensor editado correctamente!"
      });

      nuevosSensores[index] = editarSensor;

      setSensores(nuevosSensores);
    })
    setModalEditarAbierto(false);
  };

  //ingresa datos de forma dinamica en el estado EditarSensor
  const handleChangeEditar = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setEditarSensor({ ...editarSensor, [e.target.name]: value });
  };

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
  };

  const asignarZona2 = (id) => {

    const nombre = zonas.find(zonas => zonas.id === id);
    return nombre ? nombre.nombre : "Sin zona";

    
  }

  const asignarZona = (onChange) => {
    if (zonas == null) {
      return (
        <div className="relative w-full mt-2">
          <select id="zonas" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="idzona"
            onChange={onChange}
            required
          >
            <option value="">seleccionar zona </option>
            <option value=""> Sin zona </option>

          </select>
        </div>

      )
    }

    return (
      <div className="relative w-full mt-2">
        <select id="zonas" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
          name="idzona"
          onChange={onChange}
          required
        >
          <option value="">seleccionar zona </option>
          <option value=""> Sin zona </option>
          {zonas.map((zona) => (
            <option key={zona.id} value={zona.id}>
              {zona.nombre}

            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      {/* Se renderiza la vista según lo que traiga en localStorage:
                Si vistaActiva es "tabla", se muestra el componente Tabla;
                de lo contrario, se muestra UserCards */}
      <MostrarInfo
        titulo={`Sensores de la finca: ${fincas.nombre}`}
        columnas={columnas}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
        datos={sensores.map((sensor, index) => ({
          ...sensor, idzona: asignarZona2(sensor.idzona),
          estado: (
            <div className="flex justify-start items-center">
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
        }))}
      />


      {/* Modal para Agregar un sensor */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Agregar sensor</h5>
            <hr />
            <form onSubmit={handleSubmit}>

            {asignarZona(handleChange)}

              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                <img src={descripcionGray} alt="icono" className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalInsertarAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar un sensor*/}
      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Editar sensor</h5>
            <hr />
            <form onSubmit={handleEditarSensor}>
              <div className="relative w-full mt-2">
                <select id="zonas" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="idzona"
                  onChange={handleChangeEditar}
                  required
                >
                  <option value="">seleccionar zona </option>
                  <option value=""> Sin zona </option>
                  {zonas.map((zona) => (
                    console.log('Zona:', zona),
                    <option key={zona.id} value={zona.id}>
                      {zona.nombre}

                    </option>
                  ))}
                </select>
              </div>
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                <img src={descripcionGray} alt="icono" className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Eliminar un sensor*/}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar sensor</h5>
            <hr />
            <form onSubmit={HandlEliminarSensor}>
              <div className="flex justify-center my-4">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-500 text-center text-lg">Se eliminará el sensor de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Sí, eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sensores;