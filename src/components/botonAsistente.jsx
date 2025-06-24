//Importacion necesaria de react
import React from 'react'
import { useState } from 'react';
//importacion de icono propio
import TourIcon from '../assets/icons/guia.svg'
import TourAmarillo from '../assets/icons/recorrido.svg'
import cerrar from '../assets/icons/x.png';
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

  const [visible, setVisible] = useState(false);

  const handleHover = () => {
    if (!visible) setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };



  const handleStartTour = () => {
    localStorage.setItem("tour_usuario_visto", "false");

    setTimeout(() => {
      setVisible(false)
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
    <div className="relative">
      <button
        onMouseEnter={handleHover}
        className="flex justify-center p-3 items-center md:w-14 md:h-14 transition-transform hover:rotate-45 duration-300 rounded-full bg-[#00304D] fixed bottom-5 right-5 z-50"
      >
        <img src={visible ? TourAmarillo : TourIcon} alt="" className="w-auto " />
      </button>

      {visible && (
        <div className="fixed flex bottom-5 right-[60px] bg-white text-md rounded-3xl shadow-lg flex-col gap-4  opacity-0 scale-95 animate-[appear_0.3s_ease-out_forwards]">
          <div className='w-full rounded-tl-3xl items-center h-auto flex space-x-6 text-white'>
            <div className='bg-[#00304D] font-bold rounded-tl-3xl p-3 rounded-br-3xl'>
              <h3>¿No sabes que hacer aquí?</h3>
            </div>
            <div>
              <button onClick={handleClose} className='bg-[#39A900] font-bold hover:bg-[#005F00] px-2 py-2 mr-3 rounded-full shadow-xl'>
                <img src={cerrar} alt="" srcset="" />
              </button>
            </div>
          </div>
          <div className='w-full px-3 flex gap-3 flex-col mb-2'>
            <div className=''>
              <h3>Empezar un recorrido guiado</h3>
            </div>
            <div onClick={handleStartTour} className='bg-[#39A900] hover:bg-[#005F00] cursor-pointer font-bold shadow-xl text-white w-[60%] p-1 rounded-full flex justify-center items-center'>
              <button>Iniciar recorrido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
