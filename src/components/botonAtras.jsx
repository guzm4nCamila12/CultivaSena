import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogOut from './auth/logOut'
import logOutIcon from '../assets/icons/log_out.png'
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


  const logout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
  
    // Redirigir al usuario a la página de login
    navigate('/login');
  };

  return (
    <div className=" ml-auto mt-1 ">
      {/* <button
      type='button'
      onClick={logout}
      className='bg-red-600 mr-2 hover:bg-red-700 font-extrabold text-lg text-[#00304D]  p-2   md:rounded-3xl rounded-full w-9'
      >
        <img src={logOutIcon} alt="" />

      </button> */}
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
