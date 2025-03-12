//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
//iconos de las columnas
import phoneBlue from "../../../assets/icons/phoneBlue.png"
import emailBlue from "../../../assets/icons/emailBlue.png"
//iconos de las acciones
import editWhite from "../../../assets/icons/editWhite.png";
import deletWhite from "../../../assets/icons/deleteWhite.png";
//iconos de los modales
import userGray from "../../../assets/icons/userGray.png"
import phoneGray from "../../../assets/icons/phoneGray.png"
import emailGray from "../../../assets/icons/emailGray.png"
import passwordGray from "../../../assets/icons/passwordGray.svg"
//imgs de los modales
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png"
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
//componentes reutilizados
import { acctionSucessful } from "../../../components/alertSuccesful";
import Navbar from "../../../components/navbar";
import Tabla from "../../../components/Tabla";
//endpoints para consumir api
import { getUsuarioByIdRol, eliminarUsuario, insertarUsuario, actualizarUsuario } from "../../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../../../services/fincas/ApiFincas";

const Inicio = () => {
  //Obtiene el ID de la URL 
  const { id } = useParams();
  //Estado para almacenar los datos
  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [editarUsuario, setEditarUsuario] = useState({ id, nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(false)
  const [errors, setErrors] = useState({}); // Estado para los errores

  //Efecto que carga los datos
  useEffect(() => {
    //Obtiene los usuarios con el rol asociado al ID
    getUsuarioByIdRol(id).then(data => setUsuarios(data || [])).catch(error => console.error('Error: ', error));
    //Obtiene la finca asociada al ID de finca
    getFincasByIdFincas(id).then((data) => {
      setFincas(data)
    });
  }, [id]);

  //Maneja el cambio de valores para agregar un nuevo usuario
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  //Maneja el cambio de valores para editar un usuario
  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });
  };

  //Definicion de las columnas de la tabla
  const columnas = [
    { key: "nombre" },
    { key: "telefono", label: "Telefono", icon: phoneBlue },
    { key: "correo", label: "Correo", icon: emailBlue },
    { key: "acciones", label: "Acciones" },
  ];

  //Abre el modal de edicion con los datos de ese usuario
  const HandleEditarAlterno = (alterno) => {
    const { "#": removed, ...edit } = alterno;
    setEditarUsuario(edit);
    setModalEditarAbierto(true);
  }

  //Maneja la edicion cuando se envia el formulario
  const handleEditarAlterno = (e) => {
    e.preventDefault();
    //Realiza la actualizacion
    actualizarUsuario(editarUsuario.id, editarUsuario).then(() => {
      //Actualiza la lista de usuarios
      setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "¡Alterno editado correctamente!"
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
    const newErrors = {};

    // Validaciones
    if (!nuevoUsuario.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    }
    if (!nuevoUsuario.telefono) {
      newErrors.telefono = "El teléfono es requerido.";
    }
    if (!nuevoUsuario.correo) {
      newErrors.correo = "El correo es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(nuevoUsuario.correo)) {
      newErrors.correo = "El correo no es válido.";
    }
    if (!nuevoUsuario.clave) {
      newErrors.clave = "La clave es requerida.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Actualiza los errores si hay
      return; // Detiene el envío si hay errores
    }

    // Inserta el nuevo usuario si no hay errores
    insertarUsuario(nuevoUsuario).then((data) => {
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "¡Alterno agregado correctamente!"
      });
      setErrors({}); // Limpia los errores después de un envío exitoso
    }).catch(console.error);
  };
  //Define las acciones que se pueden hacer en cada fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarAlterno(fila)}
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
      <Tabla
        columnas={columnas}
        datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))}
        titulo={`Alternos de la finca: ${fincas.nombre}`}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
      />

      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Agregar Alterno</h5>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl ${errors.nombre ? 'border-red-500' : ''}`}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={handleChange}
                />
                {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
              </div>
              <div className="relative w-full mt-2">
                <img src={phoneGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl ${errors.telefono ? 'border-red-500' : ''}`}
                  type="text"
                  name="telefono"
                  placeholder="Telefono"
                  onChange={handleChange}
                />
                {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
              </div>
              <div className="relative w-full mt-2">
                <img src={emailGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl ${errors.correo ? 'border-red-500' : ''}`}
                  type="text"
                  name="correo"
                  placeholder="Correo"
                  onChange={handleChange}
                />
                {errors.correo && <p className="text-red-500 text-xs">{errors.correo}</p>}
              </div>
              <div className="relative w-full mt-2">
                <img src={passwordGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl ${errors.clave ? 'border-red-500' : ''}`}
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  onChange={handleChange}
                />
                {errors.clave && <p className="text-red-500 text-xs">{errors.clave}</p>}
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

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Editar Alterno</h5>
            <hr />
            <form onSubmit={handleEditarAlterno}>
              {/* Campos del formulario para editar un usuario */}
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.nombre}
                  type="text"
                  name="nombre"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={phoneGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.telefono}
                  type="text"
                  name="telefono"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={emailGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.correo}
                  name="correo"
                  type="text"
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
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Alterno</h5>
            <hr />
            <form onSubmit={HandlEliminarAlterno}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el alterno de manera permanente.</p>
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

export default Inicio;