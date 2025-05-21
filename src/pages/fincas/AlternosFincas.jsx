//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
//importacion de iconos
import * as Icons from "../../assets/icons/IconsExportation"
//imgs de los modales
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png"
import usuarioCreado from "../../assets/img/usuarioCreado.png"
//componentes reutilizados
import { acctionSucessful } from "../../components/alertSuccesful";
import MostrarInfo from "../../components/mostrarInfo";
import Navbar from "../../components/navbar";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import FormularioModal from "../../components/modals/FormularioModal";
//endpoints para consumir api
import { getUsuarioByIdRol, eliminarUsuario, crearUsuario, editarUsuario } from "../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../../services/fincas/ApiFincas";
//importacion de validaciones para los formularios
import * as Validaciones from "../../utils/validaciones";

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
  const [usuarioOriginal, setUsuarioOriginal] = useState()
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
  //Funcion genereal de validaciones en los formularios
  const validarUsuario = (usuario) => {
    if (!Validaciones.validarCamposUsuario(usuario)) return;
    if (!Validaciones.validarNombre(usuario.nombre)) return;
    if (!Validaciones.validarTelefono(usuario.telefono)) return;
    if (!Validaciones.validarCorreo(usuario.correo)) return;
    if (!Validaciones.validarClave(usuario.clave)) return;
    return true;
  }
  //Maneja el cambio de valores para agregar un nuevo usuario
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  //Maneja el envio del formulario para agregar un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarUsuario(nuevoUsuario)) return
    const credencialesValidas = await Validaciones.comprobarCredenciales(nuevoUsuario);
    if (!credencialesValidas) return;
    //Inserta el nuevo usuario
    crearUsuario(nuevoUsuario).then((data) => {
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      setNuevoUsuario({nombre: '', telefono:'', correo: '', clave:''});
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Alterno <span style="color: green;">${nuevoUsuario.nombre}</span> creado correctamente!`
      });
    }).catch(console.error);
  }

  //Maneja el cambio de valores para editar un usuario
  const handleChangeEditar = (e) => {
    setusuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value });
  };

  //Abre el modal de edicion con los datos de ese usuario
  const HandleEditarAlterno = (alterno) => {
    const { "#": removed, ...edit } = alterno;
    setusuarioEditar(edit);
    setAlternoEditado(alterno)
    setUsuarioOriginal({ ...alterno })
    setModalEditarAbierto(true);
  }

  //Maneja la edicion cuando se envia el formulario
  const handleEditarAlterno = async (e) => {
    e.preventDefault();
    if (!Validaciones.validarSinCambios(usuarioOriginal, usuarioEditar)) return
    if (!validarUsuario(usuarioEditar)) return
    const credencialesValidas = await Validaciones.comprobarCredenciales(usuarioEditar, usuarioEditar.id);
    if (!credencialesValidas) return;
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

  //Abre el modal para eliminar un usuario
  const abrirModalEliminar = (id) => {
    const alternoPrev = usuarios.find(usuarios => usuarios.id === id)
    setAlternoEliminar(alternoPrev)
    setUsuarioEliminar(id);
    setModalEliminarAbierto(true)
  }

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

  //Definicion de las columnas de la UseCards
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: Icons.nombre },
    { key: "telefono", label: "Telefono", icon: Icons.telefono, icon2: Icons.telefono },
    { key: "correo", label: "Correo", icon: Icons.correo, icon2: Icons.correo },
    { key: "acciones", label: "Acciones", icon2: Icons.ajustes },
  ];

  //Define las acciones que se pueden hacer en cada fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarAlterno(fila)}>
          <img src={Icons.editar} alt="Editar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}>
          <img src={Icons.eliminar} alt="Eliminar" className='absolute' />
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
      <FormularioModal
        titulo={"Crear Alterno"}
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={handleSubmit}
        valores={nuevoUsuario}
        onChange={handleChange}
        textoBoton="Crear"
        campos={[
          { name: "nombre", placeholder: "Nombre", icono: Icons.usuarioAzul },
          { name: "telefono", placeholder: "Teléfono", icono: Icons.telefonoAzul },
          { name: "correo", placeholder: "Correo", icono: Icons.correoAzul },
          { name: "clave", placeholder: "Clave", icono: Icons.claveAzul, type: "password" },
        ]}
      />

      <FormularioModal
        isOpen={modalEditarAbierto}
        titulo={"Editar Alterno"}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={handleEditarAlterno}
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

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={HandleEliminarAlterno}
        title="Eliminar Alterno"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>Se eliminará el alterno <strong className="text-red-600">{alternoEliminar?.nombre}</strong> de manera permanente.</h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default AlternosFinca;