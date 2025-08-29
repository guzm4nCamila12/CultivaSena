import { useState, useEffect } from "react";
import { postValidarpermisos } from "../services/usuarios/ApiUsuarios";

export const usePermisos = (id) => {
  const [permisos, setPermisos] = useState({});

  // Lista de permisos que quieres validar
  const listaPermisos = [
    "ver zonas",
    "ver actividades",
    "ver sensores",
    "ver alternos",
    "ver fincas",

    "editar zonas",
    "editar actividades",
    "editar fincas",
    "editar usuarios",
    "editar sensores",

    "eliminar zonas",
    "eliminar actividades",
    "eliminar fincas",
    "eliminar sensores",

    "crear zonas",
    "crear actividades",
    "crear fincas",
    "crear sensores",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consultar todos los permisos en paralelo
        const respuestas = await Promise.all(
          listaPermisos.map(nombrePermiso =>
            postValidarpermisos({ nombrePermiso })
          )
        );

        // Convertir las respuestas a un objeto { "editar fincas": {tienePermiso: true}, ... }
        const permisosObj = {};
        listaPermisos.forEach((permiso, i) => {
          permisosObj[permiso] = respuestas[i];
        });

        setPermisos(permisosObj);
      } catch (error) {
        console.error("Error al consultar permisos:", error);
      }
    };

    fetchData();
  }, []);



  return {
    permisos
  };
};