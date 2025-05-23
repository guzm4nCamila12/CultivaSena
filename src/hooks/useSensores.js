import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

import {
  getSensoresById,
  crearSensor,
  editarSensor,
  eliminarSensores,
  insertarDatos
} from "../services/sensores/ApiSensores";

import { getFincasByIdFincas, getZonasByIdFinca } from "../services/fincas/ApiFincas";
import { getUsuarioById } from "../services/usuarios/ApiUsuarios";

import { acctionSucessful } from "../components/alertSuccesful";
import UsuarioEliminado from "../assets/img/usuarioEliminado.png";
import usuarioCreado from "../assets/img/usuarioCreado.png";
import { validarSinCambios } from "../utils/validaciones";

const MySwal = withReactContent(Swal);

export function useSensores(id, idUser) {
  const [sensores, setSensores] = useState([]);
  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idzona: null,
    idfinca: "",
  });

  const [sensorEditar, setSensorEditar] = useState({ id: null, nombre: "", descripcion: "", idzona: null });
  const [sensorOriginal, setSensorOriginal] = useState(null);
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [sensorEliminado, setSensorEliminado] = useState(null);
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [usuario, setUsuario] = useState({});
  const rol = localStorage.getItem("rol");
  let inputValue = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensoresData = await getSensoresById(idUser);
        setSensores(sensoresData || []);

        const usuarioData = await getUsuarioById(id);
        setUsuario(usuarioData);

        const fincasData = await getFincasByIdFincas(idUser);
        setFincas(fincasData);

        const zonasData = await getZonasByIdFinca(idUser);
        setZonas(zonasData || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, [id, idUser]);

  useEffect(() => {
    if (usuario && fincas) {
      setFormData((prev) => ({
        ...prev,
        idusuario: usuario.id,
        idfinca: fincas.id,
      }));
    }
  }, [usuario, fincas]);

  const handleChange = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleChangeEditar = (e) => {
    const value = e.target.name === 'idzona' ? parseInt(e.target.value, 10) : e.target.value;
    setSensorEditar({ ...sensorEditar, [e.target.name]: value });
  };

  const crearNuevoSensor = async () => {
    try {
      const response = await crearSensor(formData);
      if (response) {
        setSensores((prev) => [...prev, response]);
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          imageAlt: 'Icono personalizado',
          title: `¡Sensor <span style="color: green;">${formData.nombre}</span> creado correctamente!`
        });
      }
    } catch (err) {
      console.error("Error al crear sensor:", err);
    }
  };

  const actualizarSensor = async () => {
    if (!validarSinCambios(sensorEditar, sensorOriginal, "el sensor")) return;
    try {
      await editarSensor(sensorEditar.id, sensorEditar);
      const nuevosSensores = sensores.map(sensor =>
        sensor.id === sensorEditar.id ? sensorEditar : sensor
      );
      setSensores(nuevosSensores);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Sensor <span style="color: #3366CC;">${sensorEditar.nombre}</span> editado correctamente!`
      });
    } catch (err) {
      console.error("Error al actualizar sensor:", err);
    }
  };

  const eliminarSensor = async () => {
    try {
      await eliminarSensores(sensorAEliminar);
      setSensores((prev) => prev.filter(s => s.id !== sensorAEliminar));
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: 'Icono personalizado',
        title: `¡Sensor <span style="color: red;">${sensorEliminado?.nombre}</span> eliminado correctamente!`
      });
    } catch (err) {
      console.error("Error al eliminar sensor:", err);
    }
  };

  const showSwal = () => {
    return MySwal.fire({
      title: (
        <h5 className="text-2xl font-extrabold mb-4 text-center">
          Ingrese la dirección MAC <br />
          del sensor:
        </h5>
      ),
      input: 'text',
      inputPlaceholder: 'Digite la dirección MAC',
      showCancelButton: true,
      confirmButtonText: 'Guardar e insertar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const value = Swal.getInput()?.value;
        if (!value) {
          Swal.showValidationMessage('¡Este campo es obligatorio!');
          return false;
        }
        inputValue = value;
        return true;
      },
    });
  };

  const cambiarEstadoSensor = async (sensor, index) => {
    const newEstado = !sensor.estado;
    const updatedSensor = { ...sensor, estado: newEstado };

    if (!sensor.mac && newEstado) {
      const confirmacion = await showSwal();
      if (!confirmacion.isConfirmed) return;
      updatedSensor.mac = inputValue;
    }

    try {
      await editarSensor(sensor.id, updatedSensor);
      const nuevosSensores = [...sensores];
      nuevosSensores[index] = updatedSensor;
      setSensores(nuevosSensores);

      if (newEstado && updatedSensor.mac) {
        await insertarDatos(updatedSensor.mac);
      }
    } catch (err) {
      console.error("Error al cambiar estado del sensor:", err);
    }
  };

  return {
    sensores, setSensores,
    formData, setFormData,
    sensorEditar, setSensorEditar,
    sensorOriginal, setSensorOriginal,
    sensorAEliminar, setSensorAEliminar,
    sensorEliminado, setSensorEliminado,
    fincas, zonas, rol,
    crearNuevoSensor,
    actualizarSensor,
    eliminarSensor,
    cambiarEstadoSensor,
    handleChange,
    handleChangeEditar,
  };
}
