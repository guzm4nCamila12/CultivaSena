import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { getSensoresById, insertarSensor, actualizarSensor, eliminarSensores } from "../../../../services/sensores/ApiSensores";
import { getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";
import Tabla from "../../../../components/Tabla";
import NavBar from "../../../../components/gov/navbar"
import macIcon from "../../../../assets/icons/mac.png";
import nombreIcon from "../../../../assets/icons/nombre.png";
import descripcionIcon from "../../../../assets/icons/descripcion.png";
import estadoIcon from "../../../../assets/icons/estado.png";
import accionesIcon from "../../../../assets/icons/config.png";
import editIcon from "../../../../assets/icons/edit.png";
import verIcon from "../../../../assets/icons/view.png";
import deletIcon from "../../../../assets/icons/delete.png";

function Sensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  const [editarSensor, setEditarSensor] = useState({ id: null, nombre: "", descripcion: "" });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const { id, idUser } = useParams();

  const [formData, setFormData] = useState({
    mac: "",
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });

  useEffect(() => {
    getSensoresById(id).then(setSensores);
    getUsuarioById(idUser).then(setUsuario);
    getFincasByIdFincas(id).then(setFincas);
  }, [id, idUser]);

  useEffect(() => {
    if (usuario && fincas) {
      setFormData({
        mac: "",
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuario.id,
        idfinca: fincas.id,
      });
    }
  }, [usuario, fincas]);

  const columnas = [
    { key: "#", label: "#" },
    { key: "mac", label: "MAC", icon: macIcon },
    { key: "nombre", label: "Nombre", icon: nombreIcon },
    { key: "descripcion", label: "Descripción", icon: descripcionIcon },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon },
    { key: "acciones", label: "Acciones", icon: accionesIcon },
  ];

  const navigate = useNavigate();

  const verDatos = () => {
    navigate(`/datos-sensor`);  // Redirige a la ruta con el ID del sensor
  };

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <button onClick={() => abrirModalEditar(fila)}>
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
        <img src={editIcon} alt="Editar" />
        </div>
      </button>
      <button onClick={() => HandlEliminarSensor(fila.id)}>
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
        <img src={deletIcon} alt="Eliminar" />
        </div>
      </button>
      <button onClick={verDatos}>
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
        <img src={verIcon} alt="Ver" />
        </div>
      </button>
    </div>
  );

  const abrirModalEditar = (sensor) => {
    setEditarSensor(sensor);
    setModalEditarAbierto(true);
  };

  const HandlEliminarSensor = (id) => {
    Swal.fire({
      icon: 'error',
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar este sensor?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarSensores(id).then(() => {
          setSensores(sensores.filter(sensor => sensor.id !== id));
          acctionSucessful.fire({
            icon: "success",
            title: "Sensor eliminado correctamente"
          });
        }).catch(console.error);
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertarSensor(formData).then((response) => {
      if (response) {
        setSensores([...sensores, response]);
        acctionSucessful.fire({
          icon: "success",
          title: "Sensor agregado correctamente"
        });
        setModalInsertarAbierto(false);
      }
    });
  };

  const handleEditarSensor = (e) => {
    e.preventDefault();
    actualizarSensor(editarSensor.id, editarSensor).then(() => {
      setSensores(sensores.map(u => u.id === editarSensor.id ? editarSensor : u));
      acctionSucessful.fire({
        icon: "success",
        title: "Sensor editado correctamente"
      });
      setModalEditarAbierto(false);
    });
  };

  const handleChangeEditar = (e) => {
    setEditarSensor({ ...editarSensor, [e.target.name]: e.target.value });

  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto mt-4">
        <h1 className="text-center text-2xl font-semibold">{usuario.nombre}</h1>
        <h1 className="text-center text-2xl font-semibold">{fincas.nombre}</h1>
        <Tabla columnas={columnas} datos={sensores.map((sensor, index) => ({ ...sensor, "#": index + 1 }))} acciones={acciones} />

        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-3xl font-semibold" onClick={() => setModalInsertarAbierto(true)}>
          Agregar Sensor
        </button>

        {modalInsertarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <h5 className="text-xl font-semibold mb-4">INSERTAR SENSOR</h5>
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium">NOMBRE</label>
                <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="nombre" placeholder="Nombre" required onChange={handleChange} />
                <label className="block text-sm font-medium mt-4">DESCRIPCIÓN</label>
                <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="descripcion" placeholder="Descripción" onChange={handleChange} />
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2" onClick={() => setModalInsertarAbierto(false)}>Cerrar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEditarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <h5 className="text-xl font-semibold mb-4">EDITAR SENSOR</h5>
              <form onSubmit={handleEditarSensor}>
                <label className="block text-sm font-medium">NOMBRE</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                  value={editarSensor.nombre}
                  type="text"
                  onChange={handleChangeEditar}
                />
                <label className="block text-sm font-medium mt-4">DESCRIPCION</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                  value={editarSensor.descripcion}
                  type="text"
                  onChange={handleChangeEditar}
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gSensor 1 de Finca A de Juanray-300 text-black rounded-lg mr-2"
                    onClick={() => setModalEditarAbierto(false)}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensores;