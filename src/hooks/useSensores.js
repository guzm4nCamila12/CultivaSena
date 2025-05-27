import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

import {
  getSensoresById,
  getSensoresZonasById,
  crearSensor,
  editarSensor,
  eliminarSensores,
  insertarDatos
} from "../services/sensores/ApiSensores";

import { getFincasByIdFincas, getZonasByIdFinca, getZonasById } from "../services/fincas/ApiFincas";
import { getUsuarioById } from "../services/usuarios/ApiUsuarios";

import { acctionSucessful } from "../components/alertSuccesful";
import UsuarioEliminado from "../assets/img/usuarioEliminado.png";
import usuarioCreado from "../assets/img/usuarioCreado.png";
import { validarSinCambios } from "../utils/validaciones";

const MySwal = withReactContent(Swal);
export function useSensores(id, idUser) {
  const [sensores, setSensores] = useState([]);
  const [sensoresZona, setSensoresZona] = useState([]);
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
  const [zona, setZona] = useState({});
  const [usuario, setUsuario] = useState({});
  const rol = localStorage.getItem("rol");
  let inputValue = "";

  useEffect(() => {
    console.log("ID de la finca:", idUser);
    const fetchData = async () => {
      // Sensores
      try {
        const sensoresData = await getSensoresById(id);
        setSensores(sensoresData || []);
      } catch (err) {
        console.error("❌ Error al obtener sensores:", err);
      }
      // Sensores por zona
      try {
        const sensoresZonasData = await getSensoresZonasById(id);
        setSensoresZona(sensoresZonasData || []);
      } catch (err) {
        console.error("❌ Error al obtener sensores de la zona:", err);
      }
      // Usuario
      try {
        const usuarioData = await getUsuarioById(idUser);
        setUsuario(usuarioData || {});
        console.log("user data:", usuarioData);
      } catch (err) {
        console.error("❌ Error al obtener usuario:", err);
      }
      // Finca (NO es necesaria — la ignoramos si falla)
      try {
        const fincasData = await getFincasByIdFincas(id);
        setFincas(fincasData || {});
      } catch (err) {
        console.warn("⚠️ No se pudo obtener finca (opcional):", err);
      }
      // Zonas de la finca (a partir del usuario, opcional también)
      try {
        const zonasData = await getZonasByIdFinca(id);
        setZonas(zonasData || []);
      } catch (err) {
        console.warn("⚠️ No se pudo obtener zonas de finca:", err);
      }
      // Zona individual
      try {
        const zonaData = await getZonasById(id);
        setZona(zonaData || {});
      } catch (err) {
        console.error("❌ Error al obtener zona:", err);
      }
    };
    if (id && idUser) {
      fetchData();
    }
  }, [id, idUser]);
  
  useEffect(() => {
    if (usuario && fincas?.id) {
      setFormData((prev) => ({
        ...prev,
        idusuario: usuario.id,
        idfinca: fincas.id,
      }));
    } else if (usuario && zona?.idfinca) {
      setFormData((prev) => ({
        ...prev,
        idusuario: usuario.id,
        idfinca: zona.idfinca,
        idzona: zona.id,
      }));
    }
  }, [usuario, fincas, zona]);

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
      console.log("FormData:", formData);
      if (response) {
        setSensores((prev) => [...prev, response]);
        try {
            const sensoresZonasData = await getSensoresZonasById(id);
            setSensoresZona(sensoresZonasData || []);
          } catch (err) {
            console.error(" Error al obtener sensores de la zona:", err);
          }
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
      try {
        const sensoresZonasData = await getSensoresZonasById(sensorEditar.idzona);
        setSensoresZona(sensoresZonasData || []);
      } catch (errZona) {
        console.warn(" Error al refrescar sensoresZona:", errZona);
      }
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
      try {
        const sensoresZonasData = await getSensoresZonasById(id);
        setSensoresZona(sensoresZonasData || []);
        
      } catch (errZona) {
        console.warn(" Error al refrescar sensoresZona:", errZona);
      }
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
    return withReactContent(Swal).fire({
      title: (
        <h5 className="text-2xl font-extrabold mb-4 text-center">
          Ingrese la dirección MAC <br />
          del sensor:
        </h5>
      ),
      input: 'text',
      inputPlaceholder: 'Digite la dirección MAC',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      inputValue,
      preConfirm: () => {
        const value = Swal.getInput()?.value.trim();
        if (!value) {
          Swal.showValidationMessage('¡Este campo es obligatorio!');
          return false;
        }
        if(/\s/.test(value)){
          Swal.showValidationMessage('¡No se permiten espacios al ingresar la MAC!');
          return false;
        }
        inputValue = value;
        return true;
      },
      confirmButtonText: 'Guardar e insertar',
      customClass: {
        popup: 'rounded-3xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-4 my-8 sm:my-12',
        title: 'text-gray-900',
        input: 'flex py-2 border-gray rounded-3xl',
        actions: 'flex justify-center space-x-4 max-w-[454px] mx-auto',
        cancelButton: 'w-[210px] p-3 text-center bg-[#00304D] hover:bg-[#021926] text-white font-bold rounded-full text-lg',
        confirmButton: 'w-[210px] p-3 bg-[#009E00] hover:bg-[#005F00] text-white font-bold rounded-full text-lg',
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
      try {
        const sensoresZonasData = await getSensoresZonasById(id);
        setSensoresZona(sensoresZonasData || []);
        
      } catch (errZona) {
        console.warn("Error al refrescar sensoresZona:", errZona);
      }

        await insertarDatos(updatedSensor.mac);
      
    } catch (err) {
      console.error("Error al cambiar estado del sensor:", err);
    }
  };

  return {
    sensores, setSensores,
    sensoresZona,setSensoresZona,
    formData, setFormData,
    sensorEditar, setSensorEditar,
    sensorOriginal, setSensorOriginal,
    sensorAEliminar, setSensorAEliminar,
    sensorEliminado, setSensorEliminado,
    fincas, zonas, zona,rol,
    crearNuevoSensor,
    actualizarSensor,
    eliminarSensor,
    cambiarEstadoSensor,
    handleChange,
    handleChangeEditar,
  };
}