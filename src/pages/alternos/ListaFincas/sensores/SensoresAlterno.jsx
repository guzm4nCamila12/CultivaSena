import React, { useState, useEffect } from "react"; // Importación de hooks de React
import { useParams, Link } from "react-router-dom"; // Cambié 'react-router' por 'react-router-dom'
import "tailwindcss/tailwind.css"; // Asegúrate de que Tailwind CSS esté configurado en tu proyecto
import { getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import { getSensoresById } from "../../../../services/sensores/ApiSensores";
import Navbar from "../../../../components/gov/navbar";
function SensoresAlterno() {
  // Estado para almacenar la lista de sensores
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  
  const [formData, setFormData] = useState({
      mac: null,
      nombre: "",
      descripcion: "",
      estado: false,
      idusuario: "",
      idfinca: "",
    });
  
  const { id } = useParams(); // Usando el hook para obtener el parámetro 'id' de la URL
  
  const [check, setCheck] = useState(false); // Estado para el checkbox

  useEffect(() => {
   getFincasByIdFincas(id).then((data) => {
     setFincas(data);
   })

   getSensoresById(id).then((data) => {
     setSensores(data);
   })
   
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

  // Función para manejar el cambio de estado del checkbox
  const handleSwitch = (event) => {
    setCheck(event.target.checked); 
  };

  return (
    <div>
      <Navbar/>
    
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl text-center font-semibold text-gray-800">{fincas.nombre}</h1>
      <h2 className="text-xl text-gray-600 mt-2">Id de finca: {id}</h2>
      <p className="text-lg text-gray-600">Alterno</p>
      
      <table className="min-w-full table-auto mt-4 border-collapse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            <th className="px-4 py-2">N°</th>
            <th className="px-4 py-2">MAC</th>
            <th className="px-4 py-2">NOMBRE</th>
            <th className="px-4 py-2">DESCRIPCION</th>
            <th className="px-4 py-2">VER INFO</th>
            <th className="px-4 py-2">Inactivo/Activo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sensores) && sensores.length > 0 ? (
            sensores.map((sensor, index) => (
              <tr key={index} className="text-center border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{sensor.mac}</td>
                <td className="px-4 py-2">{sensor.nombre}</td>
                <td className="px-4 py-2">{sensor.descripcion}</td>
                <td className="px-4 py-2">
                  <Link to={`/datos-sensores`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Ver
                    </button>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={sensor.estado}
                        onChange={handleSwitch}
                        disabled
                        className="form-checkbox h-6 w-6 text-blue-500"
                      />
                    </label>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-4">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default SensoresAlterno;
