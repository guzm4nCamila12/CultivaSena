//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
//iconos de las columnas
import nombre from "../../assets/icons/nombres.png"
import telefono from "../../assets/icons/telefono.png"
import correo from "../../assets/icons/correo.png"
//iconos de las acciones
import ajustes from "../../assets/icons/acciones.png"
import editar from "../../assets/icons/editar.png";
import eliminar from "../../assets/icons/eliminar.png";
//iconos de los modales
import usuarioAzul from "../../assets/icons/usuarioAzul.png"
import telefonoAzul from "../../assets/icons/telefonoAzul.png"
import correoAzul from "../../assets/icons/correoAzul.png"
import claveAzul from "../../assets/icons/claveAzul.png"
//imgs de los modales
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png"
import usuarioCreado from "../../assets/img/usuarioCreado.png"
import ConfirmarEliminar from "../../assets/img/eliminar.png"
import Alerta from "../../assets/img/alerta.png"
//componentes reutilizados
import { acctionSucessful } from "../../components/alertSuccesful";
import MostrarInfo from "../../components/mostrarInfo";
import Navbar from "../../components/navbar";
//endpoints para consumir api
import { getUsuarioByIdRol, eliminarUsuario, crearUsuario, editarUsuario, verificarExistenciaCorreo, verificarExistenciaTelefono } from "../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../../services/fincas/ApiFincas";

const AlternosFinca = () => {
  //Obtiene el ID de la URL 
  const { id } = useParams();
  //Estado para almacenar los datos
  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [usuarioEditar, setusuarioEditar] = useState({ id, nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(false)
  const [alternoEditado, setAlternoEditado] = useState()
  const [alternoEliminar, setAlternoEliminar] = useState()
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
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
    setusuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value });
  };

  //Definicion de las columnas de la UseCards
  const columnas = [
    { key: "nombre", label: "Nombre",icon2: nombre },
    { key: "telefono", label: "Telefono", icon: telefono, icon2: telefono  },
    { key: "correo", label: "Correo", icon: correo, icon2: correo },
    { key: "acciones", label: "Acciones",icon2: ajustes },
  ];

  //Abre el modal de edicion con los datos de ese usuario
  const HandleEditarAlterno = (alterno) => {
    const { "#": removed, ...edit } = alterno;
    setusuarioEditar(edit);
    setAlternoEditado(alterno)
    setModalEditarAbierto(true);
  }

  //Maneja la edicion cuando se envia el formulario
  const handleEditarAlterno = async (e) => {
    e.preventDefault();
    if (!usuarioEditar.nombre || !usuarioEditar.telefono || !usuarioEditar.correo || !usuarioEditar.clave || !usuarioEditar.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    // Validación del formato del correo
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(usuarioEditar.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    // Validación del teléfono (puedes adaptarlo al formato que necesites)
    const telefonoValido = /^\d{10}$/.test(usuarioEditar.telefono);  // Suponiendo que el teléfono debe tener 10 dígitos
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    // Validación de la clave (mínimo 6 caracteres, puedes modificar la longitud mínima)
    if (usuarioEditar.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡La clave debe tener más de 6 caracteres!"
      });
      return;
    }
    if (alternoEditado.nombre == usuarioEditar.nombre && alternoEditado.telefono == usuarioEditar.telefono && alternoEditado.correo == usuarioEditar.correo) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono",
        title: "¡No se modificó la información del alterno"
      })
      return
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
        imageAlt: 'Icono personalizado',
        title: "¡El nombre debe tener más de 6 caracteres!"
      });
      return;
    }

    //Realiza la actualizacion
    editarUsuario(usuarioEditar.id, usuarioEditar).then(() => {
      //Actualiza la lista de usuarios
      setUsuarios(usuarios.map(u => u.id === usuarioEditar.id ? usuarioEditar : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Alterno <span style="color: #3366CC;">${usuarioEditar.nombre} </span> editado correctamente!`
      });
      setModalEditarAbierto(false);
    });
  };

  //Maneja la eliminacion de un usuario
  const HandleEliminarAlterno = (e) => {
    e.preventDefault();
    //Elimina el usuario
    eliminarUsuario(usuarioEliminar).then(() => {
      setUsuarios((prevUsuarios) => prevUsuarios?.filter(usuario => usuario.id !== usuarioEliminar) || []);
      setModalEliminarAbierto(false)
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: 'Icono personalizado',
        title: `¡Alterno <span style="color: red;">${alternoEliminar.nombre}</span> eliminado correctamente!`
      });
    }).catch(console.error);
  }

  const abrirModalEliminar = (id) => {
    const alternoPrev = usuarios.find(usuarios => usuarios.id === id)
    setAlternoEliminar(alternoPrev)
    setUsuarioEliminar(id);
    setModalEliminarAbierto(true)
  }

  //Maneja el envio del formulario para agregar un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.nombre || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.clave || !nuevoUsuario.id_rol) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
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
    // Validación del formato del correo
    const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(nuevoUsuario.correo);
    if (!correoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡El correo electrónico no es válido!"
      });
      return;
    }
    // Validación del teléfono (puedes adaptarlo al formato que necesites)
    const telefonoValido = /^\d{10}$/.test(nuevoUsuario.telefono);  // Suponiendo que el teléfono debe tener 10 dígitos
    if (!telefonoValido) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
        title: "¡El número de teléfono no es válido!"
      });
      return;
    }
    // Validación de la clave (mínimo 6 caracteres, puedes modificar la longitud mínima)
    if (nuevoUsuario.clave.length < 6) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: 'Icono personalizado',
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
        imageAlt: 'Icono personalizado',
        title: "¡El nombre debe tener más de 6 caracteres!"
      });
      return;
    }
    //Inserta el nuevo usuario
    crearUsuario(nuevoUsuario).then((data) => {
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Alterno <span style="color: green;">${nuevoUsuario.nombre}</span> creado correctamente!`
      });
    }).catch(console.error);
  }

  //Define las acciones que se pueden hacer en cada fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarAlterno(fila)}>
          <img src={editar} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}>
          <img src={eliminar} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
  };

  return (
    <div >
      <Navbar />
      <MostrarInfo
        titulo={`Alternos de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Crear alterno</h5>
            <hr />
            <form onSubmit={handleSubmit}>
              {/* Campos del formulario para agregar un usuario */}
              <div className="relative w-full mt-2">
                <img src={usuarioAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                  autoComplete="off"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={telefonoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="telefono"
                  placeholder="Telefono"
                  autoComplete="off"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={correoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="correo"
                  placeholder="Correo"
                  autoComplete="off"
                  onChange={handleChange} />
              </div>
              <div className="relative w-full mt-2">
                <img src={claveAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="clave"
                  placeholder="Clave"
                  autoComplete="off"
                  onChange={handleChange} />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalInsertarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
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
            <h5 className="text-xl font-semibold text-center mb-4">Editar alterno</h5>
            <hr />
            <form onSubmit={handleEditarAlterno}>
              {/* Campos del formulario para editar un usuario */}
              <div className="relative w-full mt-2">
                <img src={usuarioAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.nombre}
                  type="text"
                  name="nombre"
                  autoComplete="off"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={telefonoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.telefono}
                  type="text"
                  autoComplete="off"
                  name="telefono"
                  onChange={handleChangeEditar} />
              </div>
              <div className="relative w-full mt-2">
                <img src={correoAzul} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={usuarioEditar.correo}
                  name="correo"
                  autoComplete="off"
                  type="text"
                  onChange={handleChangeEditar} />
              </div>
              <div className="flex justify-end mt-4">
                <button type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalEditarAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
                  Guardar y actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar alterno</h5>
            <hr />
            <form onSubmit={HandleEliminarAlterno}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará el alterno <strong className="text-red-600">{alternoEliminar.nombre}</strong> de manera permanente.</p>
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

export default AlternosFinca;