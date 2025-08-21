import {React} from 'react';
import { Navigate } from 'react-router-dom'; // Para redirigir al login
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token

const ProtectedRoute = ({ element: Component }) => {
    const token = localStorage.getItem('session'); // Obtener el token del localStorage
    const idUser = localStorage.getItem('User')
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
        //Verifica que el id del usuario sea igual al del token
        if (decodedToken.id == idUser) {
            localStorage.removeItem('token'); // Eliminar token expirado
            return <Navigate to="/login" />;
        }
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;  // Redirigir a login si ocurre un error
    }
    // Si el token es válido y el rol está permitido, renderiza el componente protegido
    return <Component />;
};
  


export default ProtectedRoute;
