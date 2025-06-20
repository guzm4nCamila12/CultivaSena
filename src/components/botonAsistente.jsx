//Importacion necesaria de react
import React from 'react'
//importacion de icono propio
import TecnicoIcon from '../assets/icons/IntercambioIcon.svg'
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
    <button onClick={handleStartTour} className=' md:w-14 md:h-14 p-1 transition-all transform hover:scale-105 duration-300 rounded-full bg-[#00304D] fixed bottom-5 right-5 z-50'>
      <img src={TecnicoIcon} alt="" className='md:w-11' />
    </button>
  )
}
