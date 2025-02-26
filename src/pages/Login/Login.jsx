import React, { useState } from "react";  // Importación de React y useState para manejar el estado
import { useNavigate } from "react-router-dom";
import { login } from "../../services/usuarios/ApiUsuarios"
import Gov from '../../components/gov/gov';
import Swal from "sweetalert2";
import { acctionSucessful } from "../../components/alertSuccesful";

const Login = () => {
  // Estado para almacenar el valor del correo electrónico y la contraseña
  const [telefono, setTelefono] = useState("");  // Estado para el correo electrónico
  const [clave, setClave] = useState("");  // Estado para la contraseña
  const [mostrarClave, setMostrarClave] = useState(false);  // Estado para alternar la visibilidad de la contraseña
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Función que maneja el envío del formulario de inicio de sesión
  const handleSubmit = (e) => {
    e.preventDefault();

    const inicioUsuario = {
      telefono, clave
    };
    // Llamada asincrónica a la API para obtener el usuario
    login(inicioUsuario)
      .then((data) => {
        console.log(data);  // Actualiza el estado con los datos del usuario
        // Guardar un dato en el localStorage
        localStorage.setItem('rol', data.id_rol);

        acctionSucessful.fire({
          icon: "success",
          title: `Bienvenido ${data.nombre}`
        });
        // Lógica de navegación después de que se haya actualizado el estado
        if (data.id_rol === 1) {
          navigate("/inicio-SuperAdmin");
        } else if (data.id_rol === 2) {
          console.log("Admin");
          navigate(`/lista-fincas/${data.id}`);
        } else if (data.id_rol === 3) {
          console.log("Alterno");
          navigate(`/sensores-alterno/${data.id_finca}`);
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


    console.log("Formulario enviado");
  };

  // Alterna entre mostrar y ocultar la contraseña
  const handleToggle = () => {
    setMostrarClave(!mostrarClave);
  };

  return (
    <div>
      <Gov />
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fondoC.svg')" }}
      >
        <div className="absolute w-full h-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        ></div>

        <div className="flex flex-col items-center z-10 gap-16 px-5">
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
                  backgroundImage: "url('/phoneGrey.png')",  // Icono de teléfono a la izquierda
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 12px center',  // Ajusta la posición del icono dentro del campo
                }}
              />

              <div className="relative">
                <input
                  type={mostrarClave ? "text" : "password"}  // Alterna entre texto y contraseña
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  className="w-full p-3 pl-12 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white bg-transparent rounded-3xl text-white placeholder:text-white"
                  style={{
                    backgroundImage: "url('/Vector.svg')",  // Icono de teléfono a la izquierda
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center',  // Ajusta la posición del icono dentro del campo
                  }}
                />
                {/* Icono de ojo a la derecha */}
                <div
                  onClick={handleToggle} // Alterna el icono
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  <img
                    src={mostrarClave ? "/ojoA.png" : "/ClosedEye.png"}
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
    </div>
  );
};

export default Login;
