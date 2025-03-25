import descripcionBlue from "../../../assets/icons/descripcionBlue.png"
import macBlue from "../../../assets/icons/macBlue.png";
import estadoBlue from "../../../assets/icons/estadoBlue.png";
//icons de las acciones
import editWhite from "../../../assets/icons/editWhite.png"
import viewWhite from "../../../assets/icons/viewWhite.png"
import deleteWhite from "../../../assets/icons/deleteWhite.png"
//icons de los modales
import userGray from "../../../assets/icons/userGray.png";
import descripcionWhite from "../../../assets/icons/descripcionWhite.png";
import sensorWhite from "../../../assets/icons/sensorWhite.png"
// imgs modales
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png"
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
//componentes reutilizados
import { acctionSucessful } from "../../../components/alertSuccesful";
import MostrarInfo from "../../../components/mostrarInfo";
import Navbar from "../../../components/navbar";//endpoints para consumir api
import { getSensoresById, insertarSensor, actualizarSensor, eliminarSensores } from "../../../services/sensores/ApiSensores";
import { getFincasByIdFincas, getZonasByIdFinca } from "../../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../../services/usuarios/ApiUsuarios";
//libreria sweetalert para las alertas
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { insertarDatos } from "../../../services/sensores/ApiSensores";

function ActivarSensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [editarSensor, setEditarSensor] = useState({ id: null, nombre: "", descripcion: "", idzona: null });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const { id, idUser } = useParams();
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
  const [estado, setEstado] = useState([]);
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
  console.log(formData)

  useEffect(() => {
    try {
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
      getUsuarioById(id).then((data) => {
        setUsuario(data)
      });
      getFincasByIdFincas(idUser).then((data) => {
        setFincas(data)

      });
      getZonasByIdFinca(idUser).then((data) => {
        setZonas(data)
      })
    } catch (error) {
      console.error("Error: ", error);
    }
  }, [id, idUser]);

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
    { key: "nombre", label: "Nombre" },
    { key: "mac", label: "MAC", icon: macBlue },
    { key: "descripcion", label: "Descripción", icon: descripcionBlue },
    { key: "idzona", label: "Zona" },
    { key: "estado", label: "Inactivo/Activo", icon: estadoBlue },
    { key: "acciones", label: "Acciones" },
  ];

  const asignarZona2 = (id) => {

    const nombre = zonas.find(zonas => zonas.id === id);
    return nombre ? nombre.nombre : "Sin zona";

    
  }


  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <button
          className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
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
          <button className="px-6 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={viewWhite} alt="Ver" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Datos
            </span>
          </button>
        </Link>
      </div>
      <div className="relative group">
        <button
          onClick={() => abrirModalEliminar(fila.id)}
          className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={deleteWhite} alt="Eliminar" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </button>
      </div>
    </div>
  );

  const sensoresDeFinca = sensores.map((sensor, index) => ({
    ...sensor, idzona: asignarZona2(sensor.idzona),
    estado: (
      <div className="flex justify-start items-center">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sensor.estado}  // Usa el estado de cada sensor
            onChange={() => handleSwitch(sensor.id, sensor.estado, index)}
            className="sr-only"
          />
          <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-green-500' : 'bg-gray-400'}`}>
            <div
              className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </div>
        </label>
      </div>
    ),
  }))


  const abrirModalEditar = (sensor) => {
    setEditarSensor(sensor);
    setModalEditarAbierto(true);
  };

  const abrirModalEliminar = (sensor) => {
    setSensorAEliminar(sensor);
    setModalEliminarAbierto(true);
  };

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

  const handleChange = (e) => {
    // cambia el idzona de string a número entero
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    insertarSensor(formData).then((response) => {
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
      title: "¡Sensor agregado correctamente!"
    });
  };

  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarSensor(editarSensor.id, editarSensor).then((data) => {
      const nuevosSensores = [...sensores]; // Copiar el arreglo de sensores
      const index = nuevosSensores.findIndex(sensor => sensor.id === editarSensor.id); // Buscar el índice del sensor con el mismo id
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

  const handleChangeEditar = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setEditarSensor({ ...editarSensor, [e.target.name]: value });
  };

  const handleSwitch = async (id, estado, index) => {
    const sensorcito = [...sensores]

    console.log("mac:", sensorcito[index].mac)
    if (estado === true) {
      console.log("bloque 1")
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
      console.log("data:", updatedFormData)
      actualizarSensor(sensores[index].id, updatedFormData).then((data) => {
        const nuevosSensores = [...sensores];
        nuevosSensores[index] = updatedFormData;
        setSensores(nuevosSensores);
        insertarDatos(updatedFormData.mac)
      })
    } else if (sensorcito[index].mac === null) {
      console.log("bloque 2")

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
        console.log("data:", updatedFormData)


        actualizarSensor(sensores[index].id, updatedFormData).then((data) => {
          const nuevosSensores = [...sensores];
          nuevosSensores[index] = updatedFormData;
          setSensores(nuevosSensores);
          if (updatedFormData.estado === true) {

            insertarDatos(updatedFormData.mac).then((data) => {
              console.log(data);
            })
          }
        })
        inputValue = '';
      }
    } else {
      console.log("bloque 3")

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

      actualizarSensor(sensores[index].id, updatedFormData).then((data) => {
        const nuevosSensores = [...sensores];
        nuevosSensores[index] = updatedFormData;
        setSensores(nuevosSensores);
        if (updatedFormData.estado === true) {

          insertarDatos(updatedFormData.mac).then((data) => {
            console.log(data);
          })
        }

      })

    }

  };
  const enviarForm = (id) => {
    //se trae el id del sensor de la columna para traerlo y enviarlo como objeto
    const sensorEnviado = sensores.find(sensor => sensor.id === id);
    abrirModalEditar(sensorEnviado);
  }

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
      confirmButtonText: 'OK',
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
    setVistaActiva(vista);
  };

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
            console.log('Zona:', zona),
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
      {/* El componente Opcion ya incluye la opción de cambiar la vista.
                Su propiedad onChangeVista actualizará el estado y localStorage. */}
      <MostrarInfo
        titulo={`Sensores de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={sensoresDeFinca}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />


      {/*Codigo modal insertar */}
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
                <img src={descripcionWhite} alt="icono" className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                  onClick={() => setModalInsertarAbierto(false)}>
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

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Editar sensor</h5>
            <hr />
            <form onSubmit={handleEditarSensor}>

              {asignarZona(handleChangeEditar)}
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="nombre"
                  value={editarSensor.nombre}
                  placeholder="Nombre"
                  type="text"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={descripcionWhite} alt="icono" className="bg-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="descripcion"
                  value={editarSensor.descripcion}
                  placeholder="Descripción"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEditarAbierto(false)}>
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

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar sensor</h5>
            <hr />
            <form onSubmit={HandlEliminarSensor}>
              <div className="flex justify-center my-4">
                <img src={ConfirmarEliminar} alt="icono"
                />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-500 text-center text-lg">Se eliminará el sensor de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)} >
                  Cancelar
                </button>
                <button className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg" >
                  Sí, eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivarSensores;