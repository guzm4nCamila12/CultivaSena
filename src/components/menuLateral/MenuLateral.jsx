import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFincasById } from '../../services/fincas/ApiFincas';
import { obtenerIdUsuario, obtenerRol as rolToken, obtenerFinca } from '../../hooks/useDecodeToken';
import logoC from '../../assets/img/logoC.svg'

// Iconos
import Inicio from "../../assets/icons/inicio.svg";
import cultivaSena from "../../assets/icons/cultivaSenaIcon.svg";
import Estadisticas from "../../assets/icons/estadisticas.svg";
import Reporte from "../../assets/icons/reportes.svg";
import cerrarSesionIcon from "../../assets/icons/cerrarSesion.svg";
import { superAdminIcon, adminIcon, alternoIcon } from '../../assets/img/imagesExportation';
import cerrarRojo from "../../assets/icons/cerrarRojo.svg"
import cerrarIcon from "../../assets/icons/cerrar.png"
import sensor from "../../assets/icons/reporteSensores.svg"
import { fincasBlancas } from '../../assets/icons/IconsExportation';
import { TransferirFinca } from '../../assets/icons/IconsExportation';
import { getUsuarioById } from '../../services/usuarios/ApiUsuarios';

export default function MenuLateral({ onLogoutClick, onCloseMenu, isOpen }) {
    const navigate = useNavigate();
    const [hoverCerrar, setHoverCerrar] = useState(false);
    const [submenuAbierto, setSubmenuAbierto] = useState(null);
    const [fincas, setFincas] = useState([]);
    const [cargandoFincas, setCargandoFincas] = useState(true);
    const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
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
    
    // Navegar a inicio
    const goInicio = () => {
        const ruta = localStorage.getItem('principal') || '/';
        navigate(ruta);
    };
    
    const rol = rolToken()

    const idUser = obtenerIdUsuario()
    // Fetch de fincas al montar
    useEffect(() => {
        if (!isOpen) return;
        
        const fetchFincas = async () => {
            try {
                setCargandoFincas(true);
                const idUsuario = obtenerIdUsuario();
                const response = await getFincasById(idUsuario);
                setFincas(response || []);
                const data = await getUsuarioById(idUsuario);
                setUsuario(data || {});
            } catch (error) {
                console.error('Error al cargar fincas:', error);
            } finally {
                setCargandoFincas(false);
            }
        };
        
        if (idUser) {
            fetchFincas();
        }
        
    }, [isOpen,idUser]);
    
    const idFinca = obtenerFinca()
    
    return (
        <div className="flex flex-col h-full w-64 bg-[#002A43] border-r-[0.5px] border-gray-700 text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <a>
                    <img src={logoC} alt="Logo" className="h-9" />
                </a>
                <button onClick={onCloseMenu} className="text-white rounded-md border border-gray-700 hover:bg-gray-600 p-2">
                    <img src={cerrarIcon} alt="Cerrar" className="w-2 h-2" />
                </button>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-4 pt-6 space-y-7">
                <div onClick={() => {goInicio()
                    onCloseMenu()}} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={Inicio} alt="Inicio" className="h-6 w-6 mr-3" />
                    <span>Inicio</span>
                </div>
                <div className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={cultivaSena} alt="Cultiva Sena" className="h-6 w-7 mr-2" />
                    <a
            href={`${process.env.REACT_APP_API_URL_CULTIVA}/auth?id=${localStorage.getItem("user")}&token=${localStorage.getItem("session")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-AzulMarino text-sm font-semibold px-4 py-3 lg:px-5 lg:py-3 rounded-full transition whitespace-nowrap"
          >
            <span>Ir a <strong>CultivaSena</strong></span>
            </a>
                </div>

                {/* Estadísticas */}
                {rol !== 1 && (
                    <div>
                        {rol === 3 ? (
                            <div
                                onClick={() => {
                                    navigate(`/sensores-alterno/${idFinca}/${idUser}`, {
                                        state: {
                                            enableSelectionButton: true,
                                            titulo: "Seleccione sensores para generar grafica",
                                            vista: "/estadistica",
                                            tipo: "/reporteSensores"
                                        }
                                    });
                                    onCloseMenu(); // Cierra el menú
                                }}
                                className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                            >


                                <img src={Estadisticas} alt="Estadisticas" className="h-6 w-7 mr-2" />
                                <span>Estadistícas</span>
                            </div>
                        ) : (
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
                                                className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
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
                        )}
                    </div>
                )}

                {/* Reporte Actividades / Acciones */}
                {rol !== 1 && (
                    <div>
                        {rol === 3 ? (
                            // Rol 3: botón directo a alterno
                            <div
                                onClick={() => {
                                    navigate(`/sensores-alterno/${idFinca}/${obtenerIdUsuario()}`, {
                                        state: {
                                            enableSelectionButton: true,
                                            titulo: "Seleccione zonas para generar reporte",
                                            vista: "/reporte",
                                            tipo: "/reporteZonas"
                                        }
                                    });
                                    onCloseMenu();
                                }}
                                className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                            >

                                <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                                <span>Reporte Actividades</span>
                            </div>
                        ) : (
                            // Rol 2.: menú desplegable estándar
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
                                                className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 duration-300 ease-in-out transition flex items-center"
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
                )}

                {rol !== 1 && (
                    <div>
                        {rol === 3 ? (
                            <div
                                onClick={() => {
                                    navigate(`/sensores-alterno/${idFinca}/${obtenerIdUsuario()}`, {
                                        state: {
                                            enableSelectionButton: true,
                                            titulo: "Seleccione sensores para generar reporte.",
                                            vista: "/sensores",
                                            tipo: "/reporteSensores"
                                        }
                                    });
                                    onCloseMenu();
                                }}
                                className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                            >

                                <img src={sensor} alt="Reporte Actividades" className="h-8 w-8 mr-2 ml-1" />
                                <span>Reporte Sensores</span>
                            </div>
                        ) : (
                            <div>
                                <div
                                    onClick={() => toggleSubmenu('sensores')}
                                    className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
                                >
                                    <img src={sensor} alt="Reporte Actividades" className="h-8 w-8 mr-2 ml-1" />
                                    <span>Reporte Sensores</span>
                                </div>
                                <div className={`pl-12 mt-2 text-md flex flex-col space-y-2 transition-all duration-300 ease-in-out transform origin-top 
                                ${submenuAbierto === 'sensores' ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
                                    {cargandoFincas
                                        ? <span>Cargando...</span>
                                        : fincas.map(finca => (
                                            <Link to={`/activar-sensores/${finca.id}/${obtenerIdUsuario()}`}
                                                state={{ enableSelectionButton: true, titulo: "Seleccione sensores para generar reporte. ", vista: "/sensores" }}
                                                className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out flex"
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
                )}

                {/*Transferir fincas(Solo para superAdmin)*/}
                {rolToken() === 1 && (
                    <div
                        onClick={() => navigate("/transferir-finca")}
                        className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
                    >
                        <img src={TransferirFinca} alt="Transferir Fincas" className="h-8 w-9 mr-2" />
                        <span>Transferir Fincas</span>
                    </div>
                )}

            </div>

            {/* Perfil y Cerrar Sesión */}
            <div className="px-6 py-4 border-t  border-gray-700">
                <Link to={`/perfil-usuario`}>
                    <div className="flex items-center mb-4 hover:translate-x-1 transition">
                        <img src={`${process.env.REACT_APP_API_URL}/image/usuario/${usuario.id}`}
                          onError={(e) => {
                            e.target.onerror = null; // Evitar loop infinito
                            e.target.src = obtenerRol();
                          }} alt="Perfil" className="h-10 w-10 rounded-full" />
                        <div className="ml-3">
                            <span className="block font-bold">{usuario.nombre || 'Usuario'}</span>
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
