//Importacion necesaria de react
import React from 'react'
//importacion de icono propio
import TecnicoIcon from '../assets/icons/accesibilidad.svg'
import { useLocation } from 'react-router-dom';
import { useDriverTour } from "../hooks/useTourDriver";
import {
    fincaDriverSteps,
    zonasDriverSteps,
    actividadesDriverSteps,
    mostarInfoDriverSteps,
    sensoresDriverSteps,
    alternosDriverSteps,
    sensorAlternosDriverSteps,
    crearFincaSteps,
    editarFincaSteps,
    perfilUsuarioSteps,
    tranferirSteps,
    ReporteSteps,
    datosSensorSteps,
    usuariosSteps
} from '../utils/aplicationSteps';

//Funcion con boton de pqrs 
export default function BotonAsistente() {
  const { startTour } = useDriverTour();
  const location = useLocation();

  const handleStartTour = () => {
    localStorage.setItem("tour_usuario_visto", "false");

    setTimeout(() => {
      const vista = location.state?.vista ?? "";
      if (location.pathname.includes('/lista-fincas')) {
        startTour(fincaDriverSteps);
      } else if (location.pathname.includes('/zonas')) {
        const isReporte = vista === '/reporte';
        startTour(isReporte ? ReporteSteps : zonasDriverSteps);
      } else if (location.pathname.includes('/actividadesZonas')) {
        startTour(actividadesDriverSteps);
      } else if (location.pathname.includes('/activar-sensores')) {
        const isReporte = vista === '/sensores';
        startTour(isReporte ? ReporteSteps : sensoresDriverSteps);
      } else if (location.pathname.includes('/alternos')) {
        startTour(alternosDriverSteps);
      } else if (location.pathname.includes('/sensoresZonas')) {
        startTour(sensoresDriverSteps)
      } else if (location.pathname.includes('/agregar-finca')) {
        startTour(crearFincaSteps);
      } else if (location.pathname.includes('/editar-finca')) {
        startTour(editarFincaSteps)
      } else if (location.pathname.includes('/perfil-usuario')) {
        startTour(perfilUsuarioSteps)
      } else if (location.pathname.includes('/sensores-alterno')) {
        startTour(sensorAlternosDriverSteps)
      } else if (location.pathname.includes('/transferir-finca')) {
        startTour(tranferirSteps)
      } else if (location.pathname.includes('/datos-sensor')) {
        startTour(datosSensorSteps)
      } else if (location.pathname.includes('/inicio-SuperAdmin')) {
        startTour(usuariosSteps)
      }
      else {
        startTour(mostarInfoDriverSteps); // fallback
      }
    }, 300); // Ajusta el delay si es necesario
  };

  return (
    <div className="relative group">
      <button 
        onClick={handleStartTour} 
        className="flex justify-center p-3 items-center md:w-14 md:h-14 transition-transform hover:rotate-180 duration-300 rounded-full bg-[#00304D] fixed bottom-5 right-5 z-50"
      >
        <img src={TecnicoIcon} alt="" className="w-auto" />
      </button>
  
      {/* Tooltip animado */}
      <div className="fixed bottom-5 right-5 z-40 pointer-events-none">
        <div className="transform translate-x-0 opacity-0 group-hover:translate-x-[-40px] group-hover:opacity-100 transition-all duration-300 ease-out bg-[#00304D] text-white px-4 py-4 text-md font-bold rounded-3xl shadow-lg">
          <h3 className="font-semibold whitespace-nowrap">Iniciar tour en esta vista</h3>
        </div>
      </div>
    </div>
  );
  
}
