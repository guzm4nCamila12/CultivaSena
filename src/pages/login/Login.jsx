import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";

// componentes reutilizados
import Gov from '../../components/gov';
import { acctionSucessful } from "../../components/alertSuccesful";
import { volver, telefonoGris, claveGris, verClave, noVerClave } from "../../assets/icons/IconsExportation";
import welcomeIcon from "../../assets/img/inicioSesion.png";
import alerta from '../../assets/img/alerta.png';
import { validarTelefono } from "../../utils/validaciones";
import { login } from "../../services/usuarios/ApiUsuarios";
import cultivaBanner2 from '../../assets/img/cultivaBanner2.png'
import fondoC from '../../assets/img/fondoC.svg'
import logoC from '../../assets/img/logoC.svg'
import logoSena from '../../assets/img/sena-logo.svg'
import { useLogin } from "../../hooks/useLogin";
const Login = () => {

  const [mostrarClave, setMostrarClave] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const [ usuario, handleChange, inicioSesion, logout ] = useLogin();

  // limpiar token si existe
  useEffect(() => {
    logout()
  }, []);

  


  // manejar redimensionamiento
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleToggle = () => setMostrarClave(!mostrarClave);
  const irAtras = () => navigate("/");

  const responsive = () => {
    if (screenWidth > 768) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${fondoC}` }}>
          <div className="absolute w-full h-full backdrop-blur-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} />
          <div className="flex flex-col items-center z-10 gap-16 px-5">
            <button className='absolute p-2 rounded-full w-7 text-white top-5 left-4 bg-white' onClick={irAtras}><img src={volver} alt="" className='w-2 m-auto' /></button>
            <img src={logoC} alt="Logo" className="h-24 md:h-[120px] transition-all" />
            <div className="py-4 px-5 shadow-[0_0_60px_#fff] w-[640px] max-w-lg rounded-3xl backdrop-blur-sm border border-gray-500" style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
              <form onSubmit={inicioSesion} className="space-y-3">
                <div id="input-telefono">
                <h3 className="text-white font-semibold text-lg mt-5">Número de telefono</h3>
                <input
                  type="text"
                  name="telefono"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ingrese su número de teléfono"
                  value={usuario.telefono}
                  onChange={(e) => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) handleChange(e); }}
                  className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                  style={{ backgroundImage: `url(${telefonoGris})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center', backgroundSize: '20px 20px' }}
                />
                </div>
                <div className="relative pb-3">
                  <h3 className="text-white font-semibold text-lg pb-2">Contraseña</h3>
                  <input
                    id="input-clave"
                    name="clave"
                    type={mostrarClave ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    value={usuario.clave}
                    onChange={handleChange}
                    className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                    style={{ backgroundImage: `url(${claveGris})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center', backgroundSize: '20px 20px' }}
                  />
                  <div onClick={handleToggle} className="absolute right-3 mt-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <img src={mostrarClave ? verClave : noVerClave} alt="Toggle Visibility" />
                  </div>
                </div>
                <button
                  id="btn-login"
                  type="submit"
                  className="w-full p-3 bg-[#39A900] hover:bg-[#005F00] text-white focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold text-xl drop-shadow-xl"
                >
                  Iniciar sesión
                </button>
              </form>
            </div>
            <img src={logoSena} alt="Sena Logo" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-black">
          <div className="flex justify-center items-center min-h-[45rem] bg-cover bg-center relative" style={{ backgroundImage: `url(${cultivaBanner2})` }}>  
            <div className="absolute w-full h-full backdrop-blur-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
              <button className='absolute p-2 rounded-full w-7 text-white top-5 left-2 bg-white' onClick={irAtras}><img src={volver} alt="" className='w-2 m-auto' /></button>
              <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black to-transparent font-sans text-center">
                <div className="absolute bottom-44 m-auto w-full p-2 z-20 gap-5 ">
                  <img src={logoC} alt="Logo" className="h-[100px] m-auto mb-3 transition-all" />
                  <div className="py-4 px-2 mb-2 m-auto shadow-md w-full max-w-sm rounded-3xl backdrop-blur-sm border border-gray-500" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
                    <h2 className="text-[35px] text-center mb-3 text-white drop-shadow-xl font-bold">Bienvenidos</h2>
                    <form onSubmit={inicioSesion} className="space-y-3">
                      <input
                        id="input-telefono"
                        type="text"
                        name="telefono"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Número de teléfono"
                        value={usuario.telefono}
                        onChange={(e) => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) handleChange(e); }}
                        required
                        className="w-full p-3 pl-12 pr-12 border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                        style={{ backgroundImage: `url(${telefonoGris})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center' }}
                      />
                      <div className="relative">
                        <input
                          id="input-clave"
                          type={mostrarClave ? 'text' : 'password'}
                          name="clave"
                          placeholder="Contraseña"
                          value={usuario.clave}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-12 pr-12 border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                          style={{ backgroundImage: `url(${claveGris})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center' }}
                        />
                        <div onClick={handleToggle} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                          <img src={mostrarClave ? verClave : noVerClave} alt="Toggle Visibility" />
                        </div>
                      </div>
                      <button
                        id="btn-login"
                        type="submit"
                        className="w-full p-2 bg-[#39A900] hover:bg-[#005F00] shadow-black shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white-500 text-2xl rounded-3xl font-bold drop-shadow-xl"
                      >
                        Iniciar sesión
                      </button>
                    </form>
                  </div>
                  <a className='m-auto text-white'>¿Olvidó su contraseña?</a>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center py-4">
              <img src={logoSena} alt="Sena Logo" className='static m-auto w-16' />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Gov />
      {responsive()}
    </div>
  );
};

export default Login;
