import { actualizarUsuario, eliminarUsuario, getUsuarios, insertarUsuario } from "../../../services/usuarios/ApiUsuarios";
import { useState, useEffect } from "react";
import userIcon from "../../../assets/icons/user.png"
import phoneIcon from "../../../assets/icons/phone.png"
import emailIcon from "../../../assets/icons/email.png"
import rolIcon from "../../../assets/icons/rol.png"
import configIcon from "../../../assets/icons/config.png"
import Tabla from "../../../components/Tabla";
import ver from "../../../assets/icons/view.png"
import Nombre from "../../../assets/icons/User.png"
import Telefono from "../../../assets/icons/Phone.png"
import Correo from "../../../assets/icons/Email.png"
import Clave from "../../../assets/icons/contra.png"
import Rol from "../../../assets/icons/rolIn.png"
import editIcon from "../../../assets/icons/edit.png"
import deletIcon from "../../../assets/icons/delete.png"
import NavBar from "../../../components/gov/navbar";
import { acctionSucessful } from "../../../components/alertSuccesful";
import { Link } from "react-router-dom";
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"
import sinFinca from "../../../assets/img/sinFincas.png"
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png"

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [usuarioEliminar, setUsuarioEliminar] = useState(false)
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)
  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data));
  }, []);

  const obtenerRol = (id_rol) => {
    switch (id_rol) {
      case 1:

        return "SuperAdmin";
      case 2:
        return "Admin";
      case 3:
        return "Alterno";
      default:
        return "Desconocido";
    }
  };
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleInsertar = async (e) => {

    e.preventDefault();
    const nuevo = {
      nombre: nuevoUsuario.nombre,
      telefono: nuevoUsuario.telefono,
      correo: nuevoUsuario.correo,
      clave: nuevoUsuario.clave,
      id_rol: Number(nuevoUsuario.id_rol)
    };
    try {
      const data = await insertarUsuario(
        nuevo
      );
      if (data) {
        setUsuarios([...usuarios, data]);
        setNuevoUsuario({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: 'Icono personalizado',
          title: "Usuario agregado correctamente"
        });

      }
      setModalInsertarAbierto(false)
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }


  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });

  };
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      actualizarUsuario(Number(editarUsuario.id), editarUsuario)
      setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
      acctionSucessful.fire({
        icon: "success",
        title: "Usuario editado correctamente"
      });
      setModalEditarAbierto(false)
    } catch (error) {
      console.error(error)
    }

  };
  const handleEliminarUsuario = (e) => {
    e.preventDefault();
    eliminarUsuario(usuarioEliminar).then(() => {
      setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioEliminar));
      setModalEliminarAbierto(false);
    }).catch(console.error);
    acctionSucessful.fire({
      imageUrl: UsuarioEliminado,
      imageAlt: 'Icono personalizado',
      title: "Usuario Eliminado correctamente"
    });
  };


  const columnas = [
    { key: "#", label: "#", icon: "" },
    { key: "nombre", label: "Nombre", icon: userIcon },
    { key: "telefono", label: "Teléfono", icon: phoneIcon },
    { key: "correo", label: "Correo", icon: emailIcon },
    { key: "id_rol", label: "Rol", icon: rolIcon},
    { key: "acciones", label: "Acciones", icon: configIcon },
  ];


  const acciones = (fila) => {
    return (
      <div className="flex justify-center gap-2">

        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center" onClick={() => abrirModalEditar(fila)}>
          {console.log(fila)}
            <img src={editIcon} alt="Editar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </div>

        {fila.id_rol !== "Admin" ? (
          <div className="relative group">
            <button onClick={() => setModalSinFincasAbierto(true)} className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">

              <img src={ver} alt="Ver" className="w-6" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        ) : null}

        {fila.id_rol === "Admin" && (
          <div className="relative group">
            <Link to={`/lista-fincas/${fila.id}`}>

              <button className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">

                <img src={ver} alt="Ver" className="w-6" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-1 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver
              </span>
            </Link>
          </div>
        )}

        <div className="relative group">
          <button onClick={() => abrirModalEliminar(fila.id)} className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={deletIcon} alt="Eliminar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </div>

      </div>
    );
  };


  const enviarRol = (rol) =>{
    switch (rol) {
      case 'SuperAdmin':
        
        return 1;
      case 'Admin':
        
        return 2;
      case 'Alterno':
        
        return 3;
      default:
        break;

    }
  }


  const abrirModalEditar = (usuario) => {
  
    
    // Crear un objeto con solo las propiedades que necesitas
    const usuarioNecesario = {
      id: usuario.id,
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      correo: usuario.correo,
      clave: usuario.clave,
      id_rol: enviarRol(usuario.id_rol)
    };

    setEditarUsuario(usuarioNecesario);
    setModalEditarAbierto(true);
  };
  const abrirModalEliminar = (id) => {
    setUsuarioEliminar(id);
    setModalEliminarAbierto(true)
  }

 

  return (
    <>
      <NavBar />
      <Tabla
        titulo="Usuarios registrados"
        columnas={columnas}
        datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
        acciones={acciones}

      />
      <div className="flex justify-end w-[84.4%] mx-auto mt-3  ">
        <button
          className="animate-light-bounce  hover:animate-none mx-3 shadow-[rgba(0,0,0,0.5)] shadow-md px-8 py-2 bg-[rgba(0,_158,_0,_1)] text-white font-bold rounded-full hover:bg-gray-700 flex items-center" 
          onClick={() => setModalInsertarAbierto(true)}
        >
          Agregar Usuario
        </button>
      </div>




      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Agregar Usuario</h5>
            <hr />
            <br />
            <form onSubmit={handleInsertar}>
              <div className="relative w-full mt-2">
                <img
                  src={Nombre} // Reemplaza con la ruta de tu icono
                  alt="icono"
                  className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
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
                  src={Telefono} // Reemplaza con la ruta de tu icono
                  alt="icono"
                  className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Correo} // Reemplaza con la ruta de tu icono
                  alt="icono"
                  className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="correo" placeholder="Correo" onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img
                  src={Clave} // Reemplaza con la ruta de tu icono
                  alt="icono"
                  className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl" type="text" name="clave" placeholder="Clave" onChange={handleChange} />
              </div>

              <div className="relative w-full mt-2">
                <img
                  src={Rol} // Reemplaza con la ruta de tu icono
                  alt="icono"
                  className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="id_rol"
                  placeholder="ID Rol"
                  value={nuevoUsuario.id_rol}
                  onChange={handleChange}
                  required
                >
                  <option value=""> ID Rol </option>
                  <option value="1">Super Admin</option>
                  <option value="2">Administrador</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalInsertarAbierto(false)}>Cancelar</button>
                <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">Agregar</button>
              </div>
            </form>
          </div >
        </div >
      )}

      {
        modalEditarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
              <h5 className="text-2xl font-bold mb-4 text-center">Editar Usuario</h5>
              <hr />
              <br />
              <form onSubmit={handleEditar}>
                <div className="relative w-full mt-2">
                  <img
                    src={Nombre} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className=" absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    value={editarUsuario.nombre}
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    onChange={handleChangeEditar}
                  />
                </div>
                <div className="relative w-full mt-2">
                  <img
                    src={Telefono} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className=" absolute left-3 top-1/2 transform -translate-y-1/2 "
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    value={editarUsuario.telefono}
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    onChange={handleChangeEditar}
                  />
                </div>
                <div className="relative w-full mt-2">
                  <img
                    src={Correo} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className=" absolute left-3 top-1/2 transform -translate-y-1/2 "
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    value={editarUsuario.correo}
                    type="text"
                    name="correo"
                    placeholder="Correo electrónico"
                    onChange={handleChangeEditar}
                  />
                </div>
                <div className="relative w-full mt-2">
                  <img
                    src={Clave} // Reemplaza con la ruta de tu icono
                    alt="icono"
                    className=" absolute left-3 top-1/2 transform -translate-y-1/2 "
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                    value={editarUsuario.clave}
                    type="text"
                    name="clave"
                    placeholder="Clave"
                    onChange={handleChangeEditar} />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="button" className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalEditarAbierto(false)}>Cancelar</button>
                  <button type="submit" className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">Editar</button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Fincas</h5>
            <hr />
            <form >
              <div className="flex justify-center my-4">
                  <img
                    src={sinFinca} // Reemplaza con la ruta de tu icono
                    alt="icono"
                  />
              </div>
              <p className="text-lg text-center font-semibold">No hay fincas registradas</p>
              <p className="text-gray-500 text-center text-sm">Agrega una finca para visualizar los datos.</p>

              <div className="flex justify-between mt-6 space-x-4">
                <button className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalSinFincasAbierto(false)} >
                  Aceptar
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Usuario</h5>
            <hr />
            <form onSubmit={handleEliminarUsuario}>
              <div className="flex justify-center my-2">
                <img
                  src={ConfirmarEliminar} // Reemplaza con la ruta de tu icono
                  alt="icono"
                />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el usuario de manera permanente.</p>

              <div className="flex justify-between mt-6 space-x-4">
                <button className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg" onClick={() => setModalEliminarAbierto(false)} >
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


    </>
  );
};

export default Inicio;