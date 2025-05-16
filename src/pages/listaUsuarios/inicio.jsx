//importaciones necesarias de react
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//componentes reutilizados
import MostrarInfo from "../../components/mostrarInfo";
import { acctionSucessful } from "../../components/alertSuccesful";
import NavBar from "../../components/navbar";
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import * as Validaciones from '../../utils/validaciones'
//Iconos e imagenes
import * as Icons from "../../assets/icons/IconsExportation";
import * as Images from "../../assets/img/imagesExportation";

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
  const [usuarioEliminado, setUsuarioEliminado] = useState();
  const [usuarioOriginal, setUsuarioOriginal] = useState(null);

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

  //Validar los campos de el usuario
  const validarUsuario = (usuario) => {
    // 1. Validar que todos los campos estén llenos
    if (!usuario.nombre || !usuario.telefono || !usuario.correo || !usuario.clave || !usuario.id_rol) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: "¡Por favor, complete todos los campos!"
      });
      return false;
    }
  
    // 2. Validaciones individuales (se ejecutan en orden si todo está lleno)
    if (!Validaciones.validarNombre(usuario.nombre)) return false;
    if (!Validaciones.validarCorreo(usuario.correo)) return false;
    if (!Validaciones.validarTelefono(usuario.telefono)) return false;
    if (!Validaciones.validarClave(usuario.clave)) return false;
  
    // Todo pasó
    return true;
  };
  
  

  const comprobarCredenciales = async (usuario, idIgnorar = null) => {
    const telefonoExistente = await verificarExistenciaTelefono(usuario.telefono, idIgnorar);
    if (telefonoExistente) {
      await acctionSucessful.fire({ imageUrl: Images.Alerta, title: "¡El teléfono ya existe!" });
      return false;
    }

    const correoExistente = await verificarExistenciaCorreo(usuario.correo, idIgnorar);
    if (correoExistente) {
      await acctionSucessful.fire({ imageUrl: Images.Alerta, title: "¡El correo ya existe!" });
      return false;
    }

    return true;
  };



  // Maneja el cambio en los campos para agregar un nuevo usuario
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  // Maneja el proceso de agregar un usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();

    if (!validarUsuario(nuevoUsuario)) return
    // if (errores.length > 0) {
    //   acctionSucessful.fire({
    //     imageUrl: Images.Alerta,
    //     title: errores[0] // Mostrar solo el primer error
    //   });
    //   return;
    // }

    const credencialesValidas = await comprobarCredenciales(nuevoUsuario);
    if (!credencialesValidas) return;

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
          imageUrl: Images.usuarioCreado,
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
    // Comprobar si la información fue modificada
    const sinCambios =
      usuarioEditar.nombre === usuarioOriginal.nombre &&
      usuarioEditar.telefono === usuarioOriginal.telefono &&
      usuarioEditar.correo === usuarioOriginal.correo &&
      usuarioEditar.clave === usuarioOriginal.clave &&
      Number(usuarioEditar.id_rol) === Number(enviarRol(usuarioOriginal.id_rol))
      ;
    if (sinCambios) {
      await acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: "No se modificó la información del usuario"
      });
      return;
    }
    const errores = validarUsuario(usuarioEditar, false);

    if (errores.length > 0) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: errores[0]
      });
      return;
    }

    const credencialesValidas = await comprobarCredenciales(usuarioEditar, Number(usuarioEditar.id));

    if (!credencialesValidas) return;

    try {
      await editarUsuario(Number(usuarioEditar.id), usuarioEditar);
      setUsuarios(usuarios.map(u => u.id === usuarioEditar.id ? usuarioEditar : u));
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
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
      imageUrl: Images.UsuarioEliminado,
      imageAlt: "Icono personalizado",
      title: `¡Usuario <span style="color: red;">${usuarioEliminado.nombre}</span> eliminado correctamente!`
    });
  };

  // Define las columnas de la tabla
  const columnas = [
    { key: "fotoPerfil", label: "Foto", icon: Images.fotoPerfil },
    { key: "nombre", label: "Nombre", icon2: Icons.nombreIcon },
    { key: "telefono", label: "Teléfono", icon: Icons.telefono, icon2: Icons.telefono },
    { key: "correo", label: "Correo", icon: Icons.correo, icon2: Icons.correo },
    { key: "id_rol", label: "Rol", transform: obtenerRol, icon: Icons.rol, icon2: Icons.rol },
    { key: "acciones", label: "Acciones", icon2: Icons.ajustes },
  ];

  // Definición de las acciones que se pueden hacer en una fila
  const acciones = (fila) => {
    return (
      <div className="flex justify-center gap-4">
        <div className="relative group">
          <button
            className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            onClick={() => abrirModalEditar(fila)}>
            <img src={Icons.editar} alt="Editar" className="absolute" />
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
              <img src={Icons.sinFincas} alt="Ver" className="absolute" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        ) : null}
        {fila.id_rol === "Admin" && (
          <div className="relative group">
            <Link to={`/lista-fincas/${fila.id}`} className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
              <img src={Icons.ver} alt="Ver" className="absolute" />
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
            <img src={Icons.eliminar} alt="Eliminar" className="absolute" />
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
    setUsuarioOriginal({ ...usuario });
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
      <FormularioModal
        titulo={"Crear Usuario"}
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={handleCrearUsuario}
        valores={nuevoUsuario}
        onChange={handleChange}
        textoBoton="Crear"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: Icons.usuarioAzul },
          { name: "telefono", placeholder: "Teléfono", icono: Icons.telefonoAzul },
          { name: "correo", placeholder: "Correo", icono: Icons.correoAzul },
          { name: "clave", placeholder: "Clave", icono: Icons.claveAzul, type: "password" },
          {
            name: "id_rol",
            placeholder: "Seleccione un rol",
            type: "select",
            options: [
              { value: 1, label: "SuperAdmin" },
              { value: 2, label: "Admin" },
            ],
          }
        ]}
      />

      <FormularioModal
        isOpen={modalEditarAbierto}
        titulo={"Editar Usuario"}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={handleUsuarioEditar}
        valores={usuarioEditar}
        textoBoton="Guardar y actualizar"
        onChange={handleChangeEditar}
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: Icons.usuarioAzul },
          { name: "telefono", placeholder: "Teléfono", icono: Icons.telefonoAzul },
          { name: "correo", placeholder: "Correo", icono: Icons.correoAzul },
          { name: "clave", placeholder: "Clave", icono: Icons.claveAzul },
        ]}
      />

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Sin fincas</h5>
            <hr />
            <form>
              <div className="flex justify-center my-4">
                <img src={Images.sinFinca} alt="icono" />
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
      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarUsuario}
        title="Eliminar Sensor"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>Se eliminará el usuario <strong className="text-red-600">{usuarioEliminado?.nombre}</strong> de manera permanente.</h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default Inicio;