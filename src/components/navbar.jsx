import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//componentes reutilizados
import Gov from './gov';
import Inicio from '../assets/icons/Inicio.png';
//icons
import menu from "../assets/icons/menu.png";
import cultivaSena from "../assets/icons/cultivaSena.png";
//Cerrar sesión
import CerrarSesion from "./auth/logOut";
import MenuLateral from "../components/menuLateral/MenuLateral"

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

      <div className="bg-[#002A43] h-12 w-full z-50 flex items-center">
        <div className="container py-1 flex flex-row items-center relative">
          {/* Menú lateral visible a la izquierda */}
          <div
            className={`fixed top-0 left-0 h-screen w-64 z-50 bg-[#002A43] transition-transform duration-300 ease-in-out transform ${menuVisible ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <MenuLateral />
          </div>

          {/* Botón del menú */}
          <img
            src={menu}
            alt="Menu"
            className={`mr-5 ml-[138px] cursor-pointer`}
            onClick={() => setMenuVisible(!menuVisible)}
          />

          {/* Título de rol */}
          <h2 className="font-extrabold text-white md:text-2xl text-xl">
            {rol()}
          </h2>

          {/* Botón de Inicio a la derecha */}
          <div className="ml-auto">
            <img
              src={Inicio}
              alt="Inicio"
              className="pr-7 cursor-pointer"
              onClick={InicioRol}
            />
          </div>
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
