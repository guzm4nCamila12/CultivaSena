import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

import {
  getSensoresById,
  getSensoresZonasById,
  crearSensor,
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
  const [formData, setFormData] = useState(() => ({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idzona: null,
    idfinca: "",
    tipo_id: null
  }));

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

  // abrir modales
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  // ---------- Helpers ----------
  const resetForm = useCallback(() => {
    // elige idzona: 1) formData existente 2) primera zona disponible 3) zona actual
    const defaultIdZona =
      formData.idzona ??
      zonas?.[0]?.id ??
      zona?.id ??
      null;

    const defaultIdFinca =
      fincas?.id ??
      zona?.idfinca ??
      formData.idfinca ??
      "";

    setFormData({
      mac: null,
      nombre: "",
      descripcion: "",
      estado: false,
      idusuario: usuario?.id ?? "",
      idzona: defaultIdZona,
      idfinca: defaultIdFinca,
      tipo_id: null
    });
  }, [usuario, fincas, zona, zonas, formData.idzona]);

  const refreshSensoresZona = useCallback(async (zoneId) => {
    try {
      const idToUse = zoneId ?? formData.idzona ?? zona?.id ?? id;
      if (!idToUse) return;
      const sensoresZonasData = await getSensoresZonasById(idToUse);
      setSensoresZona(sensoresZonasData || []);
    } catch (err) {
      console.error("Error refreshSensoresZona:", err);
    }
  }, [formData.idzona, zona, id]);

  // ---------- Carga inicial ----------
  useEffect(() => {
    if (!id || !idUser) return;

    let mounted = true;

    const fetchAll = async () => {
      try {
        const [sensoresData, sensoresZonasData, tiposData, usuarioData, fincasData, zonasData, zonaData] = await Promise.all([
          getSensoresById(id).catch(e => { console.error("getSensoresById", e); return [] }),
          getSensoresZonasById(id).catch(e => { console.error("getSensoresZonasById", e); return [] }),
          getTipoSensor().catch(e => { console.error("getTipoSensor", e); return [] }),
          getUsuarioById(idUser).catch(e => { console.error("getUsuarioById", e); return {} }),
          getFincasByIdFincas(id).catch(e => { console.warn("getFincasByIdFincas", e); return {} }),
          getZonasByIdFinca(id).catch(e => { console.warn("getZonasByIdFinca", e); return [] }),
          getZonasById(id).catch(e => { console.error("getZonasById", e); return {} })
        ]);

        if (!mounted) return;

        setSensores(sensoresData || []);
        setSensoresZona(sensoresZonasData || []);
        setTiposSensores(tiposData || []);
        setUsuario(usuarioData || {});
        setFincas(fincasData || {});
        setZonas(zonasData || []);
        setZona(zonaData || {});

        // inicializa el form con valores válidos según lo que exista
        setFormData(prev => ({
          ...prev,
          idusuario: usuarioData?.id ?? prev.idusuario,
          idfinca: fincasData?.id ?? zonaData?.idfinca ?? prev.idfinca,
          idzona: prev.idzona ?? zonasData?.[0]?.id ?? zonaData?.id ?? prev.idzona
        }));
      } catch (err) {
        console.error("Error fetchAll sensores:", err);
      }
    };

    fetchAll();

    return () => { mounted = false; };
  }, [id, idUser]);

  // Mantener sincronía si cambian usuario/finca/zona/zonas
  useEffect(() => {
    // Si el usuario o finca cambian (p ej. recarga externa), actualiza form
    setFormData(prev => ({
      ...prev,
      idusuario: usuario?.id ?? prev.idusuario,
      idfinca: fincas?.id ?? zona?.idfinca ?? prev.idfinca,
      idzona: prev.idzona ?? zonas?.[0]?.id ?? zona?.id ?? prev.idzona
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, fincas, zona, zonas]);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value: raw } = e.target;
    const numericNames = ["idzona", "tipo_id", "idfinca", "idusuario"];

    let value;

    if (numericNames.includes(name)) {
      value = raw === "" ? "" : Number.parseInt(raw, 10);
    } else {
      value = raw;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditar = (e) => {
    const { name, value: raw } = e.target;
    const numericNames = ["idzona", "tipo_id"];

    let value;

    if (numericNames.includes(name)) {
      value = raw === "" ? null : Number.parseInt(raw, 10);
    } else {
      value = raw;
    }

    setSensorEditar((prev) => ({ ...prev, [name]: value }));
  };

  const showSwal = async () => {
    let inputValueLocal = "";
    const result = await withReactContent(Swal).fire({
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
      inputValue: inputValueLocal,
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
        inputValueLocal = val;
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

    // Si confirmó, recupera el valor directamente del input (ya validado)
    if (result.isConfirmed) {
      return Swal.getInput()?.value.trim() || "";
    }
    return null;
  };

  const crearNuevoSensor = async () => {
    // Validaciones de frontend
    if (!formData.nombre) {
      return acctionSucessful.fire({ imageUrl: Alerta, title: 'El sensor necesita un nombre' });
    }
    if (!formData.descripcion) {
      return acctionSucessful.fire({ imageUrl: Alerta, title: 'El sensor necesita una descripción' });
    }
    if (!formData.tipo_id) {
      return acctionSucessful.fire({ imageUrl: Alerta, title: 'Seleccione un tipo de sensor' });
    }
    // idzona e idfinca obligatorios
    if (!formData.idzona) {
      return acctionSucessful.fire({ imageUrl: Alerta, title: 'Seleccione una zona válida' });
    }
    if (!formData.idfinca) {
      return acctionSucessful.fire({ imageUrl: Alerta, title: 'Finca inválida' });
    }

    try {
      // Construir payload con casts explícitos
      const payload = {
        ...formData,
        idzona: Number(formData.idzona),
        idfinca: Number(formData.idfinca),
        idusuario: Number(formData.idusuario),
        tipo_id: Number(formData.tipo_id)
      };

      const response = await crearSensor(payload);

      if (response) {
        // actualizar lista principal y lista por zona (usando la zona actual)
        setSensores(prev => [...prev, response]);

        // refrescar sensores por zona con la id de la zona usada (payload.idzona)
        await refreshSensoresZona(payload.idzona);

        acctionSucessful.fire({
          imageUrl: usuarioCreado,
          title: `¡Sensor <span style="color: green;">${payload.nombre}</span> creado correctamente!`
        });

        // Resetear el formulario pero conservando idusuario/idfinca/idzona desde estado actual
        resetForm();
        setModalInsertarAbierto(false);
      }
    } catch (err) {
      console.error("Error al crear sensor:", err);
      // opcional mostrar mensaje de error al usuario
    }
  };

  const actualizarSensor = async () => {
    if (!validarSinCambios(sensorEditar, sensorOriginal, "el sensor")) return;
    try {
      const payload = {
        ...sensorEditar,
        idzona: Number(sensorEditar.idzona),
        tipo_id: Number(sensorEditar.tipo_id)
      };
      await editarSensor(sensorEditar.id, payload);
      setSensores(prev => prev.map(s => s.id === sensorEditar.id ? { ...s, ...payload } : s));
      await refreshSensoresZona(payload.idzona);
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
      // refrescar según zona actual
      await refreshSensoresZona();
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        title: `¡Sensor eliminado correctamente!`
      });
      setSensorAEliminar(null);
      setSensorEliminado(null);
    } catch (err) {
      console.error("Error al eliminar sensor:", err);
    }
  };

  const ActivarSensor = (sensor, index) => {
    return (
      <label
        id={rol === "1" ? "activarSensor" : "noPoderActivar"}
        className="relative flex items-center cursor-pointer"
        aria-label={rol === "1" ? "Activar sensor" : "No puede activar sensor"}
      >
        <input
          type="checkbox"
          checked={sensor.estado}
          disabled={rol !== "1"}
          onChange={() => rol === "1" && cambiarEstadoSensor(sensor, index)}
          className="sr-only"
        />
        <div
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? "bg-green-500" : "bg-gray-400"
            }`}
        >
          <div
            className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? "translate-x-6" : "translate-x-0"
              }`}
          ></div>
        </div>
      </label>
    );
  };

  const cambiarEstadoSensor = async (sensor, index) => {
    const newEstado = !sensor.estado;
    const updatedSensor = { ...sensor, estado: newEstado };

    if (!sensor.mac && newEstado) {
      const mac = await showSwal();
      if (!mac) return;
      updatedSensor.mac = mac;
    }

    try {
      await editarSensor(sensor.id, updatedSensor);
      setSensores(prev => {
        const arr = [...prev]; arr[index] = updatedSensor; return arr;
      });
      setSensoresZona(prev => {
        const updated = [...prev];
        // find matching index by id if possible
        const idx = updated.findIndex(s => s.id === sensor.id);
        if (idx >= 0) updated[idx] = updatedSensor;
        return updated;
      });

      await insertarDatos(updatedSensor.mac);
    } catch (err) {
      console.error("Error al cambiar estado del sensor:", err);
    }
  };

  return {
    ActivarSensor,
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
    // utilidad pública si alguien la necesita
    refreshSensoresZona,
    resetForm
  };
}
