import React, { useState } from 'react';
import Gov from './gov';
import BotonAtras from './botonAtras';
import menu from "../assets/icons/menu.png";
import cultivaSena from "../assets/icons/cultiva.png";
//Importamos el componente que tiene la funcionalidad de cerrar sesion
import CerrarSesion from "./auth/logOut";

export default function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad de el menu lateral
  const idRol = Number(localStorage.getItem('rol'));
  // Función para mostrar el mensaje dependiendo del rol
  const rol = () => {
    if (idRol === 1) {
      return "¡Hola SuperAdmin!";
    } else if (idRol === 2) {
      return "¡Hola Admin!";
    } else {
      return "¡Hola Alterno!";
    }
  };

  return (
    <div>
      <Gov />
      <nav className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/navbarphoto.png')" }}>
        <div className="absolute inset-0 bg-[rgba(132,106,41,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent"></div>
        </div>
        <div className="relative flex justify-center items-center h-32">
          <img src="/logoC.svg" alt="Cultiva SENA" className="h-16 md:h-20" />
        </div>
      </nav>

      <div className='bg-[#002A43] h-12 w-full z-50 px-4'>
        <div className='container mx-auto py-1 flex flex-row items-center'>
          {/* Icono de menú con rotación condicional */}
          <img
            src={menu}
            alt="Menu"
            className={`h-3 pr-2 cursor-pointer transition-transform duration-300 ease-in-out ${menuVisible ? 'rotate-90 mt-2' : ''}`}
            onClick={() => setMenuVisible(!menuVisible)} // Toggle visibility del modal}
          />
          <h2 className='font-extrabold text-white md:text-2xl text-xl'>{rol()}</h2>
          <BotonAtras />
          {/* Menu lateral*/}
          <div
            className={`absolute mt-[172px] top-10 w-64 bg-[#002A43] p-4 rounded-xl shadow-lg z-50 transition-opacity duration-300 ease-in-out ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {/* Div con forma triangular*/}
            <div
              className="absolute -top-2 xl:left-4 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#00304D]">
            </div>
            <div>
              <h3 className='w-full flex mb-3 text-white font-medium  border-b-2 pb-2 pl-2 border-white'>Menú Principal</h3>
              <div className='flex ml-3 pt-2 text-white'>
                <img src={cultivaSena} alt="" className='w-5 h-5 mr-2' />
                <h4>Ir a CultivaSena</h4>
              </div>
              <div className='flex rounded-3xl mt-2'>
                {/*Llamamos el componente que tiene la funcionalidad de cerrar sesion */}
                <CerrarSesion />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Overlay oscuro que cubre toda la página cuando el menú está visible */}
      {menuVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuVisible(false)} // Cierra el menú al hacer clic fuera de él
        ></div>
      )}
    </div>
  );
}
