// hooks/useRoles.js

export const useRoles = () => {
    // Función para obtener el nombre del rol basado en su ID
    const obtenerNombreRol = (id_rol) => {
      switch (id_rol) {
        case 1:
          return "SuperAdmin";
        case 2:
          return "Admin";
        case 3:
          return "Alterno";
        default:
          return "Desconocido";
      }
    };
  
    // Función para obtener el ID basado en el nombre del rol
    const obtenerIdRol = (nombreRol) => {
      switch (nombreRol) {
        case "SuperAdmin":
          return 1;
        case "Admin":
          return 2;
        case "Alterno":
          return 3;
        default:
          return null;
      }
    };
  
    // Devolvemos las funciones para ser utilizadas en otros componentes
    return {
      obtenerNombreRol,
      obtenerIdRol
    };
  };
  