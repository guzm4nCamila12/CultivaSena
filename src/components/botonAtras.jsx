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
    className="border border-gray-400 bg-white hover:bg-[#00304D] hover:text-white  top-0 right-0  md:rounded-3xl rounded-full p-1 lg:w-40 md:w-44 w-8 h-8 bg-gradient-to-t from-transparent to-[rgba(0,0,0,0.4)] font-bold text-[#00304D] transition-all"
    onClick={irAtras}
  >
    {mensaje}
  </button>
</div>
  )
}
