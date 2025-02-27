import React from 'react';
import Gov from '../../components/gov/gov';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div>
      <Gov />
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fondoC.svg')" }}
      >
        <img src="logoC.svg" alt="" className="h-12  transition-all absolute top-12 left-4" />
        <Link to={"/login"}>
        <button
          type="submit"
          className="w-40  h-8 absolute top-12 right-4  bg-[#39A900]  text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl"
        >
          Iniciar Sesión
        </button>
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent opacity-80 font-sans text-center">

        

        </div>
        <div className='bottom-20  absolute text-center text-white'>

        <h1 className='font-extrabold mt-14 text-5xl  '>Bienvenido</h1>
        <p className='font-light text-xl mt-4'>Innovamos juntos para un <strong className='font-extrabold'>campo más fuerte y tecnológico.</strong> <br />
        ¡El futuro del agro comienza hoy!</p>
        </div>
      </div>
    </div>
  );
}
