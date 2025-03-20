
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
//iconos de las columnas
import emailBlue from "../../../../assets/icons/emailBlue.png"
//iconos de las acciones
import addRegistro from "../../../../assets/icons/agregar-archivo.png"
import editWhite from "../../../../assets/icons/editWhite.png";
import deletWhite from "../../../../assets/icons/deleteWhite.png";
//iconos de los modales
import userGray from "../../../../assets/icons/userGray.png"
import sensorIcon from "../../../../assets/icons/sensorBlue.png"
//imgs de los modales
import UsuarioEliminado from "../../../../assets/img/UsuarioEliminado.png"
import usuarioCreado from "../../../../assets/img/UsuarioCreado.png"
import ConfirmarEliminar from "../../../../assets/img/Eliminar.png"
import Alerta from "../../../../assets/img/Alert.png"
//componentes reutilizados
import { acctionSucessful } from "../../../../components/alertSuccesful";
import Navbar from "../../../../components/navbar";
//endpoints para consumir api
import { eliminarUsuario, insertarUsuario, actualizarUsuario } from "../../../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas, getZonasByIdFinca, insertarFinca, insertarZona } from "../../../../services/fincas/ApiFincas";
import MostrarInfo from "../../../../components/mostrarInfo";

const Zonas = () => {
  //Obtiene el ID de la URL 
  const { id } = useParams();
  //Estado para almacenar los datos
  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [nuevaZona, setNuevaZona] = useState({ nombre: "", id_finca: parseInt(id) });
  const [editarZona, setEditarZona] = useState({ id, nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalActividadInsertar, setModalActividadInsertar] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(false)
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const actividadesPorEtapa = {
    "1": [
      { value: "1", label: "Arar o remover el suelo" },
      { value: "2", label: "Limpiar las malas hierbas" },
      { value: "3", label: "Abonar el campo" },
      { value: "4", label: "Otros" }
    ],
    "2": [
      { value: "1", label: "Poner las semillas en la tierra" },
      { value: "2", label: "Regar después de sembrar" },
      { value: "3", label: "Cubrir las semillas con tierra" },
      { value: "4", label: "Otros" }
    ],
    "3": [
      { value: "1", label: "Regar para que crezcan bien" },
      { value: "2", label: "Aplicar fertilizante" },
      { value: "3", label: "Deshierbar el cultivo" },
      { value: "4", label: "Otros" }
    ],
    "4": [
      { value: "1", label: "Recoger los frutos" },
      { value: "2", label: "Clasificar la cosecha" },
      { value: "3", label: "Empacar lo recolectado" },
      { value: "4", label: "Otros" }
    ],
    "5": [
      { value: "1", label: "Preparar la venta o distribución" },
      { value: "2", label: "Organizar el empaque para la venta" },
      { value: "3", label: "Llevar los productos al mercado" },
      { value: "4", label: "Otros" }
    ]
  }

  //Efecto que carga los datos
  useEffect(() => {
    //Obtiene los usuarios con el rol asociado al ID
    getZonasByIdFinca(id).then(data => setUsuarios(data || [])).catch(error => console.error('Error: ', error));
    //Obtiene la finca asociada al ID de finca
    getFincasByIdFincas(id).then((data) => {
      setFincas(data)
    });
  }, [id]);

  //Maneja el cambio de valores para agregar un nuevo usuario
  const handleChange = (e) => {
    setNuevaZona({ ...nuevaZona, [e.target.name]: e.target.value });
  };

  //Maneja el cambio de valores para editar un usuario
  const handleChangeEditar = (e) => {
    setEditarZona({ ...editarZona, [e.target.name]: e.target.value });
  };

  //Definicion de las columnas de la UseCards
  const columnas = [
    { key: "nombre", },
    { key: "cantidadSensores", label: "Cantidad Sensores", icon: emailBlue },
    { key: "verSensores", label: "Ver Sensores", icon: sensorIcon },
    { key: "acciones", label: "Acciones" },
  ];

  //Abre el modal de edicion con los datos de ese usuario
  const HandleEditarZona = (zona) => {
    const { "#": removed, ...edit } = zona;
    setEditarZona(edit);
    setModalEditarAbierto(true);
  }

  //Maneja la edicion cuando se envia el formulario
  const handleEditarZona = (e) => {
    e.preventDefault();
    if (!editarZona.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    //Realiza la actualizacion
    actualizarUsuario(editarZona.id, editarZona).then(() => {
      //Actualiza la lista de usuarios
      setUsuarios(usuarios.map(u => u.id === editarZona.id ? editarZona : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "¡Zona editada correctamente!"
      });
      setModalEditarAbierto(false);
    });
  };

  //Maneja la eliminacion de un usuario
  const HandlEliminarAlterno = (e) => {
    e.preventDefault();
    //Elimina el usuario
    eliminarUsuario(usuarioEliminar).then(() => {
      setUsuarios((prevUsuarios) => prevUsuarios?.filter(usuario => usuario.id !== usuarioEliminar) || []);
      setModalEliminarAbierto(false)
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: 'Icono personalizado',
        title: "¡Alterno eliminado correctamente!"
      });
    }).catch(console.error);
  }

  const abrirModalEliminar = (id) => {
    setUsuarioEliminar(id);
    setModalEliminarAbierto(true)
  }

  //Maneja el envio del formulario para agregar un usuario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaZona.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }

    //Inserta el nuevo usuario
    insertarZona(nuevaZona).then((data) => {
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "¡Zona agregada correctamente!"
      });
    }).catch(console.error);
  }

  const handleEtapaChange = (event) => {
    setEtapaSeleccionada(event.target.value);
  };

  const actividades = actividadesPorEtapa[etapaSeleccionada] || [];

  //Define las acciones que se pueden hacer en cada fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => setModalActividadInsertar(true)}
        >
          <img src={addRegistro} alt="" className="w-5 h-5" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Agregar Actividad
        </span>
      </div>
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarZona(fila)}
        >
          <img src={editWhite} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}
        >
          <img src={deletWhite} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  return (
    <div >
      <Navbar />

      <MostrarInfo
        titulo={`Zonas de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={Array.isArray(usuarios) ? usuarios : []}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

{modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Agregar zona en finca: {fincas.nombre}</h5>
            <hr />
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario para agregar un usuario */}
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre Zona"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalInsertarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalActividadInsertar && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Registro de actividades</h5>
            <hr />
            {/* <form onSubmit={handleInsertar}> */}
            <div className="relative w-full mt-2">
              <label className=" font-semibold">Seleccione el tipo de cultivo</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="cultivo" value="cafe" required /> Café
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="cultivo" value="mora" required /> Mora
                </label>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Seleccione la etapa del cultivo</label>
                <select
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="etapa"
                  required
                  onChange={handleEtapaChange}
                >
                  <option value="">Seleccione etapa del cultivo</option>
                  <option value="1">Preparar el terreno</option>
                  <option value="2">Siembra</option>
                  <option value="3">Crecer y madurar</option>
                  <option value="4">Cosecha</option>
                  <option value="5">Comercialización</option>
                </select>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Seleccione actividad que realizó</label>
                <select
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="etapa"
                  required
                >
                  <option value="">Seleccione actividad</option>
                  {actividades.map((actividad) => (
                    <option key={actividad.value} value={actividad.value}>{actividad.label}</option>
                  ))}
                </select>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Descripción</label>
                <input
                  className="w-full pl-3 py-5 border border-gray-300 rounded-3xl"
                  type="text"
                  name="descripcion"
                  placeholder="Escriba una breve descripción"
                />
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Marque inicio y finalización</label>
                <div className="relative mt-2">
                  <input
                    type="date"
                    name="fecha"
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                    required
                  />
                </div>
                <div className="relative mt-2">
                  <label className=" font-semibold">Hora inicio</label>
                  <input
                    type="time"
                    name="horaInicio"
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                    required
                  />
                </div>
                <div className="relative mt-2">
                  <label className=" font-semibold">Hora finalización</label>
                  <input
                    type="time"
                    name="horaFin"
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
            <button
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalActividadInsertar(false)}>
                  Cancelar
                </button>
              <button
                type="submit"
                className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-2 rounded-full text-xl"
              >
               Registrar
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      )}

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Editar Zona</h5>
            <hr />
            <form onSubmit={handleEditarZona}>
              {/* Campos del formulario para editar un usuario */}
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarZona.nombre}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalEditarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
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
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Zona</h5>
            <hr />
            <form onSubmit={HandlEliminarAlterno}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la zona de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Sí, eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Zonas;