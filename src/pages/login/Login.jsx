//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//componentes reutilizados
import Gov from '../../components/gov';
import { acctionSucessful } from "../../components/alertSuccesful";
//iconos de input
import {volver,telefonoGris,claveGris,verClave,noVerClave} from "../../assets/icons/IconsExportation"
//img alerta
import welcomeIcon from "../../assets/img/inicioSesion.png";
import alerta from '../../assets/img/alerta.png'
import { validarTelefono } from "../../utils/validaciones";
//endpoints para consumir api
import { login } from "../../services/usuarios/ApiUsuarios";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const navigate = useNavigate();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana
  // Función que maneja el envío del formulario de inicio de sesión

  const handleSubmit = (e) => {
    e.preventDefault();
    const inicioUsuario = { telefono, clave };
    if(!telefono && !clave){
      acctionSucessful.fire({
        imageUrl: alerta,
        imageAlt: "Icono alerta",
        title: "Todos los campos son obligatorios"
      })
      return
    }
    if(!validarTelefono(telefono))return
    
    if(!clave){
      acctionSucessful.fire({
        imageUrl: alerta,
        imageAlt: "Icono alerta",
        title: '¡Por favor, ingrese su contraseña!'
      })
      return
    }

    login(inicioUsuario)
      .then((data) => {
        const user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', user.id_rol);

        // Determinar y guardar ruta principal según el rol
        let rutaPrincipal;
        if (user.id_rol === 1) {
          rutaPrincipal = "/inicio-SuperAdmin";
        } else if (user.id_rol === 2) {
          rutaPrincipal = `/lista-fincas/${user.id}`;
        } else {
          rutaPrincipal = `/sensores-alterno/${user.id_finca}/${user.id}`;
        }
        localStorage.setItem('principal', rutaPrincipal);

        acctionSucessful.fire({
          imageUrl: welcomeIcon,
          imageAlt: 'Icono personalizado',
          title: `Bienvenido(a) ${user.nombre}`
        });

        // Navegar siempre a la ruta principal guardada
        navigate(rutaPrincipal, { state: { fromLogin: true } });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);

        // Manejo de errores si la API falla
        acctionSucessful.fire({
          imageUrl: alerta,
          title: "¡Usuario no encontrado!"
        })

      });
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => setMostrarClave(!mostrarClave);
  const irAtras = () => navigate("/");


  //Dependiendo de el tamaño de la pantalla se utiliza una interfaz u otra.
  const responsive = () => {
    //si el tamaño de la pantalla es mayor a 768px se muestra una interfaz
    if (screenWidth > 768) {
      let bloque = <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fondoC.svg')" }}>
        <div className="absolute w-full h-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
        </div>
        <div className="flex flex-col items-center z-10 gap-16 px-5">
          <button className='absolute p-2 rounded-full w-7   text-white top-5 left-4 bg-white' onClick={irAtras}><img src={volver} alt="" className='w-2 m-auto' /></button>
          <img src="logoC.svg" alt="" className="h-24 md:h-[120px] transition-all" />
          <div className="py-4 px-5 shadow-[0_0_60px_#fff] w-[640px] max-w-lg rounded-3xl backdrop-blur-sm border border-gray-500"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="text-white font-semibold text-lg mt-5">Número de telefono</h3>
              <input
                type="text"
                placeholder="Ingrese su número de teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                style={{
                  backgroundImage: `url(${telefonoGris})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 12px center',
                  backgroundSize: '20px 20px'
                }} />
              <div className="relative pb-3">
                <h3 className="text-white font-semibold text-lg pb-2">Contraseña</h3>
                <input
                  type={mostrarClave ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                  style={{
                    backgroundImage: `url(${claveGris})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center',
                    backgroundSize: '20px 20px',
                  }} />
                <div
                  onClick={handleToggle}
                  className="absolute right-3 mt-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <img
                    src={mostrarClave ? verClave : noVerClave} alt="Toggle Visibility" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-[#39A900] hover:bg-[#005F00] text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl">
                Iniciar sesión
              </button>
            </form>
          </div>
          <img src="sena-logo.svg" alt="" />
        </div>
      </div>
      return bloque;
    } else {
      //si el tamaño de la pantalla es menor a 768px se muestra otra interfaz
      let bloque =
        <div
          className="min-h-screen  bg-black">
          <div className="flex justify-center items-center min-h-[45rem] bg-cover bg-center relative"
            style={{ backgroundImage: "url('/cultivaBanner2.png')" }} >
            <div className="absolute w-full h-full backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
              <button className='absolute p-2 rounded-full w-7   text-white top-5 left-2 bg-white' onClick={irAtras}><img src={volver} alt="" className='w-2 m-auto' /></button>
              <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black to-transparent  font-sans text-center">
                <div className="absolute bottom-44 m-auto w-full p-2 z-20 gap-5 ">
                  <img src="logoC.svg" alt="" className="h-[100px] m-auto mb-3 transition-all" />
                  <div className="py-4 px-2 mb-2 m-auto shadow-md w-full max-w-sm rounded-3xl backdrop-blur-sm border  border-gray-500"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
                    <h2 className="text-[35px] text-center mb-3 text-white drop-shadow-xl font-bold">Bienvenidos</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Número de teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        className="w-full p-3 pl-12 pr-12 border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                        style={{
                          backgroundImage: `url(${telefonoGris})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'left 12px center',
                        }} />
                      <div className="relative">
                        <input
                          type={mostrarClave ? "text" : "password"}
                          placeholder="Contraseña"
                          value={clave}
                          onChange={(e) => setClave(e.target.value)}
                          required
                          className="w-full p-3 pl-12 pr-12 border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                          style={{
                            backgroundImage: `url(${claveGris})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 12px center',
                          }} />
                        <div
                          onClick={handleToggle}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                          <img
                            src={mostrarClave ? verClave : noVerClave}
                            alt="Toggle Visibility" />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full p-2 bg-[#39A900] hover:bg-[#005F00] shadow-black shadow-sm text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 text-2xl rounded-3xl font-bold drop-shadow-xl">
                        Iniciar Sesión
                      </button>
                    </form>
                  </div>
                  <a  className='m-auto text-white'>¿Olvidó su contraseña?</a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center py-4">

            <img src="sena-logo.svg" alt="" className='static m-auto w-16 ' />
          </div>

        </div>
      return bloque;
    }
  }

  //se llama el bloque de codigo que retorna la vista dependiendo del tamaño de la pantalla
  return (
    <div>
      <Gov />
      {responsive()}
    </div>
  );
};

export default Login;