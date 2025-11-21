import { useEffect, useState } from 'react';
import { getActividadesByZona, getZonasById, eliminarActividad, crearActividad, editarActividad } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import * as Images from '../assets/img/imagesExportation';
import { validarSinCambios } from '../utils/validaciones'
import { obtenerIdUsuario, obtenerRol } from './useDecodeToken';

export const useActividadesZona = (idZona) => {
  const idusuario = obtenerIdUsuario();
  const rolusuario = obtenerRol();

  const [actividadOriginal, setActividadOriginal] = useState({})
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
    const fetchData = async () => {
      try {
        const [actividadesData, zonasData] = await Promise.all([
          getActividadesByZona(idZona),
          getZonasById(idZona),
        ]);
        setActividades(actividadesData || []);
        setZonas(zonasData || {});
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, [idZona]);

  const obtenerActividadLabel = (etapa, value) => {
    return actividadesPorEtapa[etapa]?.find((act) => act.value === value)?.label || "";
  };

  const esFechaValida = (fecha) => {
    const d = new Date(fecha);
    return d instanceof Date && !isNaN(d.getTime());
  };

  const validarFechas = (inicio, fin) => {
    const hoy = new Date(); // Fecha actual

    // Validar que las fechas no estén malformadas o fuera de rango
    if (!esFechaValida(inicio) || !esFechaValida(fin)) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Las fechas ingresadas no son válidas!",
      });
      return false;
    }

    // No permitir fechas futuras
    if (inicio > hoy || fin > hoy) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡No puedes ingresar fechas futuras!",
      });
      return false;
    }

    // Validar que la fecha final no sea menor que la inicial
    if (fin < inicio) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡La fecha de fin no puede ser antes de la fecha de inicio!",
      });
      return false;
    }

    return true;
  };


  const mostrarAlerta = (imagen, titulo) => {
    acctionSucessful.fire({ imageUrl: imagen, imageAlt: "Icono", title: titulo });
  };

  const handleActividadChange = (e) => {
    const { name, value } = e.target;
    const nuevaValue =
      name === "actividad" ? obtenerActividadLabel(etapaSeleccionada, value) : value;
    setNuevaActividad((prev) => ({ ...prev, [name]: nuevaValue }));
  };

  const handleEtapaChange = (e) => {
    const { name, value, options, selectedIndex } = e.target;
    const etapaLabel = options[selectedIndex].text;
    setEtapaSeleccionada(value);
    setNuevaActividad((prev) => ({ ...prev, [name]: etapaLabel }));
    setActividadEditar((prev) => ({ ...prev, [name]: etapaLabel }));
  };

  const handleEditarActividadChange = (e) => {
    const { name, value } = e.target;
    const nuevoValor =
      name === "actividad" ? obtenerActividadLabel(etapaSeleccionada, value) : value;
    setActividadEditar((prev) => ({ ...prev, [name]: nuevoValor }));
  };

  const handleCrearActividad = async (e) => {
    e.preventDefault();
    // Validación fechas
    const inicio = new Date(nuevaActividad.fechainicio);
    const fin = new Date(nuevaActividad.fechafin);
    if (!validarFechas(inicio, fin)) return;

    try {
      await crearActividad(nuevaActividad);
      const data = await getActividadesByZona(idZona);
      setActividades(data || []);
      mostrarAlerta(Images.usuarioCreado, "¡Actividad creada correctamente!");
    } catch (error) {
      console.error(error);
    } finally {
      setModalActividadInsertar(false);
    }
  };

  const handleEditarActividad = async (e) => {
    e.preventDefault();

    if (!validarSinCambios(actividadOriginal, actividadEditar, "la actividad")) return

    // Validación fechas
    const inicio = new Date(actividadEditar.fechainicio);
    const fin = new Date(actividadEditar.fechafin);
    if (!validarFechas(inicio, fin)) return;

    if (rolusuario === 3 && actividadEditar.idusuario !== idusuario) {
      mostrarAlerta(Images.Alerta, "¡No tienes permiso para editar esta actividad!");
      return;
    }

    try {
      await editarActividad(actividadEditar.id, actividadEditar);
      setActividades((prev) =>
        prev.map((a) => (a.id === actividadEditar.id ? actividadEditar : a))
      );
      mostrarAlerta(Images.usuarioCreado, "¡Actividad editada correctamente!");
    } catch (error) {
      console.error(error);
    } finally {
      setModalEditarActividad(false);
    }
  };

  const handleEliminarActividad = async (e) => {
    e.preventDefault();
    const actividad = actividades.find(a => a.id === actividadEliminar);
    if (rolusuario === 3 && actividad?.idusuario !== idusuario) {
      mostrarAlerta(Images.Alerta, "¡No tienes permiso para eliminar esta actividad!");
      setModalEliminarAbierto(false);
      return;
    }

    try {
      await eliminarActividad(actividadEliminar);
      setActividades((prev) => prev.filter((a) => a.id !== actividadEliminar));
      mostrarAlerta(Images.UsuarioEliminado, "¡Actividad eliminada correctamente!");
    } catch (error) {
      console.error(error);
    } finally {
      setModalEliminarAbierto(false);
    }
  };

  const abrirModalEliminar = (id) => {
    setActividadEliminar(id);
    setModalEliminarAbierto(true);
  };

  const abrirModalEditar = (actividad) => {
    const etapaObj = etapas.find(et => et.label === actividad.etapa);
    const etapaValue = etapaObj ? etapaObj.value : '';
    setEtapaSeleccionada(etapaValue);

    const actividadArr = actividadesPorEtapa[etapaValue] || [];
    const actividadObj = actividadArr.find(act => act.value === actividad.actividad);
    const actividadLabel = actividadObj ? actividadObj.label : actividad.actividad;

    const actividadEditando = { ...actividad, actividad: actividadLabel };

    setActividadEditar(actividadEditando);
    setActividadOriginal(actividadEditando); // Guardamos el original
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
