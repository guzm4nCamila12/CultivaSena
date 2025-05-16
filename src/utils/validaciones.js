import { acctionSucessful } from "../components/alertSuccesful";
import * as Images from "../assets/img/imagesExportation";
import { verificarExistenciaTelefono, verificarExistenciaCorreo } from "../services/usuarios/ApiUsuarios";

export const validarCamposUsuario = (usuario) => {
  if (!usuario.nombre || !usuario.telefono || !usuario.correo || !usuario.clave || !usuario.id_rol) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡Por favor, complete todos los campos!"
    });
    return false;
  }
  return true;
};

export const validarCorreo = (correo) => {
  const correoValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(correo);
  if (!correoValido) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡El correo electrónico no es válido!"
    });
    return false;
  }
  return true;
};

export const validarTelefono = (telefono) => {
  const telefonoValido = /^\d{10}$/.test(telefono);
  if (!telefonoValido) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡El número de teléfono no es válido!"
    });
    return false;
  }
  return true;
};

export const validarClave = (clave) => {
  if (clave.length < 6) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡La clave debe tener más de 6 caracteres!"
    });
    return false;
  }
  if (!/[A-Z]/.test(clave)) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡La clave debe tener al menos una letra mayúscula!"
    });
    return false;
  }
  if (!/[a-z]/.test(clave)) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡La clave debe tener al menos una letra minúscula!"
    });
    return false;
  }
  if (!/[0-9]/.test(clave)) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡La clave debe tener al menos un número!"
    });
    return false;
  }
  return true;
};

export const validarNombre = (nombre) => {
  if (!nombre) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡Ingrese un nombre!"
    });
    return false;
  }
  if (nombre.length < 6) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡El nombre debe tener más de 6 caracteres!"
    });
    return false;
  }
  return true;
};

export const validarSinCambios = (original, editado) => {
  if (
    editado.nombre === original.nombre &&
    editado.telefono === original.telefono &&
    editado.correo === original.correo &&
    editado.clave === original.clave &&
    editado.id_rol === original.id_rol
  ) {
    acctionSucessful.fire({
      imageUrl: Images.Alerta,
      title: "¡No se modificó la información de el alterno!"
    });
    return false;
  }
  return true;
};

export const comprobarCredenciales = async (usuario, idIgnorar = null) => {
    const telefonoExistente = await verificarExistenciaTelefono(usuario.telefono, idIgnorar);
    if (telefonoExistente) {
      await acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: "¡El teléfono ya existe!"
      });
      return ;
    }
  
    const correoExistente = await verificarExistenciaCorreo(usuario.correo, idIgnorar);
    if (correoExistente) {
      await acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: "¡El correo ya existe!"
      });
      return ;
    }
  
    return true;
  };
