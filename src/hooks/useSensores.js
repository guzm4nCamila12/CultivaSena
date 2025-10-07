import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

import {
  getSensoresById,
  getSensoresZonasById,
  crearSensor,
  getTiposSensor,
  editarSensor,
  eliminarSensores,
  insertarDatos,
  getTipoSensor
} from "../services/sensores/ApiSensores";

import { getFincasByIdFincas, getZonasByIdFinca, getZonasById } from "../services/fincas/ApiFincas";
import { getUsuarioById } from "../services/usuarios/ApiUsuarios";

import { acctionSucessful } from "../components/alertSuccesful";
import UsuarioEliminado from "../assets/img/usuarioEliminado.png";
import usuarioCreado from "../assets/img/usuarioCreado.png";
import { validarSinCambios } from "../utils/validaciones";
import { Alerta } from "../assets/img/imagesExportation";

export function useSensores(id, idUser) {
  const [sensores, setSensores] = useState([]);
  const [sensoresZona, setSensoresZona] = useState([]);
  const valoresIniciales = {
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idzona: null,
    idfinca: "",
    tipo_id: null
  };

  const [formData, setFormData] = useState(valoresIniciales);

  const [sensorEditar, setSensorEditar] = useState({ id: null, nombre: "", descripcion: "", idzona: null, tipo_id: null });
  const [sensorOriginal, setSensorOriginal] = useState(null);
  const [sensorAEliminar, setSensorAEliminar] = useState(null);
  const [sensorEliminado, setSensorEliminado] = useState(null);
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [zona, setZona] = useState({});
  const [usuario, setUsuario] = useState({});
  const [tiposSensores, setTiposSensores] = useState([]);
  const rol = localStorage.getItem("rol");
  let inputValue = "";

  //abrir modales
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensoresData = await getSensoresById(id);
        setSensores(sensoresData || []);
      } catch (err) {
        console.error("❌ Error al obtener sensores:", err);
      }
      try {
        const sensoresZonasData = await getSensoresZonasById(id);
        setSensoresZona(sensoresZonasData || []);
      } catch (err) {
        console.error("❌ Error al obtener sensores de la zona:", err);
      }
      try {
        const tiposData = await getTipoSensor();
        setTiposSensores(tiposData || []);
      } catch (err) {
        console.error("❌ Error al obtener tipos de sensores:", err);
      }
      try {
        const usuarioData = await getUsuarioById(idUser);
        setUsuario(usuarioData || {});
      } catch (err) {
        console.error("❌ Error al obtener usuario:", err);
      }
      try {
        const fincasData = await getFincasByIdFincas(id);
        setFincas(fincasData || {});
      } catch (err) {
        console.warn("⚠️ No se pudo obtener finca (opcional):", err);
      }
      try {
        const zonasData = await getZonasByIdFinca(id);
        setZonas(zonasData || []);
        if (zonasData && zonasData.length > 0) {
          setFormData(prev => ({
            ...prev,
            idzona: prev.idzona ?? zonasData[0].id
          }));
        }
      } catch (err) {
        console.warn("⚠️ No se pudo obtener zonas de finca:", err);
      }
      try {
        const zonaData = await getZonasById(id);
        setZona(zonaData || {});
      } catch (err) {
        console.error("❌ Error al obtener zona:", err);
      }
    };
    if (id && idUser) fetchData();
  }, [id, idUser]);

  useEffect(() => {
    if (usuario && fincas?.id) {
      setFormData(prev => ({
        ...prev,
        idusuario: usuario.id,
        idfinca: fincas.id,
      }));
    } else if (usuario && zona?.idfinca) {
      setFormData(prev => ({
        ...prev,
        idusuario: usuario.id,
        idfinca: zona.idfinca,
        idzona: zona.id,
      }));
    }
  }, [usuario, fincas, zona]);

  const handleChange = (e) => {
    const value = e.target.name === 'idzona' || e.target.name === 'tipo_id'
      ? parseInt(e.target.value, 10)
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleChangeEditar = (e) => {
    const value = e.target.name === 'idzona' || e.target.name === 'tipo_id'
      ? parseInt(e.target.value, 10)
      : e.target.value;
    setSensorEditar({ ...sensorEditar, [e.target.name]: value });
  };

  const crearNuevoSensor = async () => {
    if (!formData.nombre) {
      return acctionSucessful.fire({
        imageUrl: Alerta,
        title: 'El sensor necesita un nombre',
      });
    }
    if (!formData.descripcion) {
      return acctionSucessful.fire({
        imageUrl: Alerta,
        title: 'El sensor necesita una descripción',
      });
    }

    // Validación tipo_id obligatorio
    if (!formData.tipo_id) {
      return acctionSucessful.fire({
        imageUrl: Alerta,
        title: 'Seleccione un tipo de sensor',
      });
    }
    try {
      const response = await crearSensor(formData);
      if (response) {
        setSensores(prev => [...prev, response]);
        const sensoresZonasData = await getSensoresZonasById(id);
        setSensoresZona(sensoresZonasData || []);
        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          title: `¡Sensor <span style="color: green;">${formData.nombre}</span> creado correctamente!`
        });

        setFormData(valoresIniciales);
        setModalInsertarAbierto(false);
      }
    } catch (err) {
      console.error("Error al crear sensor:", err);
    }
  };

  const actualizarSensor = async () => {
    if (!validarSinCambios(sensorEditar, sensorOriginal, "el sensor")) return;
    try {
      await editarSensor(sensorEditar.id, sensorEditar);
      setSensores(prev => prev.map(s => s.id === sensorEditar.id ? sensorEditar : s));
      const sensoresZonasData = await getSensoresZonasById(sensorEditar.idzona);
      setSensoresZona(sensoresZonasData || []);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        title: `¡Sensor <span style="color: #3366CC;">${sensorEditar.nombre}</span> editado correctamente!`
      });

      setModalEditarAbierto(false);
    } catch (err) {
      console.error("Error al actualizar sensor:", err);
    }
  };

  const eliminarSensor = async () => {
    if (!sensorAEliminar) return;

    try {
      await eliminarSensores(sensorAEliminar);
      setSensores(prev => prev.filter(s => s.id !== sensorAEliminar));
      const sensoresZonasData = await getSensoresZonasById(id);
      setSensoresZona(sensoresZonasData || []);
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        title: `¡Sensor <span style="color: red;">${sensorEliminado?.nombre}</span> eliminado correctamente!`
      });
      setSensorAEliminar(null);
      setSensorEliminado(null);
    } catch (err) {
      console.error("Error al eliminar sensor:", err);
    }
  };

  const showSwal = () => {
    return withReactContent(Swal).fire({
      title: (
        <span className="text-2xl font-extrabold mb-4 text-center">
          Ingrese la dirección MAC <br />
          del sensor:
        </span>
      ),
      input: 'text',
      inputPlaceholder: 'Digite la dirección MAC',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      inputValue,
      preConfirm: () => {
        const val = Swal.getInput()?.value.trim();
        if (!val) {
          Swal.showValidationMessage('¡Este campo es obligatorio!');
          return false;
        }
        if (/\s/.test(val)) {
          Swal.showValidationMessage('¡No se permiten espacios al ingresar la MAC!');
          return false;
        }
        inputValue = val;
        return true;
      },
      confirmButtonText: 'Guardar e Insertar',
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
      const confirm = await showSwal();
      if (!confirm.isConfirmed) return;
      updatedSensor.mac = inputValue;
    }
    try {
      await editarSensor(sensor.id, updatedSensor);
      setSensores(prev => {
        const arr = [...prev]; arr[index] = updatedSensor; return arr;
      });
      setSensoresZona(prev => {
        const updated = [...prev];
        updated[index] = updatedSensor;
        return updated;
      });

      const respuesta = await insertarDatos(updatedSensor.mac);
    } catch (err) {
      console.error("Error al cambiar estado del sensor:", err);
    }
  };

  return {
    sensores,
    sensoresZona,
    tiposSensores,
    formData,
    sensorEditar,
    setSensorEditar,
    sensorOriginal,
    setSensorOriginal,
    sensorAEliminar,
    setSensorAEliminar,
    sensorEliminado,
    setSensorEliminado,
    fincas,
    zonas,
    zona,
    rol,
    crearNuevoSensor,
    actualizarSensor,
    eliminarSensor,
    cambiarEstadoSensor,
    handleChange,
    handleChangeEditar,
    modalInsertarAbierto,
    setModalInsertarAbierto,
    modalEditarAbierto,
    setModalEditarAbierto,
  };
}