//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
//importacion de iconos
import {sensoresIcon,mac,zonasIcon,descripcion,estadoIcon,ajustes,editar,ver,eliminar,sensorAzul,descripcionAzul} from '../../assets/icons/IconsExportation'
// imgs modales
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png"
import usuarioCreado from "../../assets/img/usuarioCreado.png"
//componentes reutilizados
import { acctionSucessful } from "../../components/alertSuccesful";
import MostrarInfo from "../../components/mostrarInfo";
import Navbar from "../../components/navbar";
import FormularioModal from "../../components/modals/FormularioModal";
//endpoints para consumir api
import { getSensoresById, crearSensor, editarSensor, eliminarSensores } from "../../services/sensores/ApiSensores";
import { getFincasByIdFincas, getZonasByIdFinca } from "../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../services/usuarios/ApiUsuarios";
import { insertarDatos } from "../../services/sensores/ApiSensores";
//libreria sweetalert para las alertas
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import { validarSinCambios } from "../../utils/validaciones";

function ActivarSensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [sensorEditar, setsensorEditar] = useState({ id: null, nombre: "", descripcion: "", idzona: null });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [sensorEliminado, setSensorEliminado] = useState();
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [sensorOriginal, setSensorOriginal] = useState(null)
  const { id, idUser } = useParams();
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
  const [estado, setEstado] = useState([]);
  const rol = localStorage.getItem("rol");
  let inputValue = '';
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
    try {
      // Obtiene los sensores por el id de usuario
      getSensoresById(idUser).then(
        (data) => {
          if (data == null) {
            setSensores([]);
            return
          }
          setSensores(data);
          setEstado(data.map(({ id, estado }) => ({ id, estado })))
        }
      );
      // Obtiene el usuario por el id
      getUsuarioById(id).then((data) => {
        setUsuario(data)
      });
      // Obtiene las fincas del usuario
      getFincasByIdFincas(idUser).then((data) => {
        setFincas(data)
      });
      // Obtiene las zonas por el id de finca
      getZonasByIdFinca(idUser).then((data) => {
        if (data == null) {
          setZonas([])
          return
        }
        setZonas(data)
      })
    } catch (error) {
      console.error("Error: ", error);
    }
  }, [id, idUser]);

  // useEffect que se ejecuta cuando cambian el usuario o las fincas
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

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: sensoresIcon },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "idzona", label: "Zona", icon: zonasIcon, icon2: zonasIcon },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon, icon2: estadoIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  // Función para las acciones que se pueden realizar en cada fila de la tabla
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

  // Función para activar o desactivar un sensor según el rol del usuario
  const ActivarSensor = (idRol, sensor, index) => {
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
                className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}>
              </div>
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

  // Función para asignar un nombre de zona al sensor, según el id de la zona
  const asignarZona2 = (id) => {
    const nombre = zonas.find(zonas => zonas.id === id);
    return nombre ? nombre.nombre : "Sin zona";
  }

  // Mapea los sensores y asigna la zona y el estado de cada uno
  const sensoresDeFinca = sensores.map((sensor, index) => ({
    ...sensor, idzona: asignarZona2(sensor.idzona), mac: (sensor.mac ? sensor.mac : "Sin mac"),
    estado: (
      ActivarSensor(rol, sensor, index)
    ),
  }))

  const abrirModalEditar = (sensor) => {
    setsensorEditar(sensor);
    setModalEditarAbierto(true);
    setSensorOriginal(sensor)
  };

  const abrirModalEliminar = (sensor) => {
    const sensorPrev = sensores.find(sensores => sensores.id === sensor) // Encuentra el sensor a eliminar
    setSensorEliminado(sensorPrev)
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

  // Maneja la eliminación de un sensor
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

  // Maneja los cambios de los inputs del formulario
  const handleChange = (e) => {
    // cambia el idzona de string a número entero
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearSensor(formData).then((response) => { // Crea un nuevo sensor
      if (response) {
        if (sensores === null) {
          setSensores([response]);
        }
        else {
          setSensores([...sensores, response]);
        }
        setModalInsertarAbierto(false);
      }
    });
    acctionSucessful.fire({
      imageUrl: usuarioCreado,
      imageAlt: 'Icono personalizado',
      title: `¡Sensor <span style="color: green;">${formData.nombre}</span> creado correctamente!`
    });
  };

  // Maneja el envío del formulario para editar un sensor
  const handleSensorEditar = (e) => {
    e.preventDefault();

    if(!validarSinCambios(sensorEditar,sensorOriginal,"el sensor")) return

    editarSensor(sensorEditar.id, sensorEditar).then((data) => {
      const nuevosSensores = [...sensores]; // Copiar el arreglo de sensores
      const index = nuevosSensores.findIndex(sensor => sensor.id === sensorEditar.id); // Buscar el índice del sensor con el mismo id
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Sensor: <span style="color: #3366CC;">${sensorEditar.nombre}</span> editado correctamente!`
      });
      nuevosSensores[index] = sensorEditar;
      setSensores(nuevosSensores); // Establece los sensores actualizados
    })
    setModalEditarAbierto(false);
  };

  const handleChangeEditar = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setsensorEditar({ ...sensorEditar, [e.target.name]: value }); // Actualiza los datos del sensor editado
  };

  const handleSwitch = async (id, estado, index) => {
    const sensorcito = [...sensores]
    if (estado === true) { // Si el sensor está activo
      const newEstado = !estado; // Si el sensor está activo
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
      const confirmacion = await showSwal();  // Muestra un popup para ingresar la dirección MAC
      if (confirmacion.isConfirmed) {
        const newEstado = !estado;
        const updatedSensores = [...sensores];
        updatedSensores[index].estado = newEstado;

        setSensores(updatedSensores);
        const updatedFormData = {
          id: sensores[index].id,
          mac: inputValue, // Muestra un popup para ingresar la dirección MAC
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
      const newEstado = !estado; // Si el sensor ya tiene dirección MAC, cambia el estado
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
  // Función para abrir el modal de edición con los datos del sensor seleccionado
  const enviarForm = (id) => {
    //se trae el id del sensor de la columna para traerlo y enviarlo como objeto
    const sensorEnviado = sensores.find(sensor => sensor.id === id);
    abrirModalEditar(sensorEnviado);
  }

  // Función para mostrar un popup de confirmación para ingresar la dirección MAC del sensor
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

  const handleVistaChange = (vista) => {
    setVistaActiva(vista); // Establece la vista activa
  };

  // Función para asignar zonas a un formulario
  const asignarZona = (onChange) => {
    if (zonas == null) {
      return (
        <div className="relative w-full mt-2">
          <select id="zonas" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="idzona"
            onChange={onChange}
          >
            <option value="">Seleccionar zona </option>
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
        >
          <option value="">Seleccionar zona </option>
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
      <Navbar />
      <MostrarInfo
        titulo={`Sensores de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={sensoresDeFinca}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

      <FormularioModal
        titulo="Crear Sensor"
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={handleSubmit}
        valores={formData}
        onChange={handleChange}
        textoBoton="Crear"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
        {asignarZona(handleChange)}
      </FormularioModal>

      <FormularioModal
        isOpen={modalEditarAbierto}
        titulo={"Editar Sensor"}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={handleSensorEditar}
        valores={sensorEditar}
        textoBoton="Guardar y actualizar"
        onChange={handleChangeEditar}
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: sensorAzul },
          { name: "descripcion", placeholder: "Descripción", icono: descripcionAzul },
        ]}
      >
        {asignarZona(handleChangeEditar)}
      </FormularioModal>

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={HandleEliminarSensor}
        title="Eliminar Sensor"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>Se eliminará el sensor <strong className="text-red-600">{sensorEliminado?.nombre}</strong> de manera permanente.</h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  )
}

export default ActivarSensores;