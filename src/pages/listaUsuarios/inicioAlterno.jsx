import React from 'react'
import Navbar from '../../components/navbar'
function inicioAlterno() {
    return (
        <div>
            <Navbar />
            <div className='flex flex-row justify-center '>

            inicioAlterno

            <button className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            Ver Sensores    
            </button>
            <button className="px-7 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            Ver Zonas    
            </button>

            </div>
        </div>
    )
}

export default inicioAlterno