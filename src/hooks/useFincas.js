import { useState, useEffect } from 'react';
import { getUsuarioById, postValidarpermisos } from "../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import UsuarioEliminado from '../assets/img/usuarioEliminado.png';

export const useFincas = (id) => {
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(null);
  const [nombreFincaEliminar, setNombreFincaEliminar] = useState('');
  const [permisos, setPermisos] = useState({});


  // Lista de permisos que quieres validar
  const listaPermisos = [
    "editar fincas",
    "eliminar fincas",
    "crear fincas",
    "ver fincas",
    "ver zonas",
    "ver sensores",
    "ver alternos"
  ];

  useEffect(() => {
    // Cargar los datos del usuario
    const fetchData = async () => {
      try {
        const usuarioData = await getUsuarioById(id);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }

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
  }, [id]);

  useEffect(() => {
    // Cargar los datos del las fincas
    const fetchData = async () => {
      try {
        console.log("chimpanzini bananini")
        const fincasData = await getFincasById(id);
        setFincas(fincasData || []);
        console.log("use fincas", fincasData)
        console.log("id:", id)
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [id]);


  const handleEliminarFinca = () => {
    eliminarFincas(fincaEliminar)
      .then(() => {
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar));
        setModalEliminarAbierto(false);
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono de eliminación',
          title: `¡Finca <span style="color: red;">${nombreFincaEliminar}</span> eliminada correctamente!`
        });
      })
      .catch((error) => console.error('Error al eliminar la finca:', error));
  };

  const abrirModalEliminar = (id) => {
    const finca = fincas.find(finca => finca.id === id);
    setNombreFincaEliminar(finca?.nombre);
    setFincaEliminar(id);
    setModalEliminarAbierto(true);
  };

  return {
    fincas,
    usuario,
    modalEliminarAbierto,
    fincaEliminar,
    nombreFincaEliminar,
    permisos,
    abrirModalEliminar,
    handleEliminarFinca,
    setModalEliminarAbierto,
  };
};