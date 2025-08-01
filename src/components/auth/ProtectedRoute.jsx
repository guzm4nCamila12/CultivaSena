import {React} from 'react';
import { Navigate } from 'react-router-dom'; // Para redirigir al login
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token

const ProtectedRoute = ({ element: Component, allowedRoles,...rest }) => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage
  // Verificar si no hay token
  if (!token) {
    return <Navigate to="/login" />;  // Redirigir a login si no hay token
  }
  try {
    const decodedToken = jwtDecode(token); // Decodificar el token
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    // Verificar si el token ha expirado
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // Eliminar token expirado
      return <Navigate to="/login" />;  // Redirigir a login si el token ha expirado
    }
    const userRole =decodedToken.idRol; // Obtener el rol del usuario
    if (!allowedRoles.includes(userRole)) {
      return;  // Redirigir si no tiene el rol adecuado
    }


  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;  // Redirigir a login si ocurre un error
  }

  // Si el token es válido y el rol está permitido, renderiza el componente protegido
  return <Component {...rest} />;
};
  


export default ProtectedRoute;
