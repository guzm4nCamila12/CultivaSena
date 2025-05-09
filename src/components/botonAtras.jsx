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

  const logout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de login
    navigate('/login');
  };

  return (
    <div className=" ml-auto mt-1 ">
      <button
        type="button"
        onClick={irAtras}>
          
        {mensaje}
      </button>
    </div>
  )
}
