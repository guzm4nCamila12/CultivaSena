import React from 'react';
//Importaciones necesarias de react
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
//Componentes reutilizados
import Gov from '../../components/gov';

export default function Login() {
  //Iniciamos el estado con el ancho actual de la ventana del navegador
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana

  //Se ejecuta cuando la ventana cambia de tamaño
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth); //Actualizamos el ancho de la pantalla
    };
    //Para detectar el cambio de tamaño de la ventana
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //Funcion que retorna un bloque dependiendo del tamaño de la pantalla
  const si = () => {
    if (screenWidth > 768) {
      //Bloque para pantallas grandes
      let bloque = <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fondoC.svg')" }}
      >
        <img src="logoC.svg" alt="" className="h-12  transition-all absolute top-12 left-4" />
        <Link to={"/login"}>
          <button
            type="submit"
            className="w-40  h-8 absolute top-12 right-4  bg-[#39A900] hover:bg-[#005F00]  text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl">
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

      return bloque
    } else {
      //Bloque para pantallas pequeñas
      let bloque = <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/cultivaBanner2.png')" }}
      >
        <img src="logoC.svg" alt="" className="h-12  transition-all absolute top-12 left-4" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent opacity-80 font-sans text-center">
        </div>
        <div className='bottom-20 absolute  text-center text-white'>
          <h1 className='font-extrabold mt-14 text-4xl  '>Bienvenido</h1>
          <p className='font-light text-sm mb-5 mt-4 '>Innovamos juntos para un <br /><strong className='font-extrabold'>campo más fuerte y tecnológico.</strong> <br />
            ¡El futuro del agro comienza hoy!</p>
          <Link to={"/login"}>
            <button
              type="submit"
              className="w-40 mb-6 h-8  bg-[#39A900] hover:bg-[#005F00]  text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
      return bloque
    }
  }

  return (
    <div>
      <Gov />
      {si()} {/*Llama la funcion que devuelve un bloque */}
    </div>
  );
}