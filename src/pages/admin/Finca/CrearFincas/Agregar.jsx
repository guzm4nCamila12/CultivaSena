import React, { useState } from "react";
import Mapa from "../../../../components/Mapa/Mapa";
import { insertarFinca } from "../../../../services/fincas/ApiFincas";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../../../components/gov/navbar";
import userGray from "../../../../assets/icons/userGray.png"
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
      <div  style={{fontFamily: "work sans"}} className="my-0 p-1 mb-auto rounded-3xl  
                                                          w-auto mx-10 sm:w-auto sm:mx-11 md:mx-16 lg:mx-16 2xl:mx-32">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="flex flex-col xl:flex w-auto gap-4 relative sm:m-1 ">
            <div className="xl:absolute flex flex-wrap">
              <h2 className=" whitespace-nowrap text-2xl  lg:text-[20px] xl:text-4xl xl:ml-2 pt-2 font-bold">Agregar Finca</h2>
            </div>
            <div id="containerInpButton" className="mx-auto bg-gray-300 border-none md:bg-white ">
              <input
                type="text"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="z-10 h-14 border-4 w-full xl:ml-72 xl:w-full  md:border-gray-300 sm:border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#10314669]
                          sm:w-full "
                placeholder="Ingrese el nombre"
                autoComplete="off"
                style={{
                  backgroundImage: `url(${userGray})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 6px  center',
                }}
              />
              <button
                type="submit"
                className="z-20 absolute bottom-0 w-32 -right-1 p-0 font-extrabold mr-0 bg-[rgba(0,_158,_0,_1)] text-white text-center text-[18px] rounded-full hover:bg-[#005F00] focus:outline-none
                          h-14 sm:w-36 sm:text-[20px] md:w-52 lg:w-56 "
              >
                Agregar
              </button>
            </div>
          </div>

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