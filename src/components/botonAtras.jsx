import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from'react';
export default function BotonAtras () {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana
  const [mensaje, setMensaje] = useState('Tamaño grande'); // Valor inicial
  const navigate = useNavigate();

  

  const irAtras = () => {
    navigate(-1);
  }



  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth); 
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      setMensaje('<');
    } else {
      setMensaje('< Regresar');
    }
  }, [screenWidth]); 

  return (
<div className=" ml-auto mt-1 ">
  <button
    type="button"
    className="bg-[#FBD000] hover:bg-[#00304D] hover:text-white font-bold  top-0 right-0  md:rounded-3xl rounded-full p-1 lg:w-40 md:w-44 w-8 h-8 shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]"
    onClick={irAtras}
  >
    {mensaje}
  </button>
</div>
  )
}
