import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function Sensores() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({ nombre: "Finca Ejemplo" }); // Nombre de finca de ejemplo
  const [editarSensor, setEditarSensor] = useState({ id: "", nombre: "", descripcion: "" });
  const [nuevoSensor, setNuevoSensor] = useState({ nombre: "", descripcion: "" });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const { id, idUser } = useParams();

  useEffect(() => {
    // Simulación de datos
    setSensores([
      { id: 1, mac: "00:14:22:01:23:45", nombre: "Sensor 1", descripcion: "Descripción 1", estado: true },
      { id: 2, mac: "00:14:22:01:23:46", nombre: "Sensor 2", descripcion: "Descripción 2", estado: false },
    ]);
  }, []);

  const handleSwitch = (event) => {
    console.log("Estado del switch: ", event.target.checked);
  };

  const handleAgregarSensor = (e) => {
    e.preventDefault();
    setSensores([...sensores, { id: sensores.length + 1, ...nuevoSensor, estado: true }]);
    setModalInsertarAbierto(false);
  };

  const handleEditarSensor = (e) => {
    e.preventDefault();
    const sensoresActualizados = sensores.map((sensor) =>
      sensor.id === editarSensor.id ? { ...sensor, nombre: editarSensor.nombre, descripcion: editarSensor.descripcion } : sensor
    );
    setSensores(sensoresActualizados);
    setModalEditarAbierto(false);
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-center text-2xl font-semibold">{fincas.nombre}</h1>
      <div className="flex justify-start mt-2">
        <button
          type="button"
          onClick={() => setModalInsertarAbierto(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Agregar Sensor
        </button>
      </div>
      <table className="min-w-full mt-3 table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2 border border-gray-300">N°</th>
            <th className="px-4 py-2 border border-gray-300">MAC</th>
            <th className="px-4 py-2 border border-gray-300">NOMBRE</th>
            <th className="px-4 py-2 border border-gray-300">DESCRIPCION</th>
            <th className="px-4 py-2 border border-gray-300">EDITAR</th>
            <th className="px-4 py-2 border border-gray-300">ELIMINAR</th>
            <th className="px-4 py-2 border border-gray-300">VER INFO</th>
            <th className="px-4 py-2 border border-gray-300">Inactivo/Activo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sensores) && sensores.length > 0 ? (
            sensores.map((sensor, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-300">{sensor.mac}</td>
                <td className="px-4 py-2 border border-gray-300">{sensor.nombre}</td>
                <td className="px-4 py-2 border border-gray-300">{sensor.descripcion}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => {
                      setEditarSensor(sensor);
                      setModalEditarAbierto(true);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-lg"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button className="px-2 py-1 bg-red-500 text-white rounded-lg">Eliminar</button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <Link to={`/datos-sensores`}>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-lg">Ver</button>
                  </Link>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex justify-center items-center">
                    <input
                      className="toggle-checkbox"
                      type="checkbox"
                      checked={sensor.estado}
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
      </table>

      {/* Modal Insertar */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h5 className="text-xl font-semibold mb-4">INSERTAR SENSOR</h5>
            <form onSubmit={handleAgregarSensor}>
              <label className="block text-sm font-medium">NOMBRE</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nuevoSensor.nombre}
                onChange={(e) => setNuevoSensor({ ...nuevoSensor, nombre: e.target.value })}
              />
              <label className="block text-sm font-medium mt-4">DESCRIPCION</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={nuevoSensor.descripcion}
                onChange={(e) => setNuevoSensor({ ...nuevoSensor, descripcion: e.target.value })}
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
                onChange={(e) => setEditarSensor({ ...editarSensor, nombre: e.target.value })}
              />
              <label className="block text-sm font-medium mt-4">DESCRIPCION</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                value={editarSensor.descripcion}
                type="text"
                onChange={(e) => setEditarSensor({ ...editarSensor, descripcion: e.target.value })}
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
  );
}

export default Sensores;
