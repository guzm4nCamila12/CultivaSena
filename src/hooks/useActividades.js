// hooks/useActividadesZona.js
import { useEffect, useState } from 'react';
import { getActividadesByZona, getZonasById, eliminarActividad, crearActividad, editarActividad } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import * as Images from '../assets/img/imagesExportation';

export const useActividadesZona = (idZona) => {
  const [actividades, setActividades] = useState([]);
  const [zonas, setZonas] = useState([]);
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
    fechafin: ""
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
    "1": [ { value: "1", label: "Arar o remover el suelo" }, { value: "2", label: "Limpiar las malas hierbas" }, { value: "3", label: "Abonar el campo" }, { value: "4", label: "Otros" } ],
    "2": [ { value: "1", label: "Poner las semillas en la tierra" }, { value: "2", label: "Regar después de sembrar" }, { value: "3", label: "Cubrir las semillas con tierra" }, { value: "4", label: "Otros" } ],
    "3": [ { value: "1", label: "Regar para que crezcan bien" }, { value: "2", label: "Aplicar fertilizante" }, { value: "3", label: "Deshierbar el cultivo" }, { value: "4", label: "Otros" } ],
    "4": [ { value: "1", label: "Recoger los frutos" }, { value: "2", label: "Clasificar la cosecha" }, { value: "3", label: "Empacar lo recolectado" }, { value: "4", label: "Otros" } ],
    "5": [ { value: "1", label: "Preparar la venta o distribución" }, { value: "2", label: "Organizar el empaque para la venta" }, { value: "3", label: "Llevar los productos al mercado" }, { value: "4", label: "Otros" } ]
  };

  useEffect(() => {
    getActividadesByZona(idZona).then((data)=>{if(data == null){setActividades([])}else{setActividades(data)}}).catch(console.error);
    getZonasById(idZona).then(setZonas).catch(console.error);
  }, [idZona]);

  const handleActividadChange = (e) => {
    const { name, value, tagName, selectedIndex } = e.target;
    const newValue = tagName === "SELECT" ? e.target.options[selectedIndex].text : value;
    setNuevaActividad(prev => ({ ...prev, [name]: newValue }));
  };

  const handleEtapaChange = (e) => {
    const { name, value, tagName, selectedIndex } = e.target;
    const etapaText = tagName === "SELECT" ? e.target.options[selectedIndex].text : value;
    setNuevaActividad(prev => ({ ...prev, [name]: etapaText }));
    setActividadEditar(prev => ({ ...prev, [name]: etapaText }));
    setEtapaSeleccionada(value);
  };

  const handleEditarActividadChange = (e) => {
    const { name, value, tagName, selectedIndex } = e.target;
    const newValue = tagName === "SELECT" ? e.target.options[selectedIndex].text : value;
    setActividadEditar(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCrearActividad = (e) => {
    const fechaInicio = new Date(nuevaActividad.fechainicio);
    const fechaFin = new Date(nuevaActividad.fechafin);
    if (fechaFin < fechaInicio) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
      });
      return;
    }

    crearActividad(nuevaActividad).then(() => {
      return getActividadesByZona(idZona);
    }).then(setActividades).catch(console.error);

    setModalActividadInsertar(false);
    acctionSucessful.fire({
      imageUrl: Images.usuarioCreado,
      imageAlt: "Icono personalizado",
      title: "¡Actividad creada correctamente!"
    });
  };

  const handleEditarActividad = (e) => {
    e.preventDefault();
    const fechaInicio = new Date(actividadEditar.fechainicio);
    const fechaFin = new Date(actividadEditar.fechafin);
    if (fechaFin < fechaInicio) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
      });
      return;
    }

    editarActividad(actividadEditar.id, actividadEditar).then(() => {
      setActividades(prev =>
        prev.map(a => (a.id === actividadEditar.id ? actividadEditar : a))
      );
      setModalEditarActividad(false);
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
        imageAlt: "Icono personalizado",
        title: "¡Actividad editada correctamente!"
      });
    }).catch(console.error);
  };

  const handleEliminarActividad = (e) => {
    e.preventDefault();
    eliminarActividad(actividadEliminar).then(() => {
      setActividades(prev => prev.filter(a => a.id !== actividadEliminar));
      setModalEliminarAbierto(false);
      acctionSucessful.fire({
        imageUrl: Images.UsuarioEliminado,
        imageAlt: "Icono personalizado",
        title: "¡Actividad eliminada correctamente!"
      });
    }).catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    setActividadEliminar(id);
    setModalEliminarAbierto(true);
  };

  const abrirModalEditar = (actividad) => {
    setActividadEditar(actividad);
    setModalEditarActividad(true);
  };

  const handleAbrirModalCrear = (idZona) => {
    setNuevaActividad(prev => ({ ...prev, idzona: idZona }));
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
    handleEditarActividadChange,
    handleEtapaChange,
    handleCrearActividad,
    handleEditarActividad,
    handleEliminarActividad,
    abrirModalEliminar,
    abrirModalEditar,
    handleAbrirModalCrear,
  };
};
