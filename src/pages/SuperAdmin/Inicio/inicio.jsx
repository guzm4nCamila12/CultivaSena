//importaciones necesarias de react
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//iconos de las columnas
import phoneBlue from "../../../assets/icons/phoneBlue.png";
import emailBlue from "../../../assets/icons/emailBlue.png";
import rolBlue from "../../../assets/icons/rolBlue.png";
//iconos de las acciones
import deletWhite from "../../../assets/icons/deleteWhite.png";
import editWhite from "../../../assets/icons/editWhite.png";
import viewWhite from "../../../assets/icons/viewWhite.png";
import sinFincas from "../../../assets/icons/sinFincas.png";
//iconos de modales
import nameGray from "../../../assets/icons/userGray.png";
import phoneGray from "../../../assets/icons/phoneGray.png";
import emailGray from "../../../assets/icons/emailGray.png";
import passwordGray from "../../../assets/icons/passwordGray.svg";
import rolGray from "../../../assets/icons/rolGray.png";
//componentes reutilizados
import UserCards from "../../../components/UseCards";
import MostrarInfo from "../../../components/mostrarInfo";
import Tabla from "../../../components/Tabla";
import { acctionSucessful } from "../../../components/alertSuccesful";
import NavBar from "../../../components/navbar";
//imgs modales
import usuarioCreado from "../../../assets/img/UsuarioCreado.png";
import sinFinca from "../../../assets/img/sinFincas.png";
import ConfirmarEliminar from "../../../assets/img/Eliminar.png";
import UsuarioEliminado from "../../../assets/img/UsuarioEliminado.png";
import fotoPerfil from "../../../assets/img/PerfilSuperAdmin.png";
import Alerta from "../../../assets/img/Alert.png";
//endpoints para consumir api
import { actualizarUsuario, eliminarUsuario, getUsuarios, insertarUsuario } from "../../../services/usuarios/ApiUsuarios";

const Inicio = () => {
  // Estados para gestionar los usuarios y formularios
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [usuarioEliminar, setUsuarioEliminar] = useState(false);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  // Se inicializa la vista según localStorage (por defecto "tarjetas")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjetas");
 
  // Obtiene los usuarios al cargar el componente 
  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data));
  }, []);

  // Función para convertir el id_rol a su nombre correspondiente
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

  // Maneja el cambio en los campos para agregar un nuevo usuario
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  // Maneja el proceso de agregar un usuario
  const handleInsertar = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.clave || !nuevoUsuario.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    // Validación del formato del correo
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(nuevoUsuario.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    // Validación del teléfono (suponiendo 10 dígitos)
    const telefonoValido = /^\d{10}$/.test(nuevoUsuario.telefono);
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    // Validación de la clave (mínimo 6 caracteres)
    if (nuevoUsuario.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener más de 6 caracteres!"
      });
      return;
    }
    if (nuevoUsuario.nombre.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El nombre debe tener más de 6 caracteres!"
      });
      return;
    }
    const nuevo = {
      nombre: nuevoUsuario.nombre,
      telefono: nuevoUsuario.telefono,
      correo: nuevoUsuario.correo,
      clave: nuevoUsuario.clave,
      id_rol: Number(nuevoUsuario.id_rol)
    };
    try {
      const data = await insertarUsuario(nuevo);
      if (data) {
        setUsuarios([...usuarios, data]);
        setNuevoUsuario({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: "Icono personalizado",
          title: "¡Usuario agregado correctamente!"
        });
      }
      setModalInsertarAbierto(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // Maneja el cambio en los campos para editar un usuario
  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });
  };

  // Maneja el proceso de editar
  const handleEditar = async (e) => {
    e.preventDefault();
    if (!editarUsuario.nombre || !editarUsuario.telefono || !editarUsuario.correo || !editarUsuario.clave || !editarUsuario.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(editarUsuario.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    const telefonoValido = /^\d{10}$/.test(editarUsuario.telefono);
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    if (editarUsuario.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener más de 6 caracteres!"
      });
      return;
    }
    if (editarUsuario.nombre.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El nombre debe tener más de 6 caracteres!"
      });
      return;
    }
    try {
      await actualizarUsuario(Number(editarUsuario.id), editarUsuario);
      setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: "¡Usuario editado correctamente!"
      });
      setModalEditarAbierto(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Maneja el proceso de eliminar un usuario
  const handleEliminarUsuario = (e) => {
    e.preventDefault();
    eliminarUsuario(usuarioEliminar)
      .then(() => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioEliminar));
        setModalEliminarAbierto(false);
      })
      .catch(console.error);
    acctionSucessful.fire({
      imageUrl: UsuarioEliminado,
      imageAlt: "Icono personalizado",
      title: "¡Usuario eliminado correctamente!"
    });
  };

  // Define las columnas de la tabla
  const columnas = [
    { key: "fotoPerfil", label: "Foto", icon: fotoPerfil },
    { key: "nombre", label: "Nombre", icon: phoneBlue },
    { key: "telefono", label: "Teléfono", icon: phoneBlue },
    { key: "correo", label: "Correo", icon: emailBlue },
    { key: "id_rol", label: "Rol", icon: rolBlue, transform: obtenerRol },
    { key: "acciones", label: "Acciones" },
  ];

  // Definición de las acciones que se pueden hacer en una fila
  const acciones = (fila) => {
    return (
      <div className="flex justify-center gap-4">
        <div className="relative group">
          <button
            className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => abrirModalEditar(fila)}
          >
            <img src={editWhite} alt="Editar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </div>
        {fila.id_rol !== "Admin" ? (
          <div className="relative group">
            <button
              onClick={() => setModalSinFincasAbierto(true)}
              className="px-6 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            >
              <img src={sinFincas} alt="Ver" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        ) : null}
        {fila.id_rol === "Admin" && (
          <div className="relative group">
            <Link to={`/lista-fincas/${fila.id}`} className="px-6 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
              <button>
                <img src={viewWhite} alt="Ver" />
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver
              </span>
            </Link>
          </div>
        )}
        <div className="relative group">
          <button
            onClick={() => abrirModalEliminar(fila.id)}
            className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          >
            <img src={deletWhite} alt="Eliminar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Eliminar
          </span>
        </div>
      </div>
    );
  };

  const abrirModalEditar = (usuario) => {
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
    setModalEliminarAbierto(true);
  };

  // Función para convertir el nombre del rol a su ID correspondiente 
  const enviarRol = (rol) => {
    switch (rol) {
      case "SuperAdmin":
        return 1;
      case "Admin":
        return 2;
      case "Alterno":
        return 3;
      default:
        return "";
    }
  };

  return (
    <div>
      <NavBar />
      {/* Se renderiza la vista según lo que traiga en localStorage:
          Si vistaActiva es "tabla", se muestra el componente Tabla;
          de lo contrario, se muestra UserCards */}

        <MostrarInfo
          titulo="Usuarios Registrados"
          columnas={columnas}
          datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
          acciones={acciones}
          onAddUser={() => setModalInsertarAbierto(true)}
          mostrarAgregar={true}
        />
      

      {/* Modal Insertar Usuario */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Agregar Usuario</h5>
            <hr />
            <form onSubmit={handleInsertar}>
              <div className="relative w-full mt-2">
                <img src={nameGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
                <img src={phoneGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  onChange={handleChange}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={emailGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="correo"
                  placeholder="Correo"
                  onChange={handleChange}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={passwordGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  onChange={handleChange}
                />
              </div>
              <div className="relative w-full mt-2">
                <img src={rolGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="id_rol"
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
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalInsertarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Editar Usuario</h5>
            <hr />
            <form onSubmit={handleEditar}>
              <div className="relative w-full mt-2">
                <img src={nameGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
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
                <img src={phoneGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
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
                <img src={emailGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
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
                <img src={passwordGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarUsuario.clave}
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                >
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sin Fincas */}
      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Sin Fincas</h5>
            <hr />
            <form>
              <div className="flex justify-center my-4">
                <img src={sinFinca} alt="icono" />
              </div>
              <p className="text-lg text-center font-semibold">No hay fincas registradas</p>
              <p className="text-gray-500 text-center text-sm">Agrega una finca para visualizar los datos.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalSinFincasAbierto(false)}
                >
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Usuario */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Usuario</h5>
            <hr />
            <form onSubmit={handleEliminarUsuario}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el usuario de manera permanente.</p>
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
};

export default Inicio;
