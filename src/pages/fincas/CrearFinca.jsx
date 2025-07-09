//importaciones necesarias de react
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
//imgs de los modales
import usuarioCreado from "../../assets/img/usuarioCreado.png"
import altertaIcon from "../../assets/img/alerta.png"
//componentes reutilizados
import Mapa from "../../components/Mapa";
import { acctionSucessful } from "../../components/alertSuccesful";
import Navbar from "../../components/navbar";
//icono del input
import nombreFinca from "../../assets/icons/fincaAzul.png"
//endpoints para consumir api
import { crearFinca } from "../../services/fincas/ApiFincas";
import BotonAtras from "../../components/botonAtras";

//Driver tour
import { useDriverTour } from "../../hooks/useTourDriver";
import { crearFincaSteps } from "../../utils/aplicationSteps";

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

  useDriverTour(crearFincaSteps)

  const validarFormulario = () => {
    if (!nombre || !ubicacion.lat || !ubicacion.lng) {
      acctionSucessful.fire({
        imageUrl: altertaIcon,
        title: "Ingrese un nombre y seleccione una ubicación",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nuevaFinca = { idUsuario: Number(id), nombre, ubicacion };

    try {
      const response = await crearFinca(nuevaFinca);
      // Si la respuesta es válida, se maneja de forma exitosa
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: 'Icono personalizado',
        title: `¡Finca: <span style="color: green;">${nombre}</span> creada correctamente!`
      });
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
      <Navbar />
      <div style={{ fontFamily: "work sans" }}
        className="mt-1 p-1 mb-auto  w-auto px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative ">
            <div className=" px-4 sm:px-0 flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent mx-auto w-full">
              <div className="mb-2  ml-0  w-full sm:w-full md:w-auto flex-grow self-center flex items-end bg-transparent ">
                <BotonAtras />
                <h2 className="text-2xl font-semibold">Crear Finca</h2>
              </div>
              <div id='nombreFincaSteps' className="pl-4 flex bg-white items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12  rounded-full relative">
                <img src={nombreFinca} alt="" className="pr-1 border-r-2" />
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="text-[18px] w-full ml-1  placeholder-black h-full  focus:outline-none"
                  placeholder="Ingrese el nombre"
                  autoComplete="off" />
                <button
                  id="botonCrearSteps"
                  type="submit"
                  className=" h-full mr-0 font-bold bg-[rgba(0,_158,_0,_1)] text-white w-1/3 lg:w-1/5 text-xl sm:text-2xl  rounded-full hover:bg-green-800 focus:outline-none">
                  Crear
                </button>
              </div>
            </div>
          </div>
          <div id='ubicacionSteps' className="m-0  rounded-b-3xl pt-24 sm:pt-3  mx-auto ">
            <Mapa setUbicacion={setUbicacion} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar;