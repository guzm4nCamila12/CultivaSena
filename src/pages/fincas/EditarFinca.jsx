//imgs de los modales
import usuarioCreado from "../../assets/img/usuarioCreado.png"
import alertaIcon from "../../assets/img/alerta.png"
//icono del input
import fincaNombre from "../../assets/icons/usuarioAzul.png"
//endpoints para consumir api
import { editarFinca, getFincasByIdFincas } from "../../services/fincas/ApiFincas";
//componentes reutilizados
import Mapa from "../../components/Mapa";
import Navbar from "../../components/navbar"
import { acctionSucessful } from "../../components/alertSuccesful";
//importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

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
    //Compara si los valores son diferentes a los datos originales
    const nombreModificado = nombreFinca !== originalFinca.nombre;
    const ubicacionModificada = JSON.stringify(ubicacion) !== JSON.stringify(originalFinca.ubicacion);
    //Si no se ha modificado algun dato muestra un mensaje de alerta
    if (!nombreModificado && !ubicacionModificada) {
      acctionSucessful.fire({
        imageUrl: alertaIcon,
        title: `No se modificó la información de la finca ${nombreFinca}`,
      });
      return
    }
    //Datos para actualizar la finca
    const fincaActualizada = {
      nombre: nombreFinca,
      idUsuario: fincas.idusuario,
      ubicacion,
    };

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
        className="mt-1 p-1 mb-auto rounded-3xl w-auto mx-3 sm:w-auto sm:mx-11 md:mx-16 lg:mx-16 2xl:mx-32">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative sm:m-1">
            <div className=" flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent">
              <div className="mb-2 ml-11 sm:ml-0 w-full sm:w-auto flex-grow self-center flex  bg-transparent ">
                <h2 className="text-2xl sm:text-3xl font-semibold">Editar finca</h2>
              </div>
              {/* Contenedor del input y botón */}
              <div className="sm:pl-2 pr-4 flex justify-center items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12 xl: sm:rounded-full relative">
                <input
                  type="text"
                  name="nombre"
                  className="w-[80%] text-[18px] placeholder-black sm:w-full h-10 xl:h-14 rounded-full  focus:outline-none focus:ring-2 focus:ring-[#10314669] ml-5 sm:ml-0 pl-10 pr-36 sm:pl-10 sm:pr-48 "
                  autoComplete="off"
                  placeholder={originalFinca.nombre}
                  onChange={(e) => setNombreFinca(e.target.value)}
                  style={{
                    backgroundImage: `url(${fincaNombre})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left 12px center',
                  }} />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 xl:h-14  mr-10 sm:mr-0 font-extrabold bg-[rgba(0,_158,_0,_1)] text-white xl:w-1/6 lg:w-1/3 text-[14px] sm:text-[18px] w-[8rem] sm:w-[14rem] rounded-full hover:bg-green-800 focus:outline-none">
                  Editar
                </button>
              </div>
            </div>
          </div>
          <div className="m-0  rounded-b-3xl pt-24 sm:pt-3">
            {/* Solo renderizamos el mapa si la ubicación no es null */}
            {ubicacion ? (
              <Mapa setUbicacion={setUbicacion} ubicacion={ubicacion} />
            ) : (
              <p className="text-gray-600">Cargando mapa...</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
