// src/components/Navbar.jsx
import React, { useState } from 'react';
import Gov from './gov';
import MenuLateral from './menuLateral/MenuLateral';
import CerrarSesion from './auth/logOut';
import menuIcon from '../assets/icons/menu.png';
import banner from '../assets/img/banner.png'

export default function Navbar() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const rol = () => {
    const idRol = Number(localStorage.getItem('rol'));
    if (idRol === 1) return '¡Hola SuperAdmin!';
    if (idRol === 2) return '¡Hola Admin!';
    return '¡Hola Alterno!';
  };

  const openLogoutModal = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  return (
    <div className="relative">
      <Gov />

      <nav
        className="relative bg-cover bg-center bg-no-repeat h-20 sm:h-32"
        style={{ backgroundImage: `url(${banner})` }}
      />

      <div className="bg-[#002A43] h-12 w-full z-50">
        <div className="px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 h-full flex items-center relative">
          <button
            onClick={() => setMenuVisible(v => !v)}
            className="mr-4 focus:outline-none"
            aria-label="Abrir menú lateral"
          >
            <img
              src={menuIcon}
              alt="Icono de menú"
              className="cursor-pointer"
            />
          </button>

          <h2 className="font-extrabold text-white text-2xl">{rol()}</h2>

          <div
            className={`fixed top-0 left-0 h-screen w-64 bg-[#002A43] transition-transform duration-300 ease-in-out transform z-50 ${menuVisible ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <MenuLateral
              isOpen={menuVisible}
              onLogoutClick={openLogoutModal}
              onCloseMenu={() => setMenuVisible(false)}
            />

          </div>
        </div>
      </div>

      {menuVisible && (
        <button
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setMenuVisible(false)}
        />
      )}

      {logoutModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CerrarSesion onClose={closeLogoutModal} />
        </div>
      )}
    </div>
  );
}