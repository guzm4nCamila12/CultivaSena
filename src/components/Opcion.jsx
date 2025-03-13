import React from 'react'
import OpcionTabla from "../assets/icons/OpcionTabla.png"
import OpcionTarjeta from "../assets/icons/OpcionTarjetas.png"

function Opcion() {
  return (
    <div className="flex items-center">
          <div className="flex w-28 rounded-full border-4 border-gray-200 overflow-hidden">
            {/* Sección de Lista - Activa */}
            <button className="flex-1 flex justify-center items-center p-2 bg-white">
              <img src={OpcionTabla} alt="Lista" />
            </button>
            {/* Sección de Tarjetas - Inactiva */}
            <button className="flex-1 flex justify-center items-center p-2 bg-[#93A6B2]">
              <img src={OpcionTarjeta} alt="Tarjetas" />
            </button>
          </div>
        </div>
  )
}

export default Opcion