import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//componentes reutilizados
import Gov from './gov';
import Inicio from '../assets/icons/Inicio.png';
//icons
import menu from "../assets/icons/menu.png";
import cultivaSena from "../assets/icons/cultiva.png";
//Cerrar sesión
import CerrarSesion from "./auth/logOut";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const idRol = Number(localStorage.getItem('rol'));

  const rol = () => {
    if (idRol === 1) return "¡Hola SuperAdmin!";
    if (idRol === 2) return "¡Hola Admin!";
    return "¡Hola Alterno!";
  };

  const InicioRol = () => {
    const ruta = localStorage.getItem('principal') || '/';
    navigate(ruta);
  };

  return (
    <div>
      <Gov />

      <nav
        className="relative bg-cover bg-center bg-no-repeat h-20 sm:h-32"
        style={{ backgroundImage: "url('/banner.png')" }}
      />

      <div className="bg-[#002A43] h-12 w-full z-50 px-4 flex items-center">
        <div className="container mx-auto py-1 flex flex-row items-center">
          <img
            src={Inicio}
            alt="Inicio"
            className="pr-7 cursor-pointer"
            onClick={InicioRol}
          />
          <h2 className="font-extrabold text-white md:text-2xl text-xl">
            {rol()}
          </h2>

          {/* --- WRAPPER RELATIVE para icono + menú --- */}
          <div className="ml-auto relative">
            <img
              src={menu}
              alt="Menu"
              className={`h-[0.95rem] cursor-pointer transition-transform duration-300 ease-in-out ${menuVisible ? 'rotate-90' : ''
                }`}
              onClick={() => setMenuVisible(!menuVisible)}
            />

            <div
              className={`absolute top-full mt-4 right-0 w-60 bg-[#002A43] p-3 rounded-xl shadow-lg z-50 transition-opacity duration-300 ease-in-out
                ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
              `}
            >
              {/* triángulo indicador */}
              <div
                className="absolute -top-2 right-4  w-0 h-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-[#00304D]"
              />

              <h3 className="w-full mb-2 text-white font-medium border-b-2 pb-1 pl-12 border-white">
                Menú Principal
              </h3>
              <div className="flex ml-3 pt-1 text-white">
                <img src={cultivaSena} alt="" className="w-5 h-5 mr-2" />
                <h4>Ir a <strong>CultivaSena</strong></h4>
              </div>
              <div className="flex rounded-3xl">
                <CerrarSesion />
              </div>
            </div>
          </div>
          {/* --- fin wrapper relative --- */}
        </div>
      </div>

      {menuVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuVisible(false)}
        />
      )}
    </div>
  );
}
