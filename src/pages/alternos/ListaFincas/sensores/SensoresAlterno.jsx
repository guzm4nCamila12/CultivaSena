import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import { getSensoresById } from "../../../../services/sensores/ApiSensores";
import Navbar from "../../../../components/gov/navbar";
import Tabla from "../../../../components/Tabla";
import macIcon from "../../../../assets/icons/macBlue.png";
import descripcionIcon from "../../../../assets/icons/descBlue.png";
import estadoIcon from "../../../../assets/icons/estadoBlue.png";
import accionesIcon from "../../../../assets/icons/config.png";
import verIcon from "../../../../assets/icons/view.png";

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


  useEffect(() => {
    getFincasByIdFincas(id).then((data) => {
      setFincas(data);
    })

    getSensoresById(id).then((data) => {
      if (data == null) {
        setSensores([]);
        return
      } else {

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
    { key: "mac", label: "MAC", icon: macIcon },
    { key: "descripcion", label: "Descripción", icon: descripcionIcon },
    { key: "acciones", label: "Acciones", icon: accionesIcon },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon },
  ];



  const acciones = (fila) => (
    <div className="relative group">
      <Link to={`/datos-sensor/${fila.id}`}>
        <button className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={verIcon} alt="Ver" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver Datos
          </span>
        </button>
      </Link>
    </div>
  );
  return (
    <div>
      <Navbar />
      <Tabla
        titulo={`Sensor de la finca: ${fincas.nombre}`}
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
  );
}

export default SensoresAlterno;
