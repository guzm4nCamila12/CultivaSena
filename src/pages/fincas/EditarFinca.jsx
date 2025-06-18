//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
//imgs de los modales
import usuarioCreado from "../../assets/img/usuarioCreado.png"
//icono del input
import fincaNombre from "../../assets/icons/fincaAzul.png"
//endpoints para consumir api
import { editarFinca, getFincasByIdFincas } from "../../services/fincas/ApiFincas";
//componentes reutilizados
import Mapa from "../../components/Mapa";
import Navbar from "../../components/navbar"
import { acctionSucessful } from "../../components/alertSuccesful";
import { validarSinCambios } from "../../utils/validaciones";
import BotonAtras from "../../components/botonAtras";
import finca from "../../assets/icons/fincaAzul.png"

import { useDriverTour } from "../../hooks/useTourDriver";
import { editarFincaSteps } from "../../utils/aplicationSteps";

export default function EditarFinca() {
  //Obtener el ID de la URL
  const { id } = useParams();
  //Declaracion de los estados que gestionan los valores
  const [nombreFinca, setNombreFinca] = useState("");
  const [fincas, setFincas] = useState({});
  const [ubicacion, setUbicacion] = useState(null);  // Asegúrate de que la ubicación es inicializada correctamente
  const [originalFinca, setOriginalFinca] = useState({});
  const navigate = useNavigate();
  //Funcion para navegar hacia atras 
  const irAtras = () => {
    navigate(-1);
  };
  useDriverTour(editarFincaSteps)

  //Se ejecuta cuando el componente se monta o cuando cambia el ID 
  useEffect(() => {
    //Obtiene los datos de la finca por su ID
    getFincasByIdFincas(id)
      .then(data => {
        setFincas(data);
        setOriginalFinca(data);
        setNombreFinca(data.nombre);
        setUbicacion(data.ubicacion);  // Asignamos la ubicación de la finca a este estado
      })
      .catch(error => console.error("Error al cargar la finca:", error));
  }, [id]);

  //Funcion que maneja el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const fincaActualizada = {
      nombre: nombreFinca,
      idUsuario: fincas.idusuario,
      ubicacion,
    };

    if (!validarSinCambios(originalFinca, fincaActualizada, "la finca", ["idusuario", "id"])) return

    try {
      //Intenta actualizar la finca
      editarFinca(id, fincaActualizada)
        .then(() => {
          acctionSucessful.fire({
            imageUrl: usuarioCreado,
            title: `¡Finca: <span style="color: #3366CC;">${fincaActualizada.nombre}</span> editada correctamente!`,
          });
          irAtras();
        })
        .catch((error) => {
          acctionSucessful.fire({
            icon: "error",
            title: "Error al actualizar la finca",
          });
          console.error("Error al actualizar finca:", error);
        });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ fontFamily: "work sans" }}
        className="mt-1 p-1 mb-auto  w-auto px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 ">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative ">
            <div className=" px-4 sm:px-0 flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent mx-auto w-full">
              <div className="mb-2  ml-0  w-full sm:w-full md:w-auto flex-grow self-center flex items-end bg-transparent ">
                <BotonAtras />
                <h2 className="text-2xl font-semibold">Editar finca</h2>
              </div>
              <div id='nombreFincaSteps' className="pl-4 flex bg-white items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12  rounded-full relative">
                <img src={finca} alt="" srcset="" className="pr-1 border-r-2" />
                <input
                  type="text"
                  name="nombre"
                  placeholder={originalFinca.nombre}
                  onChange={(e) => setNombreFinca(e.target.value)}
                  className="text-[18px] w-full ml-1  placeholder-black h-full  focus:outline-none"
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
}
