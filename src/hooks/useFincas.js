import { useState, useEffect } from 'react';
import { getUsuarioById } from "../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import UsuarioEliminado from '../assets/img/usuarioEliminado.png';

export const useFincas = (id) => {
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(null);
  const [nombreFincaEliminar, setNombreFincaEliminar] = useState('');

  useEffect(() => {
    // Cargar los datos del usuario y las fincas
    const fetchData = async () => {
      try {
        const usuarioData = await getUsuarioById(id);
        setUsuario(usuarioData);
        
        const fincasData = await getFincasById(id);
        setFincas(fincasData || []);
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
    abrirModalEliminar,
    handleEliminarFinca,
    setModalEliminarAbierto,
  };
};