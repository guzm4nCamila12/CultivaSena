import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FincasAdmin() {
  const [fincas, setFincas] = useState([]);
  const [Usuario, setUsuario] = useState({ nombre: "Juan Perez", telefono: "123456789", correo: "juan@correo.com", clave: "1234", id_rol: "1" });

  // Simulación de carga de datos
  useEffect(() => {
    // Simulamos la carga de datos
    setFincas([
      { id: 1, nombre: "Finca 1" },
      { id: 2, nombre: "Finca 2" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">


        <p className="text-lg font-medium text-gray-600">OBSERVANDO A:</p>
        <h1 className="text-3xl font-bold text-center text-gray-800">{Usuario.nombre}</h1>

        <div className="bg-white shadow-md rounded-lg mt-6 p-4">
          <p className="text-gray-700">Tu Id: {Usuario.id}</p>

          <table className="table-auto w-full mt-4 border-collapse">
            <thead className="bg-gray-800 text-white text-center">
              <tr>
                <th className="px-4 py-2">Fincas</th>
                <th className="px-4 py-2">Alternos</th>
                <th className="px-4 py-2">Sensor/es</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(fincas) && fincas.length > 0 ? (
                fincas.map((finca, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-lg">{finca.nombre}</td>
                    <td className="px-4 py-2 text-center">
                      <Link to={`/alternos/${finca.id}`}>
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-400">
                          <i className="bi bi-person-fill"></i>
                        </button>
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link to={`/inicio-SuperAdmin/sensores-usuario/${finca.id}/${Usuario.id}`}>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400">
                          <i className="bi bi-app-indicator"></i>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No hay datos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
