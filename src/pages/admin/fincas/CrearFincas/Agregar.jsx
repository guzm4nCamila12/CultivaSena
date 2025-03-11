import React, { useState } from "react";
import Mapa from "../../../../components/Mapa";
import { insertarFinca } from "../../../../services/fincas/ApiFincas";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../../../components/navbar";
import userGray from "../../../../assets/icons/userGray.png"
import '@fontsource/work-sans'

const Agregar = () => {
  //estados del id del usuario, nombre de la finca y ubicación
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState({});
  const navigate = useNavigate();

  // Función para navegar a la página anterior
  const irAtras = () => {
    navigate(-1);
  };

  // Maneja el envío del formulario con validación
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !ubicacion.lat || !ubicacion.lng) {
      acctionSucessful.fire({
        icon: "error",
        title: "Debe ingresar un nombre y seleccionar una ubicación",
      });
      return;
    }

    const nuevaFinca = {
      idUsuario: Number(id),
      nombre,
      ubicacion,
    };

    try {
      const response = await insertarFinca(nuevaFinca);
      // Si la respuesta es válida, se maneja de forma exitosa


      irAtras();
    } catch (error) {
      acctionSucessful.fire({
        icon: "error",
        title: `Error: ${error.message}`,
      });
    }

  };
  return (
    <div>
      <Navbar></Navbar>
      <div style={{ fontFamily: "work sans" }} className="my-0 p-1 mb-auto rounded-3xl  
                                                          w-auto mx-10 sm:w-auto sm:mx-11 md:mx-16 lg:mx-16 2xl:mx-32">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative sm:m-1  sm:bg-white">


            <div className=" flex flex-wrap justify-center mt-[-20px] sm:mt-0">
              {/* Título centrado en móvil */}
              <div className="mb-2 ml-11 sm:ml-0 w-full sm:w-auto flex-grow self-center flex  bg-white ">
                <h2 className="text-2xl sm:text-3xl font-semibold">Agregar Finca</h2>
              </div>

              {/* Contenedor del input y botón */}
              <div className="sm:pl-2 pr-4 flex justify-center items-center order-0 flex-grow-[6] flex-shrink-0 self-center bg-[#EEEEEE] w-auto h-12 xl:h-[4.2rem] sm:rounded-full relative">
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-[80%] sm:w-full h-10 xl:h-14 rounded-full  focus:outline-none text-[14px] focus:ring-2 focus:ring-[#10314669] ml-5 sm:ml-0 pl-10 pr-36 sm:pl-12 sm:pr-48 "
                  placeholder="Ingrese el nombre"
                  autoComplete="off"
                  style={{
                    backgroundImage: `url(${userGray})`, // Ícono
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 10px center', // Ajuste de posición
                    backgroundSize: '20px', // Tamaño del ícono
                  }}
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 xl:h-16  mr-10 sm:mr-0 font-extrabold bg-[rgba(0,_158,_0,_1)] text-white text-[14px] sm:text-[18px] w-[8rem] sm:w-[14rem] rounded-full hover:bg-green-800 focus:outline-none"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
          <div className="relative  h-[60px] sm:h-0"></div>


          <div className="m-0 shadow-xl rounded-b-3xl">
            {/* Solo renderizamos el mapa si la ubicación no es null */}
            {ubicacion ? (
              <Mapa setUbicacion={setUbicacion} />
            ) : (
              <p className="text-gray-600">Cargando mapa...</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );



};

export default Agregar;