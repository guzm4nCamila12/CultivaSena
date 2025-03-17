import React, { useState, useEffect } from 'react'; // Asegúrate de importar 'useEffect'
import OpcionTabla from "../assets/icons/OpcionTabla.png";
import OpcionTarjeta from "../assets/icons/OpcionTarjetas.png";
import Tabla from './Tabla'; // Asegúrate de que la ruta esté bien
import UserCards from './UseCards'; // Asegúrate de que la ruta esté bien
import { getUsuarios } from "../services/usuarios/ApiUsuarios"; // Asegúrate de que la ruta y el método estén bien


function Opcion({vistaActivada, ...props}) {
    const [vistaActiva, setVistaActiva] = useState('tabla');
    const [usuarios, setUsuarios] = useState([]);
  
   console.log('props:', props);

      
  
    const handleVistaChange = (vista) => {
      setVistaActiva(vista);
    };
  
    return (
      <div>
       
        <div className="flex justify-end  mb-4 ">
          <div className="flex w-28 rounded-full border-4 border-gray-200 overflow-hidden">
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tabla' ? 'bg-[#93A6B2]' : 'bg-white' }`}
              onClick={() => handleVistaChange('tabla')}
            >
              <img src={OpcionTabla} alt="Lista" />
            </button>
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tarjetas' ? 'bg-[#93A6B2]' : 'bg-white' }`}
              onClick={() => handleVistaChange('tarjetas')}
            >
              <img src={OpcionTarjeta} alt="Tarjetas" />
            </button>
          </div>
        </div>
  
        {/* Renderizar Tabla o UserCards dependiendo de la vista activa */}
        {vistaActiva === 'tabla' ? (
          <Tabla

          {...props}
        />
        
        ) : (
            <UserCards
            {...props}
          />
          
        )}
      </div>
    );
  }
  
export default Opcion;
