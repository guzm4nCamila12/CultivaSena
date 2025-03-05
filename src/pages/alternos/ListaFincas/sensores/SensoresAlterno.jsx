import React, { useState, useEffect } from "react"; 
import { useParams, Link } from "react-router-dom"; 
import "tailwindcss/tailwind.css"; 
import { getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import { getSensoresById } from "../../../../services/sensores/ApiSensores";
import Navbar from "../../../../components/gov/navbar";
import Tabla from "../../../../components/Tabla";
import macIcon from "../../../../assets/icons/mac.png";
import nombreIcon from "../../../../assets/icons/nombre.png";
import descripcionIcon from "../../../../assets/icons/descripcion.png";
import estadoIcon from "../../../../assets/icons/estado.png";
import accionesIcon from "../../../../assets/icons/config.png";
import verIcon from "../../../../assets/icons/view.png";
import { useNavigate } from 'react-router-dom';

function SensoresAlterno() {
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
  
  const { id } = useParams(); 
  
  const [check, setCheck] = useState(false);

  useEffect(() => {
   getFincasByIdFincas(id).then((data) => {
     setFincas(data);
   })

   getSensoresById(id).then((data) => {
    if(data == null){
      setSensores([]);
      return
    }else{

      setSensores(data);
    }
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

  const columnas = [
    { key: "#", label: "#" },
    { key: "mac", label: "MAC", icon: macIcon },
    { key: "nombre", label: "Nombre", icon: nombreIcon },
    { key: "descripcion", label: "Descripción", icon: descripcionIcon },
    { key: "acciones", label: "Acciones", icon: accionesIcon },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon },
  ];

  const navigate = useNavigate();
  console.log(sensores)
  const verDatos = () => {
    navigate(`/datos-sensor`);
  };

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <button onClick={verDatos}>
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg[#93A6B2] flex items-center justify-center">
          <img src={verIcon} alt="Ver" />
        </div>
      </button>
    </div>
  );

  // Función para manejar el cambio de estado del checkbox
  const handleSwitch = (event, sensorId) => {
    // Actualizar el estado del sensor en la lista de sensores
    setSensores(prevSensores => 
      prevSensores.map(sensor =>
        sensor.id === sensorId ? { ...sensor, estado: event.target.checked } : sensor
      )
    );
  };

  return (
    <div>
      <Navbar/>
    
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl text-center font-semibold text-gray-800">{fincas.nombre}</h1>
      <h1 className="text-3xl text-center font-semibold text-gray-800">{usuario.nombre}</h1>

      <Tabla 
        columnas={columnas} 
        datos={sensores.map((sensor, index) => ({
          ...sensor, 
          "#": index + 1,
          estado: (
            <div className="flex justify-center items-center">
              <label className="switch">
              <input
                type="checkbox"
                checked={sensor.estado} // Se mantiene el estado actual del sensor
                disabled // Evita que el usuario lo modifique
                className="sr-only"
              />
              <div className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-blue-500' : ''}`}>
                <div
                  className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
                ></div>
              </div>
              </label>
            </div>
          ),
        }))}
        acciones={acciones} 
      />
        
    </div>
    </div>
  );
}

export default SensoresAlterno;
