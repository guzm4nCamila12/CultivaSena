//importaciones necesarias de react
import React, { useState, useEffect } from 'react';
//componentes reutilizados
import OpcionTabla from "../assets/icons/opcionTabla.png";
import OpcionTarjeta from "../assets/icons/opcionTarjetas.png";

function Opcion({ onChangeVista, columnas, acciones, obtenerRol, setModalInsertarAbierto }) {
  // Inicializa 'vistaActiva' leyendo el valor desde localStorage, o por defecto 'tarjetas'
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem('vistaActiva') || 'tarjetas');

  // Cada vez que 'vistaActiva' cambie, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem('vistaActiva', vistaActiva);
  }, [vistaActiva]);

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
    onChangeVista(vista);
  };

  return (
    <div className='flex items-center'>
        <div className="flex w-28 rounded-full border-2 border-gray-200 overflow-hidden">
          <button
            className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tabla' ? 'bg-[#93A6B2]' : 'bg-white'}`}
            onClick={() => handleVistaChange('tabla')}
          >
            <img src={OpcionTabla} alt="Lista" />
          </button>
          <button
            className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tarjetas' ? 'bg-[#93A6B2]' : 'bg-white'}`}
            onClick={() => handleVistaChange('tarjetas')}
          >
            <img src={OpcionTarjeta} alt="Tarjetas" />
          </button>
        </div>
    </div>
  );
}

export default Opcion;
