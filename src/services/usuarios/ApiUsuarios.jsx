import { obtenerIdUsuario } from '../../hooks/useDecodeToken';
import { fetchConToken, fetchSinToken, fetchConTokenFormData } from '../fetchHelpers';
//URL base de la api

//Funcion para obtener todos los usuarios
export const getUsuarios = async () => fetchConToken(`/api/usuario`);


//Funcion para obtener un usuario por su ID
export const getUsuarioById = async (id) => 
  fetchConToken(`/api/usuario/${id}`)


//Funcion para obtener un usuario por su ID pero con rol alterno
export const getUsuarioByIdRol = async (id) => 
  fetchConToken(`/usuarios/alterno/${id}`);


//Funcion para iniciar sesion
export const login = async (inicioUsuario) => 
  fetchSinToken(`/login`, {
    method: "POST",
    body: JSON.stringify(inicioUsuario)
  })



//Funcion para insertar un usuario
export const crearUsuario = async (nuevoUsuario) => 
  fetchConToken(`/usuario`,{
    method: "POST",
    body: JSON.stringify(nuevoUsuario),
  })



//Funcion para actualizar un usuario existente
export const editarUsuario = async (idUsuario, formData, idAdmin) => {
  fetchConToken(`/api/usuario/${idUsuario}/${idAdmin}`,{
    method: "PUT",
    body: JSON.stringify(formData)
  })
};

//Funcion para eliminar un usuario
export const eliminarUsuario = async (id) => {
  fetchConToken(`/api/usuario/${id}/${obtenerIdUsuario()}`, {
     method: "DELETE" 
    });
};

//Funcion para obtener todo el historial
export const getHistorial = async () => 
  fetchConToken(`/api/historial`);
 

export const postValidarpermisos = async (permisos) =>
  fetchSinToken(`/verificarPermiso/${obtenerIdUsuario()}`,{
    method: "POST",
    body: JSON.stringify(permisos)
  })

// Función para verificar si el correo o teléfono ya existe
export const verificarExistenciaCorreo = async (correo, idIgnorar = null) => {
  const usuarios = await getUsuarios();
  const correoExistente = usuarios.find(
    usuario => usuario.correo === correo && Number(usuario.id) !== Number(idIgnorar)
  );
  return correoExistente;
};

export const verificarExistenciaTelefono = async (telefono, idIgnorar = null) => {
  const usuarios = await getUsuarios();
  const telefonoExistente = usuarios.find(
    usuario => usuario.telefono === telefono && Number(usuario.id) !== Number(idIgnorar)
  );
  return telefonoExistente;
};

 export const traerToken = (id) =>
    fetchSinToken(`/token/${id}`)
//Genera el token temporal que envia el correo
export const recuperarClave = async (telefono) =>
  fetchSinToken(`/auth/recuperar`, {
    method: "POST",
    body: JSON.stringify(telefono)
  })
//restablece la clave junto con el token temporal
export const restablecerClave = async (clave) =>
  fetchSinToken(`/auth/restablecer`, {
    method: "POST",
    body: JSON.stringify(clave)
  })