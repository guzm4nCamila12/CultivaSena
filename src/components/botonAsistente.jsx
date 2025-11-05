//Importacion necesaria de react
import { useState } from 'react';
//importacion de icono propio
import TourIcon from '../assets/icons/guia.svg'
import TourAmarillo from '../assets/icons/recorrido.svg'
import cerrar from '../assets/icons/x.png';
import { useLocation } from 'react-router-dom';
import { useDriverTour } from "../hooks/useTourDriver";
import {
  fincaDriverSteps, zonasDriverSteps, actividadesDriverSteps, mostarInfoDriverSteps, sensoresDriverSteps, alternosDriverSteps,
  sensorAlternosDriverSteps, crearFincaSteps, editarFincaSteps, perfilUsuarioSteps, tranferirSteps, ReporteSteps, datosSensorSteps,
  usuariosSteps, zonasAlternosDriverSteps
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
      setVisible(false);

      const vista = location.state?.vista ?? "";
      const path = location.pathname;
      const alternarFlag = localStorage.getItem('Alternar') === 'true';

      let sensoresAlternoSteps;

      // Determinar los pasos para sensores alterno
      if (vista === '/estadistica' || vista === '/reporte' || vista === '/sensores') {
        sensoresAlternoSteps = ReporteSteps;
      } else if (alternarFlag) {
        sensoresAlternoSteps = sensorAlternosDriverSteps;
      } else {
        sensoresAlternoSteps = zonasAlternosDriverSteps;
      }

      const routeMappings = [
        { match: '/lista-fincas', steps: fincaDriverSteps },
        { match: '/zonas', steps: vista === '/reporte' ? ReporteSteps : zonasDriverSteps },
        { match: '/actividadesZonas', steps: actividadesDriverSteps },
        { match: '/activar-sensores', steps: vista === '/estadistica' || vista === '/sensores' ? ReporteSteps : sensoresDriverSteps },
        { match: '/alternos', steps: alternosDriverSteps },
        { match: '/sensoresZonas', steps: sensoresDriverSteps },
        { match: '/agregar-finca', steps: crearFincaSteps },
        { match: '/editar-finca', steps: editarFincaSteps },
        { match: '/perfil-usuario', steps: perfilUsuarioSteps },
        { match: '/transferir-finca', steps: tranferirSteps },
        { match: '/datos-sensor', steps: datosSensorSteps },
        { match: '/inicio-SuperAdmin', steps: usuariosSteps },
        { match: '/sensores-alterno', steps: sensoresAlternoSteps }
      ];


      const matched = routeMappings.find(route => path.includes(route.match));
      const steps = matched?.steps || mostarInfoDriverSteps;

      if (!Array.isArray(steps) || steps.length === 0) {
        console.error('❌ No hay pasos definidos para esta ruta');
        return;
      }

      startTour(steps);
    }, 300);
  };



  return (
    <div className="relative z-30 hidden xl:block">
      <button
        onMouseEnter={handleHover}
        className="flex justify-center p-3 items-center w-14 h-14 md:w-15 md:h-15 rounded-full bg-[#00304D] fixed bottom-5 right-5 z-10"
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
                <img src={cerrar} alt="" />
              </button>
            </div>
          </div>
          <div className='w-full px-3 flex gap-3 flex-col mb-2'>
            <div className=''>
              <h3>Empezar un recorrido guiado</h3>
            </div>
            <button onClick={handleStartTour} className='bg-[#39A900] hover:bg-[#005F00] cursor-pointer font-bold shadow-xl text-white w-[60%] p-1 rounded-full flex justify-center items-center'>
              <button>Iniciar recorrido</button>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
