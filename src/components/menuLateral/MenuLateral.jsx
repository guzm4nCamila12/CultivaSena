import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFincasById } from '../../services/fincas/ApiFincas';
import { obtenerIdUsuario, obtenerNombre, obtenerRol as rolToken, obtenerFinca } from '../../hooks/useDecodeToken';

// Iconos
import Inicio from "../../assets/icons/pagina-de-inicio.png";
import cultivaSena from "../../assets/icons/cultivaSena.png";
import Estadisticas from "../../assets/icons/grafico-de-barras.png";
import Reporte from "../../assets/icons/reporteActividades.png";
import cerrarSesionIcon from "../../assets/icons/cerrarSesion.svg";
import { superAdminIcon, adminIcon, alternoIcon, finca } from '../../assets/img/imagesExportation';
import cerrarRojo from "../../assets/icons/cerrarRojo.svg"
import cerrarIcon from "../../assets/icons/cerrar.png"
import sensor from "../../assets/icons/reportesSensor.png"
import { fincasBlancas } from '../../assets/icons/IconsExportation';
import { TransferirFinca } from '../../assets/icons/IconsExportation';
import ayuda from '../../assets/icons/ayuda.png'

import { useLocation } from 'react-router-dom';
import { useDriverTour } from "../../hooks/useTourDriver";
import {
  fincaDriverSteps,
  zonasDriverSteps,
  actividadesDriverSteps,
  mostarInfoDriverSteps,
  sensoresDriverSteps,
  alternosDriverSteps,
  sensorAlternosDriverSteps,
  crearFincaSteps,
  editarFincaSteps
} from '../../utils/aplicationSteps';

export default function MenuLateral({ onLogoutClick, onCloseMenu }) {
    const navigate = useNavigate();

    const { startTour } = useDriverTour();
    const location = useLocation();

    const handleStartTour = () => {
        localStorage.setItem("tour_usuario_visto", "false");
        onCloseMenu();
    
        if (location.pathname.includes('/lista-fincas')) {
          startTour(fincaDriverSteps);
        } else if (location.pathname.includes('/zonas')) {
          startTour(zonasDriverSteps);
        } else if (location.pathname.includes('/actividadesZonas')) {
          startTour(actividadesDriverSteps);
        } else if (location.pathname.includes('/activar-sensores')) {
          startTour(sensoresDriverSteps);
        } else if (location.pathname.includes('/alternos')) {
          startTour(alternosDriverSteps);
        } else {
          startTour(mostarInfoDriverSteps); // fallback
        }
      };

    const [hoverCerrar, setHoverCerrar] = useState(false);
    const [submenuAbierto, setSubmenuAbierto] = useState(null);
    const [fincas, setFincas] = useState([]);
    const [cargandoFincas, setCargandoFincas] = useState(true);

    // Obtener ícono según rol
    const obtenerRol = () => {
        switch (rolToken()) {
            case 1: return superAdminIcon;
            case 2: return adminIcon;
            case 3: return alternoIcon;
            default: return alternoIcon;
        }
    };

    const toggleSubmenu = (submenu) => {
        setSubmenuAbierto(prev => (prev === submenu ? null : submenu));
    };

    const rol = rolToken();

    // Navegar a inicio
    const goInicio = () => {
        const ruta = localStorage.getItem('principal') || '/';
        navigate(ruta);
    };

    // Fetch de fincas al montar
    useEffect(() => {
        const fetchFincas = async () => {
            try {
                setCargandoFincas(true);
                const response = await getFincasById(obtenerIdUsuario());
                setFincas(response || []);
            } catch (error) {
                console.error('Error al cargar fincas:', error);
            } finally {
                setCargandoFincas(false);
            }
        };

        if (obtenerIdUsuario()) {
            fetchFincas();
        }
    }, [obtenerIdUsuario()]);

    const idFinca = obtenerFinca()

    return (
        <div className="flex flex-col h-full w-64 bg-[#002A43] border-r-[0.5px] border-gray-700 text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <a href="/dashboard">
                    <img src="/logoC.svg" alt="Logo" className="h-9" />
                </a>
                <button onClick={onCloseMenu} className="text-white rounded-md border border-gray-700 p-2">
                    <img src={cerrarIcon} alt="Cerrar" className="w-2 h-2" />
                </button>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-4 pt-6 space-y-7">
                <div onClick={goInicio} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={Inicio} alt="Inicio" className="h-6 w-6 mr-3" />
                    <span>Inicio</span>
                </div>
                <div className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={cultivaSena} alt="Cultiva Sena" className="h-6 w-7 mr-2" />
                    <span>Ir a <strong>CultivaSena</strong></span>
                </div>

                {/* Estadísticas */}
                <div id='estadisticasSteps'>
                    <div
                        onClick={() => toggleSubmenu('estadisticas')}
                        className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
                    >
                        <img src={Estadisticas} alt="Estadísticas" className="h-6 w-7 mr-2" />
                        <span>Estadísticas</span>
                    </div>
                    <div className={`pl-10 flex mt-2 flex-col text-sm space-y-2 text-white transition-all duration-300 ease-in-out transform origin-top ${submenuAbierto === 'estadisticas' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                        {cargandoFincas
                            ? <span>Cargando...</span>
                            : fincas.map(finca => (
                                <Link to={`/activar-sensores/${finca.id}/${obtenerIdUsuario()}`} state={{ enableSelectionButton: true, titulo: "Seleccione sensores para generar gráfica. ", vista: "/estadistica" }}
                                    className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition"
                                >
                                    <div className='flex'>
                                        <img src={fincasBlancas} alt="" className='mr-1 w-5' />
                                        <h3> {finca.nombre}</h3>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>

                {/* Reporte Actividades */}
                <div>
                    {rol === 3 ? (
                        // Rol 3: botón directo que lleva a selección de zonas sin desplegable
                        <Link
                            to={`/sensores-alterno/${idFinca}/${obtenerIdUsuario()}`}
                            state={{ enableSelectionButton: true, titulo: "Seleccione zonas para generar reporte", vista: "/reporte", tipo: "/reporteZonas" }}
                            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                        >
                            <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                            <span>Reporte Actividades</span>
                        </Link>
                    ) : (
                        // Roles distintos de 3: menú desplegable normal para selección de fincas y zonas
                        <div>
                            <div
                                onClick={() => toggleSubmenu('reporte')}
                                className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                            >
                                <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                                <span>Reporte Actividades</span>
                            </div>
                            <div className={`pl-12 mt-2 text-md flex flex-col space-y-2 transition-all duration-300 ease-in-out transform origin-top
                               ${submenuAbierto === 'reporte' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}
                            >
                                {cargandoFincas
                                    ? <span>Cargando...</span>
                                    : fincas.map(finca => (
                                        <Link
                                            key={finca.id}
                                            to={`/zonas/${finca.id}/${obtenerIdUsuario()}`}
                                            state={{ enableSelectionButton: true, titulo: "Seleccione zonas para generar reporte", vista: "/reporte" }}
                                            className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition flex items-center"
                                        >
                                            <img src={fincasBlancas} alt="" className='mr-1 w-5' />
                                            <h3>{finca.nombre}</h3>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    {rol === 3 ? (
                        <Link
                            to={`/sensores-alterno/${idFinca}/${obtenerIdUsuario()}`}
                            state={{ enableSelectionButton: true, titulo: "Seleccione sensores para generar reporte.", vista: "/sensores", tipo: "/reporteSensores" }}
                            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                        >
                            <img src={sensor} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                            <span>Reporte Sensores</span>
                        </Link>
                    ) : (
                        <div>
                            <div
                                onClick={() => toggleSubmenu('sensores')}
                                className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                            >
                                <img src={sensor} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                                <span>Reporte Sensores</span>
                            </div>
                            <div className={`pl-12 mt-2 text-md flex flex-col space-y-2 transition-all duration-300 ease-in-out transform origin-top 
                                ${submenuAbierto === 'sensores' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                                {cargandoFincas
                                    ? <span>Cargando...</span>
                                    : fincas.map(finca => (
                                        <Link to={`/activar-sensores/${finca.id}/${obtenerIdUsuario()}`}
                                            state={{ enableSelectionButton: true, titulo: "Seleccione sensores para generar reporte. ", vista: "/sensores" }}
                                            className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition flex"
                                        >
                                            <img src={fincasBlancas} alt="" className='mr-1 w-5' />
                                            <h3> {finca.nombre}</h3>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/*Trnasferir fincas(Solo para superAdmin)*/}
                {rolToken() === 1 && (
                    <div
                        onClick={() => navigate("/transferir-finca")}
                        className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
                    >
                        <img src={TransferirFinca} alt="Transferir Fincas" className="h-8 w-9 mr-2" />
                        <span>Transferir Fincas</span>
                    </div>
                )}

                <div className='flex cursor-help items-center'>
                    <button
                        className='flex'
                        onClick={handleStartTour}
                    >
                        <img src={ayuda} alt="" className='h-8 w-8 mr-3' />
                        <span>Ayuda</span>
                    </button>
                </div>

            </div>

            {/* Perfil y Cerrar Sesión */}
            <div className="px-6 py-4 border-t border-gray-700">
                <Link to={`/perfil-usuario`}>
                    <div className="flex items-center mb-4">
                        <img src={obtenerRol()} alt="Perfil" className="h-10 w-10 rounded-full" />
                        <div className="ml-3">
                            <span className="block font-bold">{obtenerNombre() || 'Usuario'}</span>
                            <span className="text-sm">Ver perfil</span>
                        </div>
                    </div>
                </Link>
                <div
                    onClick={onLogoutClick}
                    onMouseEnter={() => setHoverCerrar(true)}
                    onMouseLeave={() => setHoverCerrar(false)}
                    className="mb-2 p-2 rounded-full hover:translate-x-2 transition duration-300 ease-in-out flex justify-center cursor-pointer hover:text-red-500"
                >
                    <img src={hoverCerrar ? cerrarRojo : cerrarSesionIcon} alt="Cerrar sesión" className='mr-1 w-6 h-6' />
                    <span>Cerrar sesión</span>
                </div>
            </div>
        </div >
    );
}
