import React from 'react'
import imagenError from '../../assets/img/imagenError404.svg'
import { useNavigate } from 'react-router-dom'

export default function Error404() {

    const navigate = useNavigate();
    return (
        <div
            className='bg-white flex h-screen flex-col justify-center items-center bg-no-repeat bg-right-bottom '
            style={{ backgroundImage: `url(${imagenError})` }}
        >
            <p className='text-[200px] font-black text-black'>404</p>
            <p className='text-[50px] font-bold text-black'>¡Ups, parece que algo salió mal!</p>
            <p className='text-black text-[25px]'>No encontramos la pagina que estás buscando</p>
            <button onClick={() => navigate('/principal')}
             className='bg-[#34a900] border text-white hover:text-white hover:scale-95 transition-all ease-in-out duration-300 mt-5 p-3 rounded-full'>Ir al inicio</button>
        </div>
    )
}
