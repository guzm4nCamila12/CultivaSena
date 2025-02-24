import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import { getFincasById } from '../../../services/fincas/ApiFincas';
import { getUsuarioById } from '../../../services/usuarios/ApiUsuarios';
import Gov from '../../../components/gov/gov';
import Navbar from '../../../components/gov/navbar';
export default function ListaFincas() {
  const { id } = useParams();
  // Estado para almacenar la lista de fincas
  const [fincas, setFincas] = useState([]);
  const [Usuario, setUsuario] = useState({});

  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    // Cargar usuario y fincas
    getUsuarioById(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error: ', error))

    getFincasById(id)
      .then(data => setFincas(data))
  }, []);




  console.log('Usuario:', Usuario);
  console.log('Fincas:', fincas);
  return (
    <div >
     
      <Navbar />
    <div className="container mx-auto">
      
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">{Usuario.nombre}</h1>
        <p className="text-lg">Administrador</p>
        <p className="text-sm text-gray-600">Tu Id: {Usuario.id}</p>
      </div>

      <div className="mb-4 text-center">
        <Link to={`/agregar-finca/${Usuario.id}`}>
          <button type="button" className="px-4 py-2 bg-gray-700 text-white rounded-md shadow-md hover:bg-gray-600">
            Agregar Finca
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Fincas</th>
            <th className="px-4 py-2 text-left">Alternos</th>
            <th className="px-4 py-2 text-left">Sensor/es</th>
            <th className="px-4 py-2 text-left">Editar</th>
            <th className="px-4 py-2 text-left">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(fincas) && fincas.length > 0 ? (
            fincas.map((finca, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-2">{finca.nombre}</td>
                <td className="px-4 py-2">
                  <Link to={`/alternos/${finca.id}`}>
                    <button type="button" className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-400">
                      Alternos
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <Link to={`/sensores-SuperAdmin/${finca.id}/${Usuario.id}`}>
                    <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-400">
                      Sensores
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <Link to={`/editar-finca/${finca.id}`}>
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                      Editar
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <button type="button" className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center text-gray-600">No hay datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
