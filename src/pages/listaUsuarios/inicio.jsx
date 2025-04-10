//importaciones necesarias de react
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//iconos de las columnas
import telefono from "../../assets/icons/telefono.png";
import correo from "../../assets/icons/correo.png";
import rol from "../../assets/icons/rol.png";
import ajustes from "../../assets/icons/acciones.png"
import nombreIcon from "../../assets/icons/nombres.png"
//iconos de las acciones
import eliminar from "../../assets/icons/eliminar.png";
import editar from "../../assets/icons/editar.png";
import ver from "../../assets/icons/ver.png";
import sinFincas from "../../assets/icons/sinFincas.png";
//iconos de modales
import usuarioAzul from "../../assets/icons/usuarioAzul.png";
import telefonoAzul from "../../assets/icons/telefonoAzul.png";
import correoAzul from "../../assets/icons/correoAzul.png";
import claveAzul from "../../assets/icons/claveAzul.png";
import rolAzul from "../../assets/icons/rolAzul.png";
//componentes reutilizados
import MostrarInfo from "../../components/mostrarInfo";
import { acctionSucessful } from "../../components/alertSuccesful";
import NavBar from "../../components/navbar";
//imgs modales
import usuarioCreado from "../../assets/img/usuarioCreado.png";
import sinFinca from "../../assets/img/sinFincas.png";
import ConfirmarEliminar from "../../assets/img/eliminar.png";
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png";
import fotoPerfil from "../../assets/img/perfilSuperAdmin.png";
import Alerta from "../../assets/img/alerta.png";
//endpoints para consumir api
import { editarUsuario, eliminarUsuario, getUsuarios, crearUsuario, verificarExistenciaCorreo, verificarExistenciaTelefono } from "../../services/usuarios/ApiUsuarios";

const Inicio = () => {
  // Estados para gestionar los usuarios y formularios
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [usuarioEditar, setusuarioEditar] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [usuarioEliminar, setUsuarioEliminar] = useState(false);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminado,setUsuarioEliminado] = useState();

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
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.clave || !nuevoUsuario.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    const correoExistente = await verificarExistenciaCorreo(nuevoUsuario.correo);
    if (correoExistente) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El correo ya existe!"
      });
      return;
    }
    const telefonoExistente = await verificarExistenciaTelefono(nuevoUsuario.telefono);
    if (telefonoExistente) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El teléfono ya existe!"
      });
      return;
    }
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(nuevoUsuario.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    const telefonoValido = /^\d{10}$/.test(nuevoUsuario.telefono);
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    if (nuevoUsuario.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener más de 6 caracteres!"
      });
      return;
    }
    if (!/[A-Z]/.test(nuevoUsuario.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos una letra mayúscula!"
      });
      return;
    }
    if (!/[a-z]/.test(nuevoUsuario.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos una letra minúscula!"
      });
      return;
    }
    if (!/[0-9]/.test(nuevoUsuario.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos un número!"
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
      const data = await crearUsuario(nuevo);
      if (data) {
        setUsuarios([...usuarios, data]);
        setNuevoUsuario({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: "Icono personalizado",
          title: `¡Usuario <span style="color: green;">${nuevoUsuario.nombre}</span> creado correctamente!`
        });
      }
      setModalInsertarAbierto(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // Maneja el cambio en los campos para editar un usuario
  const handleChangeEditar = (e) => {
    setusuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value });
  };

  // Maneja el proceso de editar
  const handleUsuarioEditar = async (e) => {
    e.preventDefault();
    if (!usuarioEditar.nombre || !usuarioEditar.telefono || !usuarioEditar.correo || !usuarioEditar.clave || !usuarioEditar.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(usuarioEditar.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    const telefonoValido = /^\d{10}$/.test(usuarioEditar.telefono);
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    if (usuarioEditar.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener más de 6 caracteres!"
      });
      return;
    }
    if (!/[A-Z]/.test(usuarioEditar.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos una letra mayúscula!"
      });
      return;
    }
    if (!/[a-z]/.test(usuarioEditar.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos una letra minúscula!"
      });
      return;
    }
    if (!/[0-9]/.test(usuarioEditar.clave)) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La clave debe tener al menos un número!"
      });
      return;
    }
    if (usuarioEditar.nombre.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡El nombre debe tener más de 6 caracteres!"
      });
      return;
    }
    try {
      await editarUsuario(Number(usuarioEditar.id), usuarioEditar);
      setUsuarios(usuarios.map(u => u.id === usuarioEditar.id ? usuarioEditar : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: `¡Usuario <span style="color: #3366CC;">${usuarioEditar.nombre}</span> editado correctamente!`
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
      title: `¡Usuario <span style="color: red;">${usuarioEliminado.nombre}</span> eliminado correctamente!`
    });
  };

  // Define las columnas de la tabla
  const columnas = [
    { key: "fotoPerfil", label: "Foto", icon: fotoPerfil},
    { key: "nombre", label: "Nombre", icon2:nombreIcon },
    { key: "telefono", label: "Teléfono", icon:telefono, icon2: telefono },
    { key: "correo", label: "Correo", icon:correo, icon2:correo },
    { key: "id_rol", label: "Rol", transform: obtenerRol, icon:rol, icon2:rol },
    { key: "acciones", label: "Acciones", icon2:ajustes },
  ];

  // Definición de las acciones que se pueden hacer en una fila
  const acciones = (fila) => {
    return (
      <div className="flex justify-center gap-4">
        <div className="relative group">
          <button
            className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => abrirModalEditar(fila)}>
            <img src={editar} alt="Editar" className="absolute" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </div>
        {fila.id_rol !== "Admin" ? (
          <div className="relative group">
            <button
              onClick={() => setModalSinFincasAbierto(true)}
              className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
              <img src={sinFincas} alt="Ver" className="absolute"/>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        ) : null}
        {fila.id_rol === "Admin" && (
          <div className="relative group">
            <Link to={`/lista-fincas/${fila.id}`} className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">

                <img src={ver} alt="Ver" className="absolute"/>

              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver
              </span>
            </Link>
          </div>
        )}
        <div className="relative group">
          <button
            onClick={() => abrirModalEliminar(fila.id)}
            className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={eliminar} alt="Eliminar" className="absolute"/>
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
    setusuarioEditar(usuarioNecesario);
    setModalEditarAbierto(true);
  };

  const abrirModalEliminar = (id) => {
    const usuarioPrev = usuarios.find(usuario => usuario.id === id);
    setUsuarioEliminado(usuarioPrev)
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
      <MostrarInfo
        titulo="Usuarios registrados"
        columnas={columnas}
        datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Crear usuario</h5>
            <hr />
            <form onSubmit={handleCrearUsuario}>
              <div className="relative w-full mt-2">
                <img src={usuarioAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={telefonoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={correoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="correo"
                  placeholder="Correo"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={claveAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={rolAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="id_rol"
                  value={nuevoUsuario.id_rol}
                  onChange={handleChange}
                  required>
                  <option value=""> ID Rol </option>
                  <option value="1">Super Admin</option>
                  <option value="2">Administrador</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalInsertarAbierto(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Editar usuario</h5>
            <hr />
            <form onSubmit={handleUsuarioEditar}>
              <div className="relative w-full mt-2">
                <img src={usuarioAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.nombre}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={telefonoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.telefono}
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={correoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.correo}
                  type="text"
                  name="correo"
                  placeholder="Correo electrónico"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={claveAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.clave}
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  onChange={handleChangeEditar} />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEditarAbierto(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
                  Guardar y actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Sin fincas</h5>
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
                  onClick={() => setModalSinFincasAbierto(false)}>
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
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar usuario</h5>
            <hr />
            <form onSubmit={handleEliminarUsuario}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el usuario <strong className="text-red-600">{usuarioEliminado.nombre}</strong> de manera permanente.</p>
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
};

export default Inicio;