import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2'
import Gov from "../../../../components/gov/gov"
import { acctionSucessful } from "../../../../components/alertSuccesful";
import {getSensoresById} from "../../../../services/sensores/ApiSensores"
import {getFincasByIdFincas} from "../../../../services/fincas/ApiFincas"
import {getUsuarioById} from "../../../../services/usuarios/ApiUsuarios"
import { insertarSensor, actualizarSensor, eliminarSensores } from "../../../../services/sensores/ApiSensores";

function Sensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  const [editarSensor, setEditarSensor] = useState({ nombre: "", descripcion: "" });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });

  const { id, idUser } = useParams();

  const [check, setCheck] = useState(false);

  useEffect(() => {
    try {
      getSensoresById(id).then((data) => setSensores(data));
    } catch (error) {
      console.error("Error: ", error);
    }    
    getUsuarioById(idUser).then((data) => setUsuario(data));

    getFincasByIdFincas(id).then((data) => setFincas(data));
    
  }, []);

  useEffect(() => {
    if (usuario && fincas) {
      setFormData({
        mac: null,
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuario.id,
        idfinca: fincas.id,
      });
    }
  }, [usuario, fincas]);

  const handleChange = (e) => {
    // Se actualiza el estado del formulario con el valor correspondiente
    setFormData({
      ...formData, // Se preservan los valores actuales de formData
      [e.target.name]: e.target.value, // Se actualiza el campo que cambia
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    insertarSensor(formData).then((response) => {
      if (response) {
        if (sensores === null) {
          setSensores([response]);

        } else {
          setSensores([...sensores, response]);
        }

        acctionSucessful.fire({
          icon: "success",
          title: "Sensor agregado correctamente"
        });
        console.log("Datos enviados:", formData);


      }

    });

  };

  const handleSwitch = (event) => {
    setCheck(event.target.checked); // Actualiza el estado 'check' con el valor del checkbox
    console.log(fincas);
  };


  const handleEditarSensor = (e) => {
    e.preventDefault();
    try {
      actualizarSensor(editarSensor.id, editarSensor)
      setSensores(sensores.map(u => u.id === editarSensor.id ? editarSensor : u));
      acctionSucessful.fire({
        icon: "success",
        title: "Sensor editado correctamente"
      });

    } catch (error) {
      console.error(error)
    }
    setModalEditarAbierto(false);
  };

  const handleChangeEditar = (e) => {
    setEditarSensor({ ...editarSensor, [e.target.name]: e.target.value });

  };
  const cargarDatosEdicion = (sensores) => {
    setEditarSensor(sensores);
  };

  const HandlEliminarSensor = (id) => {
    Swal.fire({
      icon: 'error',
      title: '¿Estas seguro?',
      text: "¿Estas seguro de eliminar este sensor?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "si, eliminar ",
      cancelButtonText: "cancelar "
    }).then((result) => {
      if (result.isConfirmed) {

        try {
          eliminarSensores(id)
          setSensores(sensores.filter(sensor => sensor.id !== id));
          acctionSucessful.fire({
            icon: "success",
            title: "Sensor eliminado correctamente"
          });


        } catch {
          console.error("Error eliminando sensor:");
        }
      }
    })
  }

  return (
    <div>
      <div><Gov/></div>
    <div className="container mx-auto mt-4">
      <h1 className="text-center text-2xl font-semibold">Observando a: {fincas.nombre}</h1>
      <h2>Id de finca: {id}</h2>
      <p> Administrador </p>
      <table className="w-full border-separate border-spacing-y-4 rounded-lg p-4">
        <thead>
          <tr className="bg-[#00304D] text-white">
            <th className="p-3 rounded-l-3xl text-center">#</th>
            <th className="p-3 text-center">MAC</th>
            <th className="p-3 text-center">Nombre</th>
            <th className="p-3 text-center">Descripción</th>
            <th className="p-3 text-center">Editar</th>
            <th className="p-3 text-center">Eliminar</th>
            <th className="p-3 text-center">Ver datos</th>
            <th className="p-3 rounded-r-3xl text-center">Inactivo/Activo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sensores) && sensores.length > 0 ? (
            sensores.map((sensor, index) => (
              <tr key={index} className="bg-[#EEEEEE] rounded-lg">
                <td className="p-3 rounded-l-3xl text-center">{index + 1}</td>
                <td className="pp-3 text-center">{sensor.mac}</td>
                <td className="p-3 text-center">{sensor.nombre}</td>
                <td className="p-3 text-center">{sensor.descripcion}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setModalEditarAbierto(true);
                      cargarDatosEdicion(sensor);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-lg"
                  >
                    Editar
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button className="px-2 py-1 bg-red-500 text-white rounded-lg"
                  onClick={() => HandlEliminarSensor(sensor.id)}>Eliminar</button>
                </td>
                <td className="p-3 text-center">
                  <Link to={`/datos-sensores`}>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-lg">Ver</button>
                  </Link>
                </td>
                <td className="p-3 rounded-r-3xl text-center">
                  <div className="flex justify-center items-center">
                  <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={sensor.estado}
                      id={`flexSwitchCheck${index}`}
                      onChange={handleSwitch}
                      disabled
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center px-4 py-2 border border-gray-300">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
        <button
          type="button"
          onClick={() => setModalInsertarAbierto(true)}
          className="px-4 py-2 bg-[#009E00] text-white rounded-lg hover:bg-green-600"
        >
          Agregar Sensor
        </button>
      </table>

      {/* Modal Insertar */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h5 className="text-xl font-semibold mb-4">INSERTAR SENSOR</h5>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">NOMBRE</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                type="text"
                name="nombre"
                placeholder="Nombre"
                required
                onChange={handleChange}
              />
              <label className="block text-sm font-medium mt-4">DESCRIPCION</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                type="text"
                name="descripcion"
                placeholder="Descripción"
                onChange={handleChange}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                  onClick={() => setModalInsertarAbierto(false)}
                >
                  Cerrar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
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
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
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
