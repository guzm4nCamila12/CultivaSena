import { useState } from 'react';
import CerrarSesion from "../auth/logOut";
import Inicio from "../../assets/icons/pagina-de-inicio.png"
import cultivaSena from "../../assets/icons/cultivaSena.png"
import Estadisticas from "../../assets/icons/grafico-de-barras.png"
import Reporte from "../../assets/icons/reporteActividades.png"
import { superAdminIcon, adminIcon, alternoIcon } from '../../assets/img/imagesExportation';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Sidebar() {
      const navigate = useNavigate();
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    const obtenerRol = () => {

        switch (decodedToken.idRol) {
            case 1:
                return superAdminIcon;
            case 2:
                return adminIcon;
            case 3:
                return alternoIcon;
            default:
                return alternoIcon;
        }

    }

    const InicioRol = () => {
        const ruta = localStorage.getItem('principal') || '/';
        navigate(ruta);
    };



    return (
        <div className="relative flex w-64 min-h-screen  z-40">
            <div className="w-64 flex flex-col transition-all duration-1000 text-white flex-shrink-0 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center mt-3 justify-between py-3">
                    <div className="flex items-center shrink-0">
                        <a href="/dashboard">
                            <img src="/logoC.svg" alt="Logo" className="block w-auto h-9 ml-2" />
                        </a>
                    </div>
                    <div>
                        <h2 className='bg-[#39A900] mr-3 rounded-full px-2'>x</h2>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 pt-4 mt-7 space-y-7">
                    <div onClick={InicioRol} className='flex cursor-pointer hover:text-[#39A900] hover:translate-x-3 transition-transform duration-300 ease-in-out'>
                        <img src={Inicio} alt="" className='h-6 w-6 mr-3' />
                        <h3>Inicio</h3>
                    </div>
                    <div className='flex cursor-pointer hover:text-[#39A900]  hover:translate-x-3 transition-transform duration-300 ease-in-out'>
                        <img src={cultivaSena} alt="" className='h-6 w-7 mr-1' />
                        <h3>Ir a Cultiva<strong>Sena</strong></h3>
                    </div>
                    <div className='flex cursor-pointer hover:text-[#39A900]  hover:translate-x-3 transition-transform duration-300 ease-in-out'>
                        <img src={Estadisticas} alt="" className='h-6 w-7 mr-2' />
                        <h3 className='mt-1'>Estadísticas</h3>
                    </div>
                    <div className='flex border-b-[0.5px] pb-6 cursor-pointer hover:text-[#39A900]  hover:translate-x-3 transition-transform duration-300 ease-in-out'>
                        <img src={Reporte} alt="" className='h-8 w-8 mr-2' />
                        <h3 className='mt-1'>Reporte Actividades</h3>
                    </div>
                </div>

                {/* Settings */}
                <div className="flex items-center px-6 w-full cursor-pointer py-2 ">
                    <img className="rounded-md size-12" src={obtenerRol()} alt="Perfil" />
                    <div className="flex flex-col ml-3">
                        <span className="text-base font-bold">{decodedToken.nombre}</span>
                        <span>Ver perfil</span>
                    </div>
                </div>
                {/* <nav className="flex-1 px-6 pt-4 space-y-2">
                    <div className="px-2 space-y-2">
                        <div className="px-6 py-2 text-lg">Ajustes</div>
                        <div className='flex cursor-pointer'>
                            <img src={Inicio} alt="" className='h-6 w-7 mr-2' />
                            <h3>Inicio</h3>
                        </div>
                        <SidebarLink href="/accesibilidad" icon="/images/accesi.svg" label="Accesibilidad" />
                        <SidebarLink href="/centroAyuda" icon="/images/preg.svg" label="Centro de Ayuda" />
                    </div>
                </nav> */}

                {/* Profile */}
                <div className="mt-0 px-6 mb-10">
                    <div className="flex mt-10">
                        <CerrarSesion />
                    </div>
                </div>
            </div>
        </div>
    );
}
