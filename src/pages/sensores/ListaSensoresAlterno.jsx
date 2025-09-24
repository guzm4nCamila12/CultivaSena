//importaciones necesarias de react
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
//iconos de las columnas
import { sensoresIcon, mac, descripcion, estadoIcon, ajustes, ver, actividadesIcon, nombre } from "../../assets/icons/IconsExportation"
//componentes reutilizados
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
//endpoints para consumir el api
import { getFincasByIdFincas, getZonasByIdFinca } from "../../services/fincas/ApiFincas";
import { getSensoresById } from "../../services/sensores/ApiSensores";
import { usePermisos } from "../../hooks/usePermisos";

function SensoresAlterno() {
  //Estado para almacenar datos
  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [sensores, setSensores] = useState([]);
  const [zonas, setZonas] = useState([]);

  const location = useLocation()
  const { state } = useLocation();
  const vista = state?.vista ?? '';
  const [hideTabs, setHideTabs] = useState(false);
  const [Alternar, setAlternar] = useState(() => localStorage.getItem("Alternar") === "true");
  const { permisos } = usePermisos()

  const [redirection, setRedirection] = useState(null)

  useEffect(() => {
    const redirectionFromState = location.state?.redirection;

    if (redirectionFromState === "Rsensores") {
      setRedirection(true);
    } else if (redirectionFromState === "Rzonas") {
      setRedirection(false);
    } else {
      setRedirection(null);
    }
  }, [location.state?.redirection]);

  useEffect(() => {
    if (redirection === true && !Alternar) {
      setAlternar(true);
      localStorage.setItem("Alternar", "true");
    } else if (redirection === false && Alternar) {
      setAlternar(false);
      localStorage.setItem("Alternar", "false");
    }
  }, [redirection]);

  const enableSelectionButton =
    (vista === '/reporte' || vista === '/sensores' || vista === '/estadistica')
      ? (state.enableSelectionButton ?? false)
      : false;

  const tipo = location.state?.tipo ?? "";

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

  //Se obtiene el id de la URL para identificar el recurso
  const { id } = useParams();

  useEffect(() => {
    const nuevaVista = location.state?.vista ?? '';
    const nuevoTipo = location.state?.tipo ?? '';

    const newHide = nuevaVista === '/reporte' || nuevaVista === '/sensores' || nuevaVista === '/estadistica';
    setHideTabs(newHide);

    if (nuevoTipo === '/reporteZonas') {
      setAlternar(false);
    } else if (nuevoTipo === '/reporteSensores') {
      setAlternar(true);
    } else if (!newHide) {
      setAlternar(localStorage.getItem("Alternar") === "true");
    }
  }, [location]);

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

  const getTitulo = () => {
    const nombreFinca = fincas?.nombre || '...';

    if (tipo === "/reporteSensores") {
      return location.state?.titulo
    }
    else {
      return `Sensores de la Finca: ${nombreFinca}`
    }

  };

  const getTitulo2 = () => {
    const nombreFinca = fincas?.nombre || '...';

    if (tipo === "/reporteZonas") {
      return location.state?.titulo
    }
    else {
      return `Zonas de la finca: ${nombreFinca}`
    }

  };

  const tituloMostrar = getTitulo();

  const tituloMostrar2 = getTitulo2()


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
    <div id="verDatosSensor" className="relative group">
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
      permisos["ver zonas"]?.tienePermiso && (
        <Link to={`/sensoresZonas/${zona.id}/${fincas.idusuario}`}>
          <button id="sensoresSteps" className="group relative">
            <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
              {/* Mostrar cantidad de sensores al lado de "Ver más..." */}
              <span className="text-[#3366CC] font-bold whitespace-nowrap">({zona.cantidad_sensores}) Ver más...</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver sensores
            </span>
          </button>
        </Link>)
    ),
    actividades: (
      permisos["ver actividades"]?.tienePermiso && (
        <Link to={`/actividadesZonas/${zona.id}`}>
          <button id="actividadesSteps" className="group relative">
            <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
              <span className="text-[#3366CC] font-bold">Ver más...</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver actividades
            </span>
          </button>
        </Link>
      )
    )
  }));

  return (
    <>

      <div >
        <Navbar />
        {!hideTabs && (
          <div className="flex justify-start px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 my-4 w-[80%] space-x-4">
            <button
              className={`px-7 py-2 font-bold rounded-full transition ${Alternar ? "bg-[#39A900] text-white" : "bg-white text-[#00304D]"}`}
              onClick={() => { setAlternar(true); localStorage.setItem("Alternar", "true"); }}
            >
              Sensores
            </button>
            <button
              className={`px-7 py-2 font-bold rounded-full transition ${!Alternar ? "bg-[#39A900] text-white" : "bg-white text-[#00304D]"}`}
              onClick={() => { setAlternar(false); localStorage.setItem("Alternar", "false"); }}
            >
              Zonas
            </button>
          </div>
        )}
        {Alternar ? (
          permisos["ver sensores"]?.tienePermiso ? (

            <MostrarInfo
              titulo={tituloMostrar}
              columnas={columnas}
              acciones={acciones}
              mostrarAgregar={false}
              vista={vista}
              enableSelectionButton={enableSelectionButton}
              datos={sensores.map((sensor, index) => ({
                ...sensor,
                "#": index + 1,
                estado: (
                  <div id="noActivar" className="flex justify-center items-center">
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
          ): (
            <p className="flex justify-center items-center">
              <span>No tienes permisos para ver</span>
              <strong className="ml-1">Sensores.</strong>
            </p>
          )
        ) : (
          permisos["ver zonas"]?.tienePermiso ? (
            <MostrarInfo
              titulo={tituloMostrar2}
              columnas={columnasZonas}
              mostrarAgregar={false}
              datos={zonaszonas}
              vista={vista}
              enableSelectionButton={enableSelectionButton}
            />
          ) : (
            <p className="flex justify-center items-center">
              <span>No tienes permisos para ver</span>
              <strong className="ml-1">Zonas.</strong>
            </p>
          )
        )}

      </div>

    </>
  );
}

export default SensoresAlterno;
