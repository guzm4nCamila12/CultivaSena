// components/BotonAtras.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import atras from "../assets/icons/Volver.png";

export default function BotonAtras() {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtiene la ruta principal guardada en localStorage
  const principal = localStorage.getItem("principal");

  // Deshabilita si la ruta actual es exactamente la principal
  const disableBack = location.pathname === principal;

  const irAtras = () => {
    if (!disableBack) navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={irAtras}
      disabled={disableBack}
      className={`
        font-extrabold text-lg text-[#00304D]
        md:rounded-3xl rounded-full lg:w-10 md:w-6 pt-2
        ${disableBack
          ? "opacity-50 cursor-not-allowed"
          : "hover:cursor-pointer"}
      `}
    >
      <img src={atras} alt="btnRegresar" />
    </button>
  );
}
