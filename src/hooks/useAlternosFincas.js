// hooks/useAlternosFinca.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUsuarioByIdRol,
  eliminarUsuario,
  crearUsuario,
  editarUsuario,
} from "../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../services/fincas/ApiFincas";
import {
  validarCamposUsuario,
  validarCorreo,
  validarTelefono,
  validarClave,
  validarNombre,
  validarSinCambios,
  comprobarCredenciales
} from "../utils/validaciones";
import { acctionSucessful } from "../components/alertSuccesful";
import usuarioCreado from "../assets/img/usuarioCreado.png";
import usuarioEliminado from "../assets/img/usuarioEliminado.png";

const useAlternosFinca = () => {
  const { id } = useParams();

  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ tipo_documento: "", documento: "", nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });
  const [usuarioEditar, setusuarioEditar] = useState({ id, tipo_documento:"", nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0, id_rol: 3, id_finca: parseInt(id) });

  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(false);
  const [alternoEditado, setAlternoEditado] = useState();
  const [alternoEliminar, setAlternoEliminar] = useState();

  const [mostrarClave, setMostrarClave] = useState(false);
  const handleToggleClave = () => setMostrarClave(!mostrarClave);

  useEffect(() => {
    getUsuarioByIdRol(id).then(data => setUsuarios(data || [])).catch(console.error);
    getFincasByIdFincas(id).then(data => setFincas(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCamposUsuario(nuevoUsuario)) return;
    if (!validarCorreo(nuevoUsuario.correo)) return;
    if (!validarTelefono(nuevoUsuario.telefono)) return;
    if (!validarClave(nuevoUsuario.clave)) return;
    if (!validarNombre(nuevoUsuario.nombre)) return;

    const credencialesValidas = await comprobarCredenciales(nuevoUsuario);
    if (!credencialesValidas) return;
    crearUsuario(nuevoUsuario).then((data) => {
      setUsuarios([...usuarios, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        title: `¡Alterno <span style="color: green;">${nuevoUsuario.nombre}</span> creado correctamente!`
      });
    }).catch(console.error);
    setNuevoUsuario({tipo_documento: "", documento:"", nombre: "", telefono: "", correo: "", clave: "", id_rol: 3})
  };

  const handleEditarAlterno = async (e) => {
    e.preventDefault();

    if (!validarCamposUsuario(usuarioEditar)) return;
    if (!validarCorreo(usuarioEditar.correo)) return;
    if (!validarTelefono(usuarioEditar.telefono)) return;
    if (!validarClave(usuarioEditar.clave)) return;
    if (!validarNombre(usuarioEditar.nombre)) return;
    if (!validarSinCambios(usuarioEditar, alternoEditado, "el alterno")) return;

    const credencialesValidas = await comprobarCredenciales(usuarioEditar, usuarioEditar.id);
    if (!credencialesValidas) return;

    editarUsuario(usuarioEditar.id, usuarioEditar).then(() => {
      setUsuarios(prev => prev.map(u => u.id === usuarioEditar.id ? usuarioEditar : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        title: `¡Alterno <span style="color: #3366CC;">${usuarioEditar.nombre} </span> editado correctamente!`
      });
      setModalEditarAbierto(false);
    });
  };

  const handleEliminarAlterno = () => {
    eliminarUsuario(usuarioEliminar).then(() => {
      setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioEliminar));
      setModalEliminarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioEliminado,
        title: `¡Alterno <span style="color: red;">${alternoEliminar?.nombre}</span> eliminado correctamente!`
      });
    }).catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    const alterno = usuarios.find(usuario => usuario.id === id);
    setAlternoEliminar(alterno);
    setUsuarioEliminar(id);
    setModalEliminarAbierto(true);
  };

  return {
    id,
    fincas,
    usuarios,
    nuevoUsuario,
    usuarioEditar,
    modalInsertarAbierto,
    modalEditarAbierto,
    modalEliminarAbierto,
    mostrarClave,
    alternoEliminar,
    alternoEditado,
    setNuevoUsuario,
    setusuarioEditar,
    setModalInsertarAbierto,
    setModalEditarAbierto,
    setModalEliminarAbierto,
    handleToggleClave,
    handleSubmit,
    handleEditarAlterno,
    handleEliminarAlterno,
    abrirModalEliminar,
    setAlternoEditado,
  };
};

export default useAlternosFinca;
