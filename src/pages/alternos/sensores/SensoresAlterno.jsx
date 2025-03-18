//iconos de las columnas
import macBlue from "../../../assets/icons/macBlue.png";
import descripcionBlue from "../../../assets/icons/descripcionBlue.png";
import estadoBlue from "../../../assets/icons/estadoBlue.png"
//iconos de las acciones
import viewWhite from "../../../assets/icons/viewWhite.png";
//componentes reutilizados
import Navbar from "../../../components/navbar";
import UserCards from "../../../components/UseCards";
import Tabla from "../../../components/Tabla";
import Opcion from "../../../components/Opcion";
import MostrarInfo from "../../../components/mostrarInfo";
//endpoints para consumir el api
import { getFincasByIdFincas } from "../../../services/fincas/ApiFincas";
import { getSensoresById } from "../../../services/sensores/ApiSensores";
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function SensoresAlterno() {
  //Estado para almacenar datos
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
      const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
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
  //Se obtiene el id de la URL para identificar el recurso
  const { id } = useParams();

  useEffect(() => {
    //Obtiene la informacion de las fincas por ID 
    getFincasByIdFincas(id).then((data) => {
      setFincas(data);
    })

    //Obtiene los sensores asociados
    getSensoresById(id).then((data) => {
      if (data == null) {
        setSensores([]);
        return
      } else {

        setSensores(data);
      }
    })
  }, []);

  //Se ejecuta cuando cambia el usuario o la finca, ajustando los datos
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

  //Define las columnas para la UseCards
  const columnas = [
    { key: "nombre" },
    { key: "mac", label: "MAC", icon: macBlue },
    { key: "descripcion", label: "Descripción", icon: descripcionBlue },
    { key: "estado", label: "Inactivo/Activo", icon: estadoBlue },
  ];

  //Funcion que define las acciones que se muestran en cada fila
  const acciones = (fila) => (
    <div className="relative group">
      <Link to={`/datos-sensor/${fila.id}`}>
        <button className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={viewWhite} alt="Ver" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver Datos
          </span>
        </button>
      </Link>
    </div>
  );

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
  };
  return (
    <div >
      <Navbar />
      {/* Se renderiza la vista según lo que traiga en localStorage:
                Si vistaActiva es "tabla", se muestra el componente Tabla;
                de lo contrario, se muestra UserCards */}
      <MostrarInfo
          titulo={`Sensor de la finca: ${fincas.nombre}`}
          columnas={columnas}
          acciones={acciones}
          mostrarAgregar={false}
          datos={sensores.map((sensor, index) => ({
            ...sensor,
            "#": index + 1,
            estado: (
              <div className="flex justify-center items-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={sensor.estado} //Muestra el estado del sensor
                    disabled
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
        />
    </div>
  );
}

export default SensoresAlterno;
