//importaciones necesarias de react
import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cultivaBanner2 from '../../assets/img/cultivaBanner2.png'
import fondoC from '../../assets/img/fondoC.svg'
import logoC from '../../assets/img/logoC.svg'
import logoSena from '../../assets/img/sena-logo.svg'

//componentes reutilizados
// import Gov from '../../components/gov';

export default function Login() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana

  useEffect(() => {
    // Función para actualizar el ancho de la ventana cuando cambie el tamaño
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    // Agregamos un 'event listener' para detectar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);
    // Limpiamos el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Esta función renderiza el contenido dependiendo del tamaño de la pantalla
  const responsive = () => {
    if (screenWidth > 768) {
      let bloque = <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${fondoC}` }}>
        <img src={logoC} alt="" className="h-12  transition-all absolute top-12 left-4" />
        <Link to={"/login"}>
          <button
            type="submit"
            className="w-40  h-8 absolute top-12 right-4  bg-[#39A900] hover:bg-[#005F00]  text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl">
            Iniciar sesión
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
      // Si la pantalla es más pequeña
      let bloque = <div
        className="min-h-screen  bg-black">
        <div className='flex justify-center   items-center min-h-screen bg-no-repeat bg-cover bg-center relative' style={{ backgroundImage: `url(${cultivaBanner2})` }}>
          <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black to-transparent  font-sans text-center">
            <div className='bottom-0 absolute w-full px-5 text-center text-white'>
              <h1 className='font-extrabold mt-16 text-[40px]   '>Bienvenido</h1>
              <p className='font-light text-[18px] mb-5  leading-5'>Innovamos juntos para un <br /><strong className='font-extrabold'>campo más fuerte y tecnológico.</strong> <br />
                ¡El futuro del agro comienza hoy!</p>
              <Link to={"/login"}>
                <button
                  type="submit"
                  className="w-full h-[45px] mb-2  bg-[#39A900] hover:bg-[#005F00]  text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-black text-2xl drop-shadow-xl">
                  Iniciar sesión
                </button>
              </Link>
              <p className='font-light text-[17px]   '>¿Aún no tiene una cuenta?, <a href="#" className='text-[#39A900] font-extrabold'>Registrese</a></p>
              <img src={logoSena} alt="" className='m-auto w-14 mb-5 mt-5' />
            </div>
          </div>
        </div>
      </div>
      return bloque
    }
  }

  return (
    <div>
      {/* <Gov /> */}
      {responsive()}
    </div>
  );
}