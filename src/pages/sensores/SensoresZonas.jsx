//iconos de las columnas
import mac from "../../assets/icons/mac.png";
import descripcion from "../../assets/icons/descripcion.png"
import estado from "../../assets/icons/estado.png"
import nombre from "../../assets/icons/nombres.png"
import ajustes from "../../assets/icons/acciones.png";
//iconos de las acciones
import editar from "../../assets/icons/editar.png";
import ver from "../../assets/icons/ver.png"
import eliminar from "../../assets/icons/eliminar.png";
//iconos de los modales
import nombreZona from "../../assets/icons/usuarioAzul.png";
import descripcionAzul from "../../assets/icons/descripcionAzul.png";
//librerias de alertas
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
//imgs de los modales
import ConfirmarEliminar from "../../assets/img/eliminar.png"
import usuarioCreado from "../../assets/img/usuarioCreado.png"
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png"
//componentes reutilizados
import MostrarInfo from "../../components/mostrarInfo";
import NavBar from "../../components/navbar"
import { acctionSucessful } from "../../components/alertSuccesful";
//endpoints para consumir api
import { crearSensor, editarSensor, eliminarSensores, getSensoresZonasById, insertarDatos } from "../../services/sensores/ApiSensores";
import { getFincasByIdFincas, getZonasById } from "../../services/fincas/ApiFincas"
import { getUsuarioById } from "../../services/usuarios/ApiUsuarios"
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function Sensores() {
  //estados para almacenar el usuario, su finca, los sensores de la finca, los sensores a eliminar o editar y los estados de los modales
  const [sensores, setSensores] = useState([]);
  const [sensorEditar, setsensorEditar] = useState({ id: null, nombre: "", descripcion: "" });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [zonas, setZonas] = useState({})
  const [fincas, setFincas] = useState({})
  const [usuarios, setUsuarios] = useState({})
  const [sensorEliminado, setSensorEliminado] = useState();
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const { id, idUser } = useParams();
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
  const rol = localStorage.getItem('rol');
  let inputValue = '';

  //se declaran los datos de un sensor desactivado por defecto, se traen los sensores y las fincas
  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
    idzona: null
  });

  useEffect(() => {
    getSensoresZonasById(id)
      .then((data) => {
        setSensores(data || []);
      })
    getZonasById(id)
      .then((data) => {
        getFincasByIdFincas(data.idfinca)
          .then((data) => {
            setFincas(data)
          })
        setZonas(data);
      })
    getUsuarioById(idUser)
      .then((data) => {
        setUsuarios(data)
      })
      .catch(error => console.error('Error: ', error));
  }, [id, idUser]);

  useEffect(() => {
    if (usuarios && fincas) {
      setFormData({
        mac: null,
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuarios.id,
        idzona: zonas.id,
        idfinca: fincas.id,
      });
    }
  }, [usuarios, fincas]);

  //se declaran las columnas de la tabla
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estado, icon2: estado },
    { key: "acciones", label: "Acciones", icon2: ajustes },
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
          onClick={() => enviarForm(fila.id)}>
          <img src={editar} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <Link to={`/datos-sensor/${fila.id}`}>
          <button
            className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={ver} alt="Ver" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Datos
            </span>
          </button>
        </Link>
      </div>
      <div className="relative group">
        <button
          className="px-7 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}>
          <img src={eliminar} alt="Eliminar" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </button>
      </div>
    </div>
  );

  //modal para editar, se guarda el sensor traido en el estado de sensorEditar
  const abrirModalEditar = (sensor) => {
    setsensorEditar(sensor);
    setModalEditarAbierto(true);
  };

  //modal para eliminar, se guarda el sensor traido en el estado de sensorAEliminar
  const abrirModalEliminar = (sensor) => {
    const sensorPrev = sensores.find(sensores => sensores.id === sensor)
    setSensorEliminado(sensorPrev)
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

  //accion que ejecutara el modal de eliminar, se eliminara el sensor y se cerrara el modal
  const HandleEliminarSensor = (e) => {
    e.preventDefault();
    eliminarSensores(sensorAEliminar).then(() => {
      setSensores(sensores.filter(sensor => sensor.id !== sensorAEliminar));
      setModalEliminarAbierto(false);
    }).catch(console.error);

    acctionSucessful.fire({
      imageUrl: UsuarioEliminado,
      imageAlt: 'Icono personalizado',
      title: `¡Sensor <span style="color: red;">${sensorEliminado.nombre}</span> eliminado correctamente!`
    });
  };

  //actualiza dinamicamente los datos de un sensor para agregarlo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //accion que ejecuta el modal insertar para crear un nuevo sensor
  const handleSubmit = (e) => {
    e.preventDefault();
    crearSensor(formData).then((response) => {
      if (response) {
        setSensores([...sensores, response]);
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: 'Icono personalizado',
          title: `¡Sensor <span style="color: green;">${formData.nombre}</span> creado correctamente!`
        });
        setModalInsertarAbierto(false);
      }
    });
  };

  //accion que ejecuta el modal editar para actualizar un sensor
  const handlesensorEditar = (e) => {
    e.preventDefault();
    editarSensor(sensorEditar.id, sensorEditar).then((data) => {
      const nuevosSensores = [...sensores]; // Copiar el arreglo de sensores
      const index = nuevosSensores.findIndex(sensor => sensor.id === sensorEditar.id);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Sensor <span style="color: #3366CC;">${sensorEditar.nombre}</span> editado correctamente!`
      });
      nuevosSensores[index] = sensorEditar;
      setSensores(nuevosSensores);
    })
    setModalEditarAbierto(false);
  };

  //ingresa datos de forma dinamica en el estado sensorEditar
  const handleChangeEditar = (e) => {
    setsensorEditar({ ...sensorEditar, [e.target.name]: e.target.value });

  };

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
  };

  const handleSwitch = async (id, estado, index) => {
    const sensorcito = [...sensores]
    if (estado === true) {
      const newEstado = !estado;
      const updatedSensores = [...sensores];
      updatedSensores[index].estado = newEstado;
      setSensores(updatedSensores);

      const updatedFormData = {
        id: sensores[index].id,
        mac: sensores[index].mac,
        nombre: sensores[index].nombre,
        descripcion: sensores[index].descripcion,
        estado: newEstado,
        idusuario: sensores[index].idusuario,
        idzona: sensores[index].idzona,
        idfinca: sensores[index].idfinca,
      };
      editarSensor(sensores[index].id, updatedFormData).then((data) => {
        const nuevosSensores = [...sensores];
        nuevosSensores[index] = updatedFormData;
        setSensores(nuevosSensores);
        insertarDatos(updatedFormData.mac)
      })
    } else if (sensorcito[index].mac === null) {
      const confirmacion = await showSwal();
      if (confirmacion.isConfirmed) {
        const newEstado = !estado;
        const updatedSensores = [...sensores];
        updatedSensores[index].estado = newEstado;

        setSensores(updatedSensores);
        const updatedFormData = {
          id: sensores[index].id,
          mac: inputValue,
          nombre: sensores[index].nombre,
          descripcion: sensores[index].descripcion,
          estado: newEstado,
          idusuario: sensores[index].idusuario,
          idzona: sensores[index].idzona,
          idfinca: sensores[index].idfinca,
        }
        editarSensor(sensores[index].id, updatedFormData).then((data) => {
          const nuevosSensores = [...sensores];
          nuevosSensores[index] = updatedFormData;
          setSensores(nuevosSensores);
          if (updatedFormData.estado === true) {
            insertarDatos(updatedFormData.mac).then((data) => {
            })
          }
        })
        inputValue = '';
      }
    } else {
      const newEstado = !estado;
      const updatedSensores = [...sensores];
      updatedSensores[index].estado = newEstado;

      setSensores(updatedSensores);
      const updatedFormData = {
        id: sensores[index].id,
        mac: updatedSensores[index].mac,
        nombre: sensores[index].nombre,
        descripcion: sensores[index].descripcion,
        estado: newEstado,
        idusuario: sensores[index].idusuario,
        idzona: sensores[index].idzona,
        idfinca: sensores[index].idfinca,
      }
      editarSensor(sensores[index].id, updatedFormData).then((data) => {
        const nuevosSensores = [...sensores];
        nuevosSensores[index] = updatedFormData;
        setSensores(nuevosSensores);
        if (updatedFormData.estado === true) {
          insertarDatos(updatedFormData.mac).then((data) => {
          })
        }
      })
    }
  };

  const showSwal = () => {
    return withReactContent(Swal).fire({
      title: (
        <h5 className="text-2xl font-extrabold mb-4 text-center">
          Ingrese la dirección MAC <br />
          del sensor:
        </h5>
      ),
      input: 'text',
      inputPlaceholder: 'Digite la dirección MAC',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      inputValue,
      preConfirm: () => {
        const value = Swal.getInput()?.value;
        if (!value) {
          Swal.showValidationMessage('¡Este campo es obligatorio!');
          return false;
        }
        inputValue = value;
        return true;
      },
      confirmButtonText: 'Guardar e insertar',
      customClass: {
        popup: 'rounded-3xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-4 my-8 sm:my-12',
        title: 'text-gray-900',
        input: 'flex py-2 border-gray rounded-3xl',
        actions: 'flex justify-center space-x-4 max-w-[454px] mx-auto',
        cancelButton: 'w-[210px] p-3 text-center bg-[#00304D] hover:bg-[#021926] text-white font-bold rounded-full text-lg',
        confirmButton: 'w-[210px] p-3 bg-[#009E00] hover:bg-[#005F00] text-white font-bold rounded-full text-lg',
      },
    });
  };

  const ActivarSensor = (idRol, sensor, index) => {
    console.log("idrol:", idRol)
    if (idRol == "1") {
      return (
        <div className="flex justify-start items-center">
          <label className="relative flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sensor.estado} // Se mantiene el estado actual del sensor
              onChange={() => handleSwitch(sensor.id, sensor.estado, index)}
              className="sr-only" />
            <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-green-500' : 'bg-gray-400'}`}>
              <div
                className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
              ></div>
            </div>
          </label>
        </div>
      )
    } else {
      return (
        <div className="flex justify-start items-center">
          <label className="relative flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              checked={sensor.estado} // Se mantiene el estado actual del sensor
              disabled // Evita que el usuario lo modifique
              className="sr-only" />
            <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-green-500' : 'bg-gray-400'}`}>
              <div
                className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
              ></div>
            </div>
          </label>
        </div>
      )
    }
  }

  return (
    <div>
      <NavBar />
      <MostrarInfo
        titulo={`Sensores de la zona: ${zonas.nombre}`}
        columnas={columnas}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
        datos={sensores.map((sensor, index) => ({
          ...sensor, "#": index + 1,
          estado: (
            ActivarSensor(rol, sensor, index)
          ),
        }))} />

      {/* Modal para Agregar un sensor */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Crear sensor</h5>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mt-2">
                <img src={nombreZona} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={descripcionAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  onChange={handleChange} />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalInsertarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Crear
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
            <form onSubmit={handlesensorEditar}>
              <div className="relative w-full mt-2">
                <img src={nombreZona} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="nombre"
                  placeholder="Nombre"
                  value={sensorEditar.nombre}
                  type="text"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={descripcionAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={sensorEditar.descripcion}
                  onChange={handleChangeEditar} />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEditarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Guardar y actualizar
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
            <form onSubmit={HandleEliminarSensor}>
              <div className="flex justify-center my-4">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-500 text-center text-lg">Se eliminará el sensor <strong className="text-red-600">{sensorEliminado.nombre}</strong> de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}>
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