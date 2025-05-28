import { useState, useEffect } from "react";
import { getFincasByIdFincas, getZonasByIdFinca, crearZona, editarZona, eliminarZonas } from "../services/fincas/ApiFincas";
import { acctionSucessful } from "../components/alertSuccesful";
import * as Images from '../assets/img/imagesExportation';
import { validarSinCambios } from "../utils/validaciones";

export const useZonas = (id) => {
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [zonaEliminar, setZonaEliminar] = useState(null);
  const [zonaEliminada, setZonaEliminada] = useState(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("crear");
  const [zonaFormulario, setZonaFormulario] = useState({ nombre: "", idfinca: parseInt(id) });
  const [zonaOriginal, setZonaOriginal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fincaData, zonasData] = await Promise.all([
          getFincasByIdFincas(id),
          getZonasByIdFinca(id),
        ]);
        setFincas(fincaData);
        setZonas(zonasData || []);
      } catch (err) {
        console.error("Error cargando datos", err);
      }
    };
    fetchData();
  }, [id]);

  const abrirModalCrear = () => {
    setZonaFormulario({ nombre: "", idfinca: parseInt(id) });
    setModoFormulario("crear");
    setModalFormularioAbierto(true);
  };

  const abrirModalEditar = (zona) => {
    const { cantidadSensores, verSensores, actividades, "#": removed, ...limpia } = zona;
    setZonaFormulario(limpia);
    setZonaOriginal(limpia);
    setModoFormulario("editar");
    setModalFormularioAbierto(true);
  };

  const abrirModalEliminar = (id) => {
    const zona = zonas.find(z => z.id === id);
    setZonaEliminar(id);
    setZonaEliminada(zona);
    setModalEliminarAbierto(true);
  };

  const handleChangeZona = (e) => {
    setZonaFormulario({ ...zonaFormulario, [e.target.name]: e.target.value });
  };

  const handleSubmitFormulario = async (e) => {
    e.preventDefault();

    if (!zonaFormulario.nombre) {
      return acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: "¡Ingrese el nombre de la zona!",
      });
    }

    if (modoFormulario === "crear") {
      const nueva = await crearZona(zonaFormulario);
      setZonas([...zonas, nueva]);
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
        title: `¡Zona <span style="color: green;">${nueva.nombre}</span> creada correctamente!`,
      });
    }

    if (modoFormulario === "editar") {
      if (!validarSinCambios(zonaOriginal, zonaFormulario, "la zona")) return;

      await editarZona(zonaFormulario.id, zonaFormulario);
      setZonas(zonas.map(z => z.id === zonaFormulario.id ? zonaFormulario : z));
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
        title: `¡Zona <span style="color: #3366CC;">${zonaFormulario.nombre}</span> editada correctamente!`,
      });
    }

    setModalFormularioAbierto(false);
  };

  const handleEliminarZona = async (e) => {
    e.preventDefault();
    await eliminarZonas(zonaEliminar);
    setZonas(zonas.filter(z => z.id !== zonaEliminar));
    setModalEliminarAbierto(false);
    acctionSucessful.fire({
      imageUrl: Images.UsuarioEliminado,
      title: `¡Zona <span style="color: red;">${zonaEliminada.nombre}</span> eliminada correctamente!`,
    });
  };

  return {
    fincas,
    zonas,
    zonaFormulario,
    modalFormularioAbierto,
    abrirModalCrear,
    abrirModalEditar,
    handleChangeZona,
    handleSubmitFormulario,
    modoFormulario,
    zonaEliminada,
    modalEliminarAbierto,
    abrirModalEliminar,
    handleEliminarZona,
    setModalFormularioAbierto,
    setModalEliminarAbierto,
  };
};