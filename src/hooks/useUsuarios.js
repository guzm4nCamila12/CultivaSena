// hooks/useUsuarios.js
import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario, editarUsuario, eliminarUsuario, getUsuarioById } from "../services/usuarios/ApiUsuarios";
import * as Validaciones from '../utils/validaciones';
import { obtenerIdUsuario } from "./useDecodeToken";

export const useUsuarios = (id) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  // Función para traer todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      const admins = data.filter((u) => u.id_rol === 2);
      setUsuariosAdmin(admins);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    }
  };

  // Cargar usuarios al montar o si cambia el id
  useEffect(() => {
    fetchUsuarios();
  }, [id]);
  const validarUsuario = (usuario) => {
    if (!Validaciones.validarCamposUsuario(usuario)) return false;
    if (!Validaciones.validarNombre(usuario.nombre)) return false;
    if (!Validaciones.validarTelefono(usuario.telefono)) return false;
    if (!Validaciones.validarCorreo(usuario.correo)) return false;
    if (!Validaciones.validarClave(usuario.clave)) return false;

    return true
  }
  const agregarUsuario = async (usuario) => {
    if (!validarUsuario(usuario)) return;
    if (!await Validaciones.comprobarCredenciales(usuario)) return false;

    const data = await crearUsuario({ ...usuario, id_rol: Number(usuario.id_rol) });
    console.log("usuarios:", data)
    if (data) {
      //  Refrescar usuarios desde backend para mantener consistencia
      await fetchUsuarios();
    } return data;
  };


  const actualizarUsuario = async (usuarioEditado, original) => {
    const huboCambios = Validaciones.validarSinCambios(usuarioEditado, original, "el usuario", ["id_rol"]);
    if (!huboCambios) return false;
    if (!validarUsuario(usuarioEditado)) return false;
    if (!await Validaciones.comprobarCredenciales(usuarioEditado, usuarioEditado.id)) return false;

    await editarUsuario(usuarioEditado.id, usuarioEditado, obtenerIdUsuario());
    setUsuarios(prev => prev.map(u => u.id === usuarioEditado.id ? usuarioEditado : u));
    return true;
  };

  const eliminarUsuarioPorId = async (id) => {
    await eliminarUsuario(id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return { usuarios, usuariosAdmin, agregarUsuario, actualizarUsuario, eliminarUsuarioPorId };
};