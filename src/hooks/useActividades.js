// Hook personalizado para manejar la lógica relacionada con las fincas y el usuario propietario

import { useState, useEffect } from 'react';

// Servicios para obtener información del usuario y las fincas, y para eliminar fincas
import { getUsuarioById } from "../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../services/fincas/ApiFincas';

// Función para mostrar alertas visuales de éxito
import { acctionSucessful } from '../components/alertSuccesful';

// Imagen que se muestra al eliminar una finca
import UsuarioEliminado from '../assets/img/usuarioEliminado.png';

export const useFincas = (id) => {
  // Estado para almacenar las fincas del usuario
  const [fincas, setFincas] = useState([]);

  // Estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    clave: "",
    id_rol: ""
  });

  // Controla si el modal de confirmación de eliminación está abierto
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  // Almacena el ID de la finca que se desea eliminar
  const [fincaEliminar, setFincaEliminar] = useState(null);

  // Almacena el nombre de la finca que se desea eliminar (para mostrarlo en la alerta)
  const [nombreFincaEliminar, setNombreFincaEliminar] = useState('');

  // Efecto que se ejecuta cuando el hook se monta o cambia el ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const usuarioData = await getUsuarioById(id);
        setUsuario(usuarioData);

        // Obtener fincas asociadas al usuario
        const fincasData = await getFincasById(id);
        setFincas(fincasData || []);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [id]);

  // Maneja la eliminación de una finca seleccionada
  const handleEliminarFinca = () => {
    eliminarFincas(fincaEliminar)
      .then(() => {
        // Actualiza el listado de fincas sin la finca eliminada
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar));

        // Cierra el modal de confirmación
        setModalEliminarAbierto(false);

        // Muestra una alerta visual indicando éxito
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono de eliminación',
          title: `¡Finca <span style="color: red;">${nombreFincaEliminar}</span> eliminada correctamente!`
        });
      })
      .catch((error) => console.error('Error al eliminar la finca:', error));
  };

  // Abre el modal de confirmación para una finca específica
  const abrirModalEliminar = (id) => {
    const finca = fincas.find(finca => finca.id === id);
    setNombreFincaEliminar(finca?.nombre);
    setFincaEliminar(id);
    setModalEliminarAbierto(true);
  };

  // Exporta los datos y funciones necesarias para el componente que use este hook
  return {
    fincas,
    usuario,
    modalEliminarAbierto,
    fincaEliminar,
    nombreFincaEliminar,
    abrirModalEliminar,
    handleEliminarFinca,
    setModalEliminarAbierto,
  };
};
