/* File: src/hooks/useActividadesZona.js */
import { useEffect, useState } from 'react';
import { getActividadesByZona, getZonasById, eliminarActividad, crearActividad, editarActividad } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import * as Images from '../assets/img/imagesExportation';
import {jwtDecode} from 'jwt-decode';

export const useActividadesZona = (idZona) => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const idusuario = decodedToken.id;
  const rolusuario = decodedToken.idRol;

  const [actividades, setActividades] = useState([]);
  const [zonas, setZonas] = useState({});
  const [actividadEliminar, setActividadEliminar] = useState(null);

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalActividadInsertar, setModalActividadInsertar] = useState(false);
  const [modalEditarActividad, setModalEditarActividad] = useState(false);

  const [actividadEditar, setActividadEditar] = useState({});
  const [nuevaActividad, setNuevaActividad] = useState({
    idzona: null,
    cultivo: "",
    etapa: "",
    actividad: "",
    descripcion: "",
    fechainicio: "",
    fechafin: "",
    idusuario: null
  });

  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");

  const etapas = [
    { value: '1', label: 'Preparar el terreno' },
    { value: '2', label: 'Siembra' },
    { value: '3', label: 'Crecer y madurar' },
    { value: '4', label: 'Cosecha' },
    { value: '5', label: 'Comercialización' }
  ];

  const actividadesPorEtapa = {
    "1": [
      { value: "1", label: "Arar o remover el suelo" },
      { value: "2", label: "Limpiar las malas hierbas" },
      { value: "3", label: "Abonar el campo" },
      { value: "4", label: "Otros" }
    ],
    "2": [
      { value: "1", label: "Poner las semillas en la tierra" },
      { value: "2", label: "Regar después de sembrar" },
      { value: "3", label: "Cubrir las semillas con tierra" },
      { value: "4", label: "Otros" }
    ],
    "3": [
      { value: "1", label: "Regar para que crezcan bien" },
      { value: "2", label: "Aplicar fertilizante" },
      { value: "3", label: "Deshierbar el cultivo" },
      { value: "4", label: "Otros" }
    ],
    "4": [
      { value: "1", label: "Recoger los frutos" },
      { value: "2", label: "Clasificar la cosecha" },
      { value: "3", label: "Empacar lo recolectado" },
      { value: "4", label: "Otros" }
    ],
    "5": [
      { value: "1", label: "Preparar la venta o distribución" },
      { value: "2", label: "Organizar el empaque para la venta" },
      { value: "3", label: "Llevar los productos al mercado" },
      { value: "4", label: "Otros" }
    ]
  };

  useEffect(() => {
    getActividadesByZona(idZona)
      .then(data => setActividades(data || []))
      .catch(console.error);
    getZonasById(idZona)
      .then(data => setZonas(data || {}))
      .catch(console.error);
  }, [idZona]);

  const handleActividadChange = (e) => {
    const { name, value } = e.target;
    setNuevaActividad(prev => ({ ...prev, [name]: value }));
  };

  const handleEtapaChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;
    const etapaLabel = options[selectedIndex].text;
    setEtapaSeleccionada(value);
    setNuevaActividad(prev => ({ ...prev, [name]: etapaLabel }));
    setActividadEditar(prev => ({ ...prev, [name]: etapaLabel }));
  };

  const handleEditarActividadChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;
    if (name === 'actividad') {
      const actividadObj = actividadesPorEtapa[etapaSeleccionada]?.find(act => act.value === value);
      if (actividadObj) {
        setActividadEditar(prev => ({ ...prev, [name]: actividadObj.label }));
        return;
      }
    }
    setActividadEditar(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearActividad = (e) => {
    e.preventDefault();
    const inicio = new Date(nuevaActividad.fechainicio);
    const fin = new Date(nuevaActividad.fechafin);
    if (fin < inicio) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: 'Icono personalizado',
        title: '¡La fecha de fin no puede ser antes de la fecha de inicio!'
      });
      return;
    }
    crearActividad(nuevaActividad)
      .then(() => getActividadesByZona(idZona))
      .then(data => setActividades(data || []))
      .catch(console.error);
    setModalActividadInsertar(false);
    acctionSucessful.fire({
      imageUrl: Images.usuarioCreado,
      imageAlt: 'Icono personalizado',
      title: '¡Actividad creada correctamente!'
    });
  };

  const handleEditarActividad = (e) => {
    e.preventDefault();
    if (rolusuario === 3 && actividadEditar.idusuario !== idusuario) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: 'Icono personalizado',
        title: '¡No tienes permiso para editar esta actividad!'
      });
      return;
    }
    const inicio = new Date(actividadEditar.fechainicio);
    const fin = new Date(actividadEditar.fechafin);
    if (fin < inicio) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: 'Icono personalizado',
        title: '¡La fecha de fin no puede ser antes de la fecha de inicio!'
      });
      return;
    }
    editarActividad(actividadEditar.id, actividadEditar)
      .then(() => setActividades(prev => prev.map(a => a.id === actividadEditar.id ? actividadEditar : a)))
      .catch(console.error);
    setModalEditarActividad(false);
    acctionSucessful.fire({
      imageUrl: Images.usuarioCreado,
      imageAlt: 'Icono personalizado',
      title: '¡Actividad editada correctamente!'
    });
  };

  const handleEliminarActividad = (e) => {
    e.preventDefault();
    const actividad = actividades.find(a => a.id === actividadEliminar);
    if (rolusuario === 3 && actividad?.idusuario !== idusuario) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: 'Icono personalizado',
        title: '¡No tienes permiso para eliminar esta actividad!'
      });
      setModalEliminarAbierto(false);
      return;
    }
    eliminarActividad(actividadEliminar)
      .then(() => setActividades(prev => prev.filter(a => a.id !== actividadEliminar)))
      .catch(console.error);
    setModalEliminarAbierto(false);
    acctionSucessful.fire({
      imageUrl: Images.UsuarioEliminado,
      imageAlt: 'Icono personalizado',
      title: '¡Actividad eliminada correctamente!'
    });
  };

  const abrirModalEliminar = (id) => {
    setActividadEliminar(id);
    setModalEliminarAbierto(true);
  };

  const abrirModalEditar = (actividad) => {
    setActividadEditar(actividad);
    const etapaObj = etapas.find(et => et.label === actividad.etapa);
    setEtapaSeleccionada(etapaObj ? etapaObj.value : '');
    setModalEditarActividad(true);
  };

  const handleAbrirModalCrear = (idZone) => {
    setNuevaActividad(prev => ({ ...prev, idzona: idZone, idusuario }));
    setModalActividadInsertar(true);
  };

  return {
    actividades,
    zonas,
    etapas,
    actividadesPorEtapa,
    etapaSeleccionada,
    nuevaActividad,
    actividadEditar,
    modalEliminarAbierto,
    modalActividadInsertar,
    modalEditarActividad,
    setModalEliminarAbierto,
    setModalActividadInsertar,
    setModalEditarActividad,
    handleActividadChange,
    handleEtapaChange,
    handleCrearActividad,
    handleEditarActividadChange,
    handleEditarActividad,
    handleEliminarActividad,
    abrirModalEliminar,
    abrirModalEditar,
    handleAbrirModalCrear,
    idusuario,
    rolusuario
  };
};