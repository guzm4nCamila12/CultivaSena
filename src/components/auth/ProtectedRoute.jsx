import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom'; // Para redirigir al login
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    const token = localStorage.getItem('session'); // Obtener el token del localStorage
    const idUser = localStorage.getItem('User')
    // Verificar si no hay token
    if (!token) {
        localStorage.setItem("logoutReason", "expired");
        return <Navigate to="/login" />;  // Redirigir a login si no hay token
    }
    try {
        const decodedToken = jwtDecode(token); // Decodificar el token
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos
        // Verificar si el token ha expirado
        if (decodedToken.exp < currentTime) {
            localStorage.setItem("logoutReason", "expired");
            localStorage.removeItem('token'); // Eliminar token expirado
            return <Navigate to="/login" />;  // Redirigir a login si el token ha expirado
        }
        //Verifica que el id del usuario sea igual al del token
        if (decodedToken.id == idUser) {
            localStorage.setItem("logoutReason", "expired");
            localStorage.removeItem('token'); // Eliminar token expirado
            return <Navigate to="/login" />;
        }
        const userRole = decodedToken.idRol; // Obtener el rol del usuario
        if (!allowedRoles.includes(userRole)) {
            localStorage.setItem("logoutReason", "denied"); 
            return <Navigate to="/login" />;;  // Redirigir si no tiene el rol adecuado
        }

    } catch (error) {
        localStorage.setItem("logoutReason", "expired");
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;  // Redirigir a login si ocurre un error
    }
    // Si el token es válido y el rol está permitido, renderiza el componente protegido
    return <Component />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.elementType.isRequired, // Componente que se renderiza si pasa la validación
    allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired, // Lista de roles permitidos (según tu token)
};

export default ProtectedRoute;
