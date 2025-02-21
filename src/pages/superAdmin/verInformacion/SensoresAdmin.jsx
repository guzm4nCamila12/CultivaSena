import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function SensoresAdmin() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  const [formData, setFormData] = useState({
    mac: "",
    nombre: "",
    descripcion: "",
    estado: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const { id, idUser } = useParams();

  // Datos de prueba para simular los sensores
  useEffect(() => {
    setFincas({ nombre: "Finca Ejemplo", id });
    setUsuario({ nombre: "Administrador", id: idUser });

    setSensores([
      { id: 1, mac: "00:14:22:01:23:45", nombre: "Sensor 1", descripcion: "Descripción 1", estado: true },
      { id: 2, mac: "00:14:22:01:23:46", nombre: "Sensor 2", descripcion: "Descripción 2", estado: false },
    ]);
  }, [id, idUser]);

  // Maneja el cambio en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Abre el modal para agregar un nuevo sensor
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Maneja el envío del formulario (solo para demostración, no hace nada real)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    setIsModalOpen(false); // Cerrar el modal después de enviar el formulario
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <p className="text-lg font-medium text-gray-600">OBSERVANDO A:</p>
        <h1 className="text-3xl font-bold text-center text-gray-800">{fincas.nombre}</h1>
        <h2 className="text-xl text-center text-gray-600">Id de finca: {id}</h2>

        <p className="text-lg mt-4 text-gray-700">Administrador: {usuario.nombre}</p>

        {/* Botón para abrir el modal */}
        <button
          type="button"
          className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-400"
          onClick={handleOpenModal}
        >
          Agregar Sensor
        </button>

        <table className="table-auto w-full mt-6 bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-white text-center">
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">MAC</th>
              <th className="px-4 py-2">NOMBRE</th>
              <th className="px-4 py-2">DESCRIPCION</th>
              <th className="px-4 py-2">Inactivo/Activo</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(sensores) && sensores.length > 0 ? (
              sensores.map((sensor, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-center">{sensor.id}</td>
                  <td className="px-4 py-2 text-center">{sensor.mac}</td>
                  <td className="px-4 py-2">{sensor.nombre}</td>
                  <td className="px-4 py-2">{sensor.descripcion}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      className="form-checkbox h-5 w-5 text-blue-500"
                      type="checkbox"
                      checked={sensor.estado}
                      disabled
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal para agregar un nuevo sensor */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center">
                <h5 className="text-xl font-semibold">INSERTAR SENSOR</h5>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <label className="block text-gray-700 mt-4">NOMBRE</label>
                <input
                  className="form-input mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />

                <label className="block text-gray-700 mt-4">DESCRIPCION</label>
                <input
                  className="form-input mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción"
                  required
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-400"
                    onClick={handleCloseModal}
                  >
                    CERRAR
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                  >
                    AGREGAR
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
