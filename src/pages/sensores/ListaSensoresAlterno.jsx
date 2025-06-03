//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
//iconos de las columnas
import {sensoresIcon,mac,descripcion,estadoIcon,ajustes,ver,actividadesIcon,nombre} from "../../assets/icons/IconsExportation"
//componentes reutilizados
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
//endpoints para consumir el api
import { getFincasByIdFincas, getZonasByIdFinca } from "../../services/fincas/ApiFincas";
import { getSensoresById } from "../../services/sensores/ApiSensores";


function SensoresAlterno() {
  //Estado para almacenar datos
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");
  const [sensores, setSensores] = useState([]);
  const [zonas, setZonas] = useState([]);

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

  //se alterna entre los sensores y las zonas
  const [Alternar, setAlternar] = useState(() => {
    const alternarGuardado = localStorage.getItem("Alternar");
    return alternarGuardado === "true"; // convierte a booleano
  });;

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

    getZonasByIdFinca(id)
      .then(data => {
        setZonas(data || [])
      })
      .catch(error => console.error("Error: ", error));
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

  //columnas para la tabla de zonas
  const columnasZonas = [
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "verSensores", label: "Sensores", icon: sensoresIcon, icon2: sensoresIcon },
    { key: "actividades", label: "Actividades", icon: actividadesIcon, icon2: actividadesIcon }
  ];

  //Define las columnas para la UseCards
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: sensoresIcon },
    { key: "mac", label: "MAC", icon: mac, icon2: mac },
    { key: "descripcion", label: "Descripción", icon: descripcion, icon2: descripcion },
    { key: "estado", label: "Inactivo/Activo", icon: estadoIcon, icon2: estadoIcon },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];


  //Funcion que define las acciones que se muestran en cada fila
  const acciones = (fila) => (
    <div className="relative group">
      <Link to={`/datos-sensor/${fila.id}`}>
        <button className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={ver} alt="Ver" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver Datos
          </span>
        </button>
      </Link>
    </div>
  );

   const zonaszonas = zonas.map(zona => ({
      ...zona,
      cantidadSensores: (
        <h2>{zona.cantidad_sensores}</h2>
      ),
      verSensores: (
        <Link to={`/sensoresZonas/${zona.id}/${fincas.idusuario}`}>
          <button className="group relative">
            <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
              {/* Mostrar cantidad de sensores al lado de "Ver más..." */}
              <span className="text-[#3366CC] font-bold whitespace-nowrap">({zona.cantidad_sensores}) Ver más...</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver sensores
            </span>
          </button>
        </Link>
      ),
      actividades: (
        <Link to={`/actividadesZonas/${zona.id}`}>
          <button className="group relative">
            <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
              <span className="text-[#3366CC] font-bold">Ver más...</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver actividades
            </span>
          </button>
        </Link>
      )
    }));

    const AlternarTabla = (estado) => {
      setAlternar(estado);
      localStorage.setItem("Alternar", estado);
    }

  return (
    <div >
      <Navbar />
      <div className="w-auto p-4 xl:mx-36 lg:mx-16 sm:mx-5 flex mx-auto text-xl font-semibold ">
        <button className={`px-7 py-[9px] w-40 rounded-full flex items-center justify-center transition-all  ${Alternar ?  "bg-[#00304D] hover:bg-[#002438] text-white" : "bg-white text-[#00304D] hover:bg-gray"}`} onClick={() => AlternarTabla(true)}>Sensores</button>
        <button className={`w-40 px-7 py-[9px] rounded-full  flex items-center justify-center transition-all ${!Alternar ? "bg-[#00304D] hover:bg-[#002438] text-white " : "bg-white text-[#00304D] hover:bg-gray"}`} onClick={() => AlternarTabla(false)}>Zonas</button>
      </div>
      {Alternar ? (
        <MostrarInfo
        titulo={`Sensores de la finca: ${fincas.nombre}`}
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
                  className="sr-only" />
                <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${sensor.estado ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div
                    className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sensor.estado ? 'translate-x-6' : 'translate-x-0'}`}
                  ></div>
                </div>
              </label>
            </div>
          ),
        }))}
      />
      ) : (
        <MostrarInfo
        titulo={`Zonas de la finca: ${fincas.nombre}`}
        columnas={columnasZonas}
        mostrarAgregar={false}
        datos={zonaszonas}
      />
      )}
      
    </div>
  );
}

export default SensoresAlterno;
