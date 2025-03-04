import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { acctionSucessful } from "../../../components/alertSuccesful";
import { getSensoresById, insertarSensor, actualizarSensor, eliminarSensores } from "../../../services/sensores/ApiSensores";
import { getFincasByIdFincas } from "../../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../../services/usuarios/ApiUsuarios";
import Tabla from "../../../components/Tabla";
import NavBar from "../../../components/gov/navbar"
import macIcon from "../../../assets/icons/mac.png";
import nombreIcon from "../../../assets/icons/nombre.png";
import descripcionIcon from "../../../assets/icons/descripcion.png";
import estadoIcon from "../../../assets/icons/estado.png";
import accionesIcon from "../../../assets/icons/config.png";
import editIcon from "../../../assets/icons/edit.png";
import verIcon from "../../../assets/icons/view.png";
import deletIcon from "../../../assets/icons/delete.png";
import Swal from "sweetalert2";
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
//import EliminadoIcon from "../../../assets/img/Eliminado.png"
import withReactContent from 'sweetalert2-react-content'
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png"
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"


function ActivarSensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});


  const [editarSensor, setEditarSensor] = useState({ id: null, nombre: "", descripcion: "" });
  const [sensorAEliminar, setSensorAEliminar] = useState(null);


  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);


  const [datoAdicional, setDatoAdicional] = useState(null);


  const { id, idUser } = useParams();
  const [estado, setEstado] = useState([]);
  let inputValue = '';

  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });

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
      <button onClick={() => enviarForm(fila.id)} className="group relative">
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

  const sensoresDeFinca = sensores.map((sensor, index) => ({

    ...sensor, "#": index + 1,
    estado: (
      <div className="flex justify-start items-center">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sensor.estado}  // Usa el estado de cada sensor
            onChange={() => handleSwitch(sensor.id, sensor.estado, index)}
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
      title: "Sensor Eliminado correctamente"
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      title: "Sensor agregado correctamente"
    });
    console.log("Datos enviados:", formData);


  };

  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarSensor(editarSensor.id, editarSensor).then((data) => {
      const nuevosSensores = [...sensores]; // Copiar el arreglo de sensores
      const index = nuevosSensores.findIndex(sensor => sensor.id === editarSensor.id); // Buscar el índice del sensor con el mismo id
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "Sensor editado correctamente"
      });
      console.log("index: " + index);

      // Verificar si se encontró el índice

      nuevosSensores[index] = editarSensor; // Actualizar el sensor en el índice encontrado


      console.log("nuevosSensores: ", nuevosSensores);

      setSensores(nuevosSensores);
    })
    setModalEditarAbierto(false);
  };

  const handleChangeEditar = (e) => {
    setEditarSensor({ ...editarSensor, [e.target.name]: e.target.value });
    console.log('Editar', editarSensor)
  };

  const handleSwitch = async (id, estado, index) => {
    if (estado === true) {
      const newEstado = !estado;

      const updatedSensores = [...sensores];
      updatedSensores[index].estado = newEstado;

      setSensores(updatedSensores);

      const updatedFormData = {
        id: sensores[index].id,
        mac: null,
        nombre: sensores[index].nombre,
        descripcion: sensores[index].descripcion,
        estado: newEstado,
        idusuario: sensores[index].idusuario,
        idfinca: sensores[index].idfinca,
      };

      actualizarSensor(sensores[index].id, updatedFormData).then((data) => {
        const nuevosSensores = [...sensores]; // Copiar el array actual
        nuevosSensores[index] = updatedFormData; // Cambiar el estado del sensor
        setSensores(nuevosSensores);
      })
    } else {

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
          idfinca: sensores[index].idfinca,
        }

        actualizarSensor(sensores[index].id, updatedFormData).then((data) => {
          const nuevosSensores = [...sensores]; // Copiar el array actual
          nuevosSensores[index] = updatedFormData; // Cambiar el estado del sensor
          setSensores(nuevosSensores);

        })
        inputValue = '';
      }
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
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-3xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-4 my-8 sm:my-12',  // Responsive width and margin
        title: 'text-gray-900',
        input: 'flex py-2 border-gray rounded-3xl',
        actions: 'flex justify-center space-x-4 max-w-[454px] mx-auto',  // Center buttons with spacing
        cancelButton: 'w-[210px] p-3 text-center bg-[#00304D] hover:bg-[#021926] text-white font-bold rounded-full text-lg',
        confirmButton: 'w-[210px] p-3 bg-[#009E00] hover:bg-[#005F00] text-white font-bold rounded-full text-lg',
      },
    });
  };

  const confirmarCambioEstado = () => {
    const cerrado = true;

    return cerrado;
  };


  return (
    <div>
      <NavBar />

      <h1 className="text-center text-2xl font-semibold">{usuario.nombre}</h1>
      <h1 className="text-center text-2xl font-semibold">{fincas.nombre}</h1>
      <Tabla
        titulo="Sensores"
        columnas={columnas}
        datos={sensoresDeFinca}
        acciones={acciones} />

      <div className="flex justify-end w-[84.4%] mx-auto mt-3  ">
        <button className=" shadow-[rgba(0,0,0,0.5)] shadow-md px-8 py-2 bg-[#009E00] text-white font-bold rounded-full 
                      hover:bg-[#005F00] flex items-center justify-center
                      sm:w-auto sm:mx-3 md:px-8 
                      w-full max-w-sm mx-auto" 
                      onClick={() => setModalInsertarAbierto(true)}>
          Agregar Sensor
        </button>
      </div>

      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
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

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
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
                  value={editarSensor.nombre}
                  placeholder="Nombre"
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
                  value={editarSensor.descripcion}
                  placeholder="Descripción"
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

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar sensor</h5>
            <hr />
            <form onSubmit={HandlEliminarSensor}>
              <div className="flex justify-center my-4">
                <img
                  src={ConfirmarEliminar} // Reemplaza con la ruta de tu icono
                  alt="icono"
                />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-500 text-center text-lg">Se eliminará el sensor de manera permanente.</p>

              <div className="flex justify-between mt-6 space-x-4">

                <button className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalEliminarAbierto(false)} >
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