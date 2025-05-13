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

  const validarFormulario = () => {
    if (!nombre || !ubicacion.lat || !ubicacion.lng) {
      acctionSucessful.fire({
        imageUrl: altertaIcon,
        title: "Debe ingresar un nombre y seleccionar una ubicación",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validarFormulario())return;

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
        className="mt-1 p-1 mb-auto rounded-3xl w-auto mx-3 sm:w-auto sm:mx-2 md:mx-10 lg:mx-16 2xl:mx-36">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative sm:m-1">
            <div className=" flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent">
              <div className="mb-2 ml-11 sm:ml-0 w-full sm:w-auto flex-grow self-center flex  bg-transparent ">
                <h2 className="text-2xl sm:text-2xl font-semibold lg:pl-6">Crear finca</h2>
              </div>
              <div className="sm:pl-2 pr-4 flex justify-center items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12 xl: sm:rounded-full relative">
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-[80%] text-[18px]  placeholder-black sm:w-full h-10 xl:h-14 rounded-full  focus:outline-none ml-5 sm:ml-0 pl-10 pr-36 sm:pl-10 sm:pr-48 "
                  placeholder="Ingrese el nombre"
                  autoComplete="off"
                  style={{
                    backgroundImage: `url(${nombreFinca})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center',
                  }} />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 xl:h-14  mr-10 sm:mr-0 font-extrabold bg-[rgba(0,_158,_0,_1)] text-white xl:w-1/6 lg:w-1/3 text-[14px] sm:text-[18px] w-[8rem] sm:w-[14rem] rounded-full hover:bg-green-800 focus:outline-none">
                  Crear
                </button>
              </div>
            </div>
          </div>
          <div className="m-0  rounded-b-3xl pt-24 sm:pt-3">
              <Mapa setUbicacion={setUbicacion} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar;