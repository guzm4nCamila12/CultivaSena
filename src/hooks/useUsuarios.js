// hooks/useUsuarios.js
import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario, editarUsuario, eliminarUsuario, getUsuarioById } from "../services/usuarios/ApiUsuarios";
import * as Validaciones from '../utils/validaciones';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios).catch(console.error);
  }, []);

  const validarUsuario = (usuario) => {
    if (!Validaciones.validarCamposUsuario(usuario)) return false;
    if(!Validaciones.validarNombre(usuario.nombre)) return false;
    if(!Validaciones.validarTelefono(usuario.telefono)) return false;
    if(!Validaciones.validarCorreo(usuario.correo)) return false;
    if(!Validaciones.validarClave(usuario.clave)) return false;

    return true
  }

  const agregarUsuario = async (usuario) => {
   if(!validarUsuario(usuario)) return ;
    if (!await Validaciones.comprobarCredenciales(usuario)) return false;

    const data = await crearUsuario({ ...usuario, id_rol: Number(usuario.id_rol) });
    if (data) setUsuarios(prev => [...prev, data]);
    return data;
  };


  const actualizarUsuario = async (usuarioEditado, original) => {
    const huboCambios = Validaciones.validarSinCambios(usuarioEditado, original, "el usuario", ["id_rol"]);
    if (!huboCambios) return false;
    if(!validarUsuario(usuarioEditado)) return false;
    if (!await Validaciones.comprobarCredenciales(usuarioEditado, usuarioEditado.id)) return false;

    await editarUsuario(usuarioEditado.id, usuarioEditado);
    setUsuarios(prev => prev.map(u => u.id === usuarioEditado.id ? usuarioEditado : u));
    return true;
  };

  const eliminarUsuarioPorId = async (id) => {
    await eliminarUsuario(id);
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return { usuarios, agregarUsuario, actualizarUsuario, eliminarUsuarioPorId };
};