import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function BotonAtras() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana
  const [mensaje, setMensaje] = useState('Regresar'); // Valor inicial
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
      setMensaje('Regresar');
    }
  }, [screenWidth]);

  return (
    <div className=" ml-auto mt-1 ">
      <button
        type="button"
        className="bg-[#FBD000] hover:bg-[#BE9E00] font-extrabold text-lg text-[#00304D] top-0 right-0  md:rounded-3xl rounded-full lg:w-40 md:w-44 w-8 h-8"
        onClick={irAtras}
      >
        {mensaje}
      </button>
    </div>
  )
}
