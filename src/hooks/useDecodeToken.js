import { jwtDecode } from 'jwt-decode';

const obtenerInfoUsuario = () => {
  const token = localStorage.getItem('session');
  return token ? jwtDecode(token) : {};
};

export const obtenerRol = () => {
  const decoded = obtenerInfoUsuario();
  return decoded.idRol;  
};

export const obtenerIdUsuario = () => {
  const decoded = obtenerInfoUsuario();
  return decoded.id;  
};

export const obtenerNombre = () => {
  const decoded = obtenerInfoUsuario();
  return decoded.nombre;  
};

export const obtenerFinca = () =>{
  const decode = obtenerInfoUsuario();
  return decode.idFinca
}