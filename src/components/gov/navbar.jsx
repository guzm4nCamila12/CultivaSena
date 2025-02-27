import React from 'react'
import Gov from './gov'
export default function navbar() {
  return (
    <div className='mb-5'><Gov />
    <nav className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/navbarphoto.png')" }}>
    <div className="absolute inset-0 bg-[rgba(132,106,41,0.5)]">
500
      <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent"></div>
      </div>
      <div className="relative flex justify-center items-center h-32">
        <img src="/logoC.svg" alt="Cultiva SENA" className="h-20" />
      </div>
      
    </nav>
    <div className='bg-[#00304D] h-12 w-full z-50 px-4' >
        <div className='container mx-auto py-1 flex items-center '>
            <img src="/Vector.png" alt="" className='h-3 pr-2'/>

        <h2 className='font-extrabold text-white text-2xl'>Hola, SuperAdmin!</h2>

        </div>
            
      </div>
    </div>
    
  )
}
