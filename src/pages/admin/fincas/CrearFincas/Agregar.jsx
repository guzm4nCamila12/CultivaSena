import React, { useState } from "react";
import Mapa from "../../../../components/Mapa";
import { insertarFinca } from "../../../../services/fincas/ApiFincas";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../../../components/navbar";
import userGray from "../../../../assets/icons/userGray.png"
import usuarioCreado from "../../../../assets/img/UsuarioCreado.png"
import '@fontsource/work-sans'

const Agregar = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState({});
  const navigate = useNavigate();

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
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: "Finca insertada correctamente"
      });
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
      <div style={{ fontFamily: "work sans" }} className="mt-1 p-1 mb-auto rounded-3xl  
                                                          w-auto mx-10 sm:w-auto sm:mx-11 md:mx-16 lg:mx-16 2xl:mx-36">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative sm:m-1">
            <div className=" flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent">
              {/* Título centrado en móvil */}
              <div className="mb-2 ml-11 sm:ml-0 w-full sm:w-auto flex-grow self-center flex  bg-transparent ">
                <h2 className="text-2xl sm:text-3xl font-semibold lg:pl-6">Agregar Finca</h2>
              </div>

              {/* Contenedor del input y botón */}
              <div className="sm:pl-2 pr-4 flex justify-center items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12 xl: sm:rounded-full relative">
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-[80%] text-[18px] placeholder-black sm:w-full h-10 xl:h-14 rounded-full  focus:outline-none focus:ring-2 focus:ring-[#10314669] ml-5 sm:ml-0 pl-10 pr-36 sm:pl-10 sm:pr-48 "
                  placeholder="Ingrese el nombre"
                  autoComplete="off"
                  style={{
                    backgroundImage: `url(${userGray})`, // Ícono
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center', // Ajuste de posición
                    backgroundSize: '15px', // Tamaño del ícono
                  }}
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 xl:h-14  mr-10 sm:mr-0 font-extrabold bg-[rgba(0,_158,_0,_1)] text-white xl:w-1/6 lg:w-1/3 text-[14px] sm:text-[18px] w-[8rem] sm:w-[14rem] rounded-full hover:bg-green-800 focus:outline-none"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
          <div className="relative  h-[60px] sm:h-[0]"></div>
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