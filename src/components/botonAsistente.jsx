import React from 'react'
import TecnicoIcon from '../assets/icons/TechnicalSupport.png'

export default function BotonAsistente() {
  return (
   

        <button className=' md:w-14 md:h-14 p-1 transition-all rounded-full bg-[#00304D] fixed bottom-5 right-5'>
          <img src={TecnicoIcon} alt="" className='md:w-11'/>
          </button>
   
  )
}
