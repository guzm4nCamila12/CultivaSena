//Importacion necesaria de react
import React from 'react'
//importacion de icono propio
import TecnicoIcon from '../assets/icons/TechnicalSupport.png'

//Funcion con boton de pqrs 
export default function BotonAsistente() {
  return (
    <button className=' md:w-14 md:h-14 p-1 transition-all transform hover:scale-105 duration-300 rounded-full bg-[#00304D] fixed bottom-5 right-5 z-50'>
      <img src={TecnicoIcon} alt="" className='md:w-11' />
    </button>
  )
}
