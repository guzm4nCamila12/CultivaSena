import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/usuarios/ApiUsuarios"
import Gov from '../../components/gov';
import phoneGray from "../../assets/icons/phoneGray.png"
import passwordGray from "../../assets/icons/passwordGray.svg"
import openEyeGray from "../../assets/icons/openEyeGray.png"
import closedEyeGray from "../../assets/icons/ClosedEyeGray.png"
import Swal from "sweetalert2";
import AtrasIcon from "../../assets/icons/Vector(1).png"

const Login = () => {
  // Estados para almacenar el valor del telefono y la contraseña
  const [telefono, setTelefono] = useState("");  // Estado para el correo electrónico
  const [clave, setClave] = useState("");  // Estado para la contraseña
  const [mostrarClave, setMostrarClave] = useState(false);  // Estado para alternar la visibilidad de la contraseña
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Iniciamos con el tamaño actual de la ventana


  // Función que maneja el envío del formulario de inicio de sesión
  const handleSubmit = (e) => {
    e.preventDefault();

    const inicioUsuario = {
      telefono, clave
    };
    // Llamada asincrónica a la API para obtener el usuario
    login(inicioUsuario)
      .then((data) => {
        // Guardar un dato en el localStorage
        localStorage.setItem('rol', data.id_rol);

        // acctionSucessful.fire({
        //   icon: "success",
        //   title: `Bienvenido ${data.nombre}`
        // });
        // Lógica de navegación después de que se haya actualizado el estado
        if (data.id_rol === 1) {
          navigate("/inicio-SuperAdmin");
        } else if (data.id_rol === 2) {
          navigate(`/lista-fincas/${data.id}`);
        } else if (data.id_rol === 3) {
          navigate(`/sensores-alterno/${data.id_finca}/${data.id}`);
        }

      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        }) // Almacena el mensaje de error en el estado error para mostrarlo al usuario
        // Manejo de errores si la API falla
      });
  };


  //inicializa el estado con el tamaño actual del contenedor
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Alterna entre mostrar y ocultar la contraseña
  const handleToggle = () => {
    setMostrarClave(!mostrarClave);
  };
  const irAtras=()=>{
    navigate(-1);
  }
  const responsive = () => {
    if (screenWidth > 768) {
      let bloque = <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fondoC.svg')" }}
      >
        <div className="absolute w-full h-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        > </div>
        <div className="flex flex-col items-center z-10 gap-16 px-5">
        <button className='absolute p-2 rounded-full w-7   text-white top-5 left-4 bg-white'onClick={irAtras}><img src={AtrasIcon} alt="" className='w-2 m-auto' /></button>

          <img src="logoC.svg" alt="" className="h-24 md:h-[120px] transition-all" />
          <div className="py-4 px-2 shadow-md w-full max-w-sm rounded-3xl backdrop-blur-sm border border-gray-500"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <h2 className="text-3xl text-center mb-3 text-white drop-shadow-xl font-bold">Bienvenidos</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Número de teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                style={{
                  backgroundImage: `url(${phoneGray})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 12px center',
                }}
              />
              <div className="relative">
                <input
                  type={mostrarClave ? "text" : "password"}
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                  style={{
                    backgroundImage: `url(${passwordGray})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center',
                  }}
                />
                <div
                  onClick={handleToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  <img
                    src={mostrarClave ? openEyeGray : closedEyeGray}
                    alt="Toggle Visibility"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-[#39A900] hover:bg-[#005F00] text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 rounded-3xl font-bold drop-shadow-xl"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
          <img src="sena-logo.svg" alt="" />
        </div>
      </div>
      return bloque;

    } else {
      let bloque =
        <div
          className="min-h-screen  bg-black">



          <div className="flex justify-center items-center min-h-[45rem] bg-cover bg-center relative"
            style={{ backgroundImage: "url('/cultivaBanner2.png')" }} >
            <div className="absolute w-full h-full backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            > </div>
            
          <button className='absolute p-2 rounded-full w-7   text-white top-5 left-2 bg-white'onClick={irAtras}><img src={AtrasIcon} alt="" className='w-2 m-auto' /></button>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black to-transparent  font-sans text-center">

          <div className="absolute bottom-64 m-auto w-full p-2 z-20 gap-5 ">
              <img src="logoC.svg" alt="" className="h-[100px] m-auto mb-3 transition-all" />
              <div className="py-4 px-2 mb-2 m-auto shadow-md w-full max-w-sm rounded-3xl backdrop-blur-sm border  border-gray-500"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              >
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
                      backgroundImage: `url(${phoneGray})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'left 12px center',
                    }}
                  />
                  <div className="relative">
                    <input
                      type={mostrarClave ? "text" : "password"}
                      placeholder="Contraseña"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      required
                      className="w-full p-3 pl-12 pr-12 border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                      style={{
                        backgroundImage: `url(${passwordGray})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'left 12px center',
                      }}
                    />
                    <div
                      onClick={handleToggle}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                      <img
                        src={mostrarClave ? openEyeGray : closedEyeGray}
                        alt="Toggle Visibility"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-[#39A900] hover:bg-[#005F00] shadow-black shadow-sm text-white hover:bg-white-600 focus:outline-none focus:ring-2 focus:ring-white-500 text-2xl rounded-3xl font-bold drop-shadow-xl"
                  >
                    Iniciar Sesión
                  </button>
                </form>

              </div>
              <a href="#" className='m-auto text-white'>¿Olvidó su contraseña?</a>

            </div>
              <img src="sena-logo.svg" alt="" className='w-14 absolute bottom-7 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
          </div>
        </div>
      return bloque;

    }

  }

  return (
    <div>
      <Gov />
      {responsive()}
    </div>
  );
};

export default Login;