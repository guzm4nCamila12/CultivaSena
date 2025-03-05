import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getUsuarioByIdRol, eliminarUsuario, insertarUsuario, actualizarUsuario } from "../../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../../../services/fincas/ApiFincas";
import Navbar from "../../../components/gov/navbar";
import Tabla from "../../../components/Tabla";
import phoneIcon from "../../../assets/icons/phoneBlue.png"
import emailIcon from "../../../assets/icons/emailBlue.png"
import editIcon from "../../../assets/icons/edit.png";
import deletIcon from "../../../assets/icons/delete.png";
import Nombre from "../../../assets/icons/User.png"
import Telefono from "../../../assets/icons/Phone.png"
import Correo from "../../../assets/icons/Email.png"
import Clave from "../../../assets/icons/contra.png"
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
import '@fontsource/work-sans'; // Importar la fuente Work Sans
import { acctionSucessful } from "../../../components/alertSuccesful";
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png"
import iconBoton from "../../../assets/icons/iconBoton.png"


const Inicio = () => {
  const { id } = useParams();

  // Estado local del componente
  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]); // Arreglo de usuarios obtenidos de la Base de Datos
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [editarUsuario, setEditarUsuario] = useState({ id, nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });

  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(false)



  useEffect(() => {
    getUsuarioByIdRol(id).then(data => setUsuarios(data || [])).catch(error => console.error('Error: ', error));
    getFincasByIdFincas(id).then((data) => {
      setFincas(data)
    });
  }, [id]);




  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });
  };



  const columnas = [
    { key: "telefono", label: "Telefono", icon: phoneIcon },
    { key: "correo", label: "Correo", icon: emailIcon },
    { key: "acciones", label: "Acciones" },
  ];

  const HandleEditarAlterno = (alterno) => {
    const { "#": removed, ...edit } = alterno;
    setEditarUsuario(edit);
    setModalEditarAbierto(true);



  }

  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarUsuario(editarUsuario.id, editarUsuario).then(() => {
      setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "Alterno editado correctamente"
      });
      setModalEditarAbierto(false);
    });
  };


  const HandlEliminarAlterno = (e) => {
    e.preventDefault();
    console.log(usuarioEliminar);
    eliminarUsuario(usuarioEliminar).then(() => {
      setUsuarios((prevUsuarios) => prevUsuarios?.filter(usuario => usuario.id !== usuarioEliminar) || []);
      setModalEliminarAbierto(false)
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: 'Icono personalizado',
        title: "Alterno eliminado correctamente"
      });
    }).catch(console.error);
  }

  const abrirModalEliminar = (id) => {
    setUsuarioEliminar(id);
    console.log("id: " + id);
    setModalEliminarAbierto(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones

    // Insertar nuevo usuario
    insertarUsuario(nuevoUsuario).then((data) => {
      console.log("usuario: ", data)
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "Alterno agregado correctamente"
      });
    }).catch(console.error);
  }


  const acciones = (fila) => (
    <div className="flex justify-center gap-2">

      <div className="relative group">
        <button className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all" onClick={() => HandleEditarAlterno(fila)}>

          <img src={editIcon} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>

      <div className="relative group">
        <button className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all" onClick={() => abrirModalEliminar(fila.id)}>

          <img src={deletIcon} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <Tabla columnas={columnas} datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))} titulo={`Alternos de la finca: ${fincas.nombre}`} acciones={acciones} />
      <div className="flex justify-center w-full mx-auto sm:mt-12">
        <button

          className="animate-light-bounce hover:animate-none mx-3 shadow-[rgba(0,0,0,0.5)] shadow-md px-8 py-2 bg-[#009E00] w-full sm:w-[80%] md:w-[50%] lg:w-[43%] xl:w-[30%] text-white text-xl font-bold rounded-full hover:bg-[#005F00] flex justify-center items-center gap-2"

          onClick={() => setModalInsertarAbierto(true)}
        >
          <span>Agregar Alterno</span>
          <img
            src={iconBoton}
            alt="icono"
            className="w-4 h-4"
          />
        </button>


      </div>




      {/* MODAL insertar */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4" style={{ fontFamily: "work sans" }}>Agregar Alterno</h5>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mt-2">
                <img
                  src={Nombre}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="nombre" placeholder="Nombre" required onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Telefono}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="telefono" placeholder="Telefono" onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Correo}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="correo" placeholder="Correo" onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Clave}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="clave" placeholder="Clave" onChange={handleChange} />
              </div>
              <div className="flex justify-end mt-4">
                <button className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2" onClick={() => setModalInsertarAbierto(false)}>Cancelar</button>
                <button type="submit" className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL EDITAR USUARIO */}
      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Editar Alterno</h5>
            <hr />
            <form onSubmit={handleEditarSensor}>
              <div className="relative w-full mt-2">
                <img
                  src={Nombre}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.nombre}
                  type="text"
                  name="nombre"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Telefono}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.telefono}
                  type="text"
                  name="telefono"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Correo}
                  alt="icono"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.correo}
                  name="correo"
                  type="text"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl"
                >
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
                <img
                  src={ConfirmarEliminar}
                  alt="icono"
                />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el alterno de manera permanente.</p>

              <div className="flex justify-between mt-6 space-x-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                >
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