import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { getFincasById } from '../../services/fincas/ApiFincas';
import { obtenerIdUsuario, obtenerRol as rolToken, obtenerFinca } from '../../hooks/useDecodeToken';
import logoC from '../../assets/img/logoC.svg'
// Iconos
import Inicio from "../../assets/icons/inicio.svg";
import cultivaSena from "../../assets/icons/cultivaSenaIcon.svg";
import cerrarSesionIcon from "../../assets/icons/cerrarSesion.svg";
import { superAdminIcon, adminIcon, alternoIcon } from '../../assets/img/imagesExportation';
import cerrarRojo from "../../assets/icons/cerrarRojo.svg"
import cerrarIcon from "../../assets/icons/cerrar.png"
import { TransferirFinca } from '../../assets/icons/IconsExportation';
import { getUsuarioById } from '../../services/usuarios/ApiUsuarios';
import { usePermisos } from '../../hooks/usePermisos';
import EstadisticasMenu from './modules/estadisticasMenu';
import ReporteActividadesMenu from './modules/reporteActividades';
import ReporteSensoresMenu from './modules/reporteSensores';

// Obtener ícono según rol
const obtenerRol = () => {
    switch (rolToken()) {
        case 1: return superAdminIcon;
        case 2: return adminIcon;
        case 3: return alternoIcon;
        default: return alternoIcon;
    }
};

function goInicio(navigate) {
    const ruta = localStorage.getItem('principal') || '/';
    navigate(ruta);
}


export default function MenuLateral({ onLogoutClick, onCloseMenu, isOpen }) {
    const navigate = useNavigate();
    const [hoverCerrar, setHoverCerrar] = useState(false);
    const [submenuAbierto, setSubmenuAbierto] = useState(null);
    const [fincas, setFincas] = useState([]);
    const [cargandoFincas, setCargandoFincas] = useState(true);
    const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
    const { permisos } = usePermisos()

    const toggleSubmenu = (submenu) => {
        setSubmenuAbierto(prev => (prev === submenu ? null : submenu));
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

    }, [isOpen, idUser]);

    const idFinca = obtenerFinca()

    return (
        <div className="flex flex-col h-full w-64 bg-[#002A43] border-r-[0.5px] border-gray-700 text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <img src={logoC} alt="Logo" className="h-9" />
                <button onClick={onCloseMenu} className="text-white rounded-md border border-gray-700 hover:bg-gray-600 p-2">
                    <img src={cerrarIcon} alt="Cerrar" className="w-2 h-2" />
                </button>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-4 pt-6 space-y-7">
                <button onClick={() => {
                    goInicio(navigate)
                    onCloseMenu()
                }} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={Inicio} alt="Inicio" className="h-6 w-6 mr-3" />
                    <span>Inicio</span>
                </button>
                <div className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out">
                    <img src={cultivaSena} alt="Cultiva Sena" className="h-6 w-7" />
                    <Link
                        to={`${process.env.REACT_APP_API_URL_CULTIVA}/auth?id=${localStorage.getItem("user")}&token=${localStorage.getItem("session")}`}
                        rel="noopener noreferrer"
                        className="bg-AzulMarino text-sm font-semibold px-4 py-3 lg:px-2 lg:py-3 rounded-full transition whitespace-nowrap"
                    >
                        <span>Ir a <strong>CultivaSena</strong></span>
                    </Link>
                </div>
                {fincas.length >= 1 && (
                    <>
                        {/* Estadísticas */}
                        <EstadisticasMenu
                            rol={rol}
                            idFinca={idFinca}
                            idUser={idUser}
                            submenuAbierto={submenuAbierto}
                            toggleSubmenu={toggleSubmenu}
                            cargandoFincas={cargandoFincas}
                            fincas={fincas}
                            onCloseMenu={onCloseMenu}
                        />

                        {/* Reporte Actividades / Acciones */}
                        <ReporteActividadesMenu
                            rol={rol}
                            idFinca={idFinca}
                            idUser={idUser}
                            submenuAbierto={submenuAbierto}
                            toggleSubmenu={toggleSubmenu}
                            cargandoFincas={cargandoFincas}
                            fincas={fincas}
                            onCloseMenu={onCloseMenu}
                        />

                        {/* Reporte Sensores / Acciones */}
                        <ReporteSensoresMenu
                            rol={rol}
                            idFinca={idFinca}
                            idUser={idUser}
                            submenuAbierto={submenuAbierto}
                            toggleSubmenu={toggleSubmenu}
                            cargandoFincas={cargandoFincas}
                            fincas={fincas}
                            onCloseMenu={onCloseMenu}
                        />
                    </>
                )}

                {/*Transferir fincas(Solo para superAdmin)*/}
                {rolToken() === 1 && (
                    permisos["editar fincas"]?.tienePermiso && (
                        <button
                            onClick={() => navigate("/transferir-finca")}
                            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
                        >
                            <img src={TransferirFinca} alt="Transferir Fincas" className="h-8 w-9 mr-2" />
                            <span>Transferir Fincas</span>
                        </button>
                    )
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
                            <span className="block truncate max-w-40 font-bold">{usuario.nombre || 'Usuario'}</span>
                            <span className="text-sm">Ver perfil</span>
                        </div>
                    </div>
                </Link>
                <button
                    onClick={onLogoutClick}
                    onMouseEnter={() => setHoverCerrar(true)}
                    onMouseLeave={() => setHoverCerrar(false)}
                    className="mb-2 p-2 rounded-full hover:translate-x-2 transition duration-300 ease-in-out flex justify-center cursor-pointer hover:text-red-500"
                >
                    <img src={hoverCerrar ? cerrarRojo : cerrarSesionIcon} alt="Cerrar sesión" className='mr-1 w-6 h-6' />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div >
    );
}
MenuLateral.propTypes = {
    onLogoutClick: PropTypes.func.isRequired,
    onCloseMenu: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};