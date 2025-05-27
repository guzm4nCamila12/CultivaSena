// src/components/menuLateral/MenuLateral.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Iconos
import Inicio from "../../assets/icons/pagina-de-inicio.png";
import cultivaSena from "../../assets/icons/cultivaSena.png";
import Estadisticas from "../../assets/icons/grafico-de-barras.png";
import Reporte from "../../assets/icons/reporteActividades.png";
import cerrarSesionIcon from "../../assets/icons/log-out-1.png"
import { superAdminIcon, adminIcon, alternoIcon } from '../../assets/img/imagesExportation';

export default function MenuLateral({ onLogoutClick }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : {};

    const obtenerRol = () => {
        switch (decodedToken.idRol) {
            case 1: return superAdminIcon;
            case 2: return adminIcon;
            case 3: return alternoIcon;
            default: return alternoIcon;
        }
    };

    const goInicio = () => {
        const ruta = localStorage.getItem('principal') || '/';
        navigate(ruta);
    };

    return (
        <div className="flex flex-col h-full w-64 bg-[#002A43] text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <a href="/dashboard">
                    <img src="/logoC.svg" alt="Logo" className="h-9" />
                </a>
                <button className="text-white">x</button>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-4 pt-6 space-y-7">
                <div onClick={goInicio} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition">
                    <img src={Inicio} alt="Inicio" className="h-6 w-6 mr-3" />
                    <span>Inicio</span>
                </div>
                <div onClick={() => window.open('https://cultivasena.edu.co', '_blank')} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition">
                    <img src={cultivaSena} alt="Cultiva Sena" className="h-6 w-7 mr-2" />
                    <span>Ir a <strong>CultivaSena</strong></span>
                </div>
                <div onClick={() => navigate('/estadisticas')} className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition">
                    <img src={Estadisticas} alt="Estadísticas" className="h-6 w-7 mr-2" />
                    <span>Estadísticas</span>
                </div>
                <div onClick={() => navigate('/reporte-actividades')} className="flex items-center pb-6 cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition">
                    <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
                    <span>Reporte Actividades</span>
                </div>
            </div>
            {/* Perfil y Cerrar Sesión */}
            <div className="px-6 py-4 border-t border-gray-700">
                <div className="flex items-center mb-4">
                    <img src={obtenerRol()} alt="Perfil" className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                        <span className="block font-bold">{decodedToken.nombre || 'Usuario'}</span>
                        <span className="text-sm">Ver perfil</span>
                    </div>
                </div>
                <div onClick={onLogoutClick} className="mb-2 p-2 px-5 rounded-full flex items-center cursor-pointer hover:bg-red-500">
                    <img src={cerrarSesionIcon} alt="" className='mr-2' />
                    <span>Cerrar sesión</span>
                </div>
            </div>
        </div>
    );
}