import React, { useState, useEffect } from "react";
import Mapa from "../../../../components/Mapa";
import { useParams, useNavigate } from "react-router";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { actualizarFinca, getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import Navbar from "../../../../components/navbar"
import userGray from "../../../../assets/icons/userGray.png"

export default function EditarFinca() {
  const { id } = useParams();
  const [nombreFinca, setNombreFinca] = useState("");
  const [fincas, setFincas] = useState({});
  const [ubicacion, setUbicacion] = useState(null); // Estado para la ubicación
  const [originalFinca, setOriginalFinca] = useState({}); // Estado para almacenar los datos originales
  const navigate = useNavigate();

  const irAtras = () => {
    navigate(-1);
  };

  useEffect(() => {
    getFincasByIdFincas(id)
      .then(data => {
        setFincas(data);
        setOriginalFinca(data); // Guardamos los datos originales
        setNombreFinca(data.nombre); // Asigna el nombre de la finca
        setUbicacion(data.ubicacion); // Establece la ubicación de la finca
      })
      .catch(error => console.error("Error al cargar la finca:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar si se modificó algo
    if (
      nombreFinca === originalFinca.nombre && 
      JSON.stringify(ubicacion) === JSON.stringify(originalFinca.ubicacion)
    ) {
      acctionSucessful.fire({
        icon: "info",
        title: "No se modificó la informacion de la finca",
      });

      return; // Detener el envío del formulario si no hubo cambios
    }

    if (!nombreFinca || !ubicacion?.lat || !ubicacion?.lng) {
      acctionSucessful.fire({
        icon: "error",
        title: "Debe ingresar un nombre y seleccionar una ubicación",
      });
      return; // Detener el envío del formulario
    }

    // Abrir el modal para confirmar la actualización
    //setIsModalOpen(true);
    const fincaActualizada = {
      nombre: nombreFinca,
      idUsuario: fincas.idusuario,
      ubicacion,
    };

    try {
      actualizarFinca(id, fincaActualizada)
        .then(() => {
          acctionSucessful.fire({
            icon: "success",
            title: `Finca ${fincaActualizada.nombre} actualizada correctamente`,
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
    <Navbar></Navbar>
    <div style={{ fontFamily: "work sans" }} className="mt-1 p-1 mb-auto rounded-3xl  
                                                        w-auto mx-10 sm:w-auto sm:mx-11 md:mx-16 lg:mx-16 2xl:mx-32">
      <form onSubmit={handleSubmit} className="space-y-6 mt-0">
        <div className="absolute w-full left-0 sm:flex sm:flex-col xl:flex  gap-4 sm:relative sm:m-1">
          <div className=" flex flex-wrap justify-center mt-[-20px] sm:mt-3 bg-transparent">
            {/* Título centrado en móvil */}
            <div className="mb-2 ml-11 sm:ml-0 w-full sm:w-auto flex-grow self-center flex  bg-transparent ">
              <h2 className="text-2xl sm:text-3xl font-semibold">{nombreFinca}</h2>
            </div>

            {/* Contenedor del input y botón */}
            <div className="sm:pl-2 pr-4 flex justify-center items-center order-0 flex-grow-[6] flex-shrink-0 self-center w-auto h-12 xl: sm:rounded-full relative">
              <input
                type="text"
                name="nombre"
                className="w-[80%] text-[18px] placeholder-black sm:w-full h-10 xl:h-14 rounded-full  focus:outline-none focus:ring-2 focus:ring-[#10314669] ml-5 sm:ml-0 pl-10 pr-36 sm:pl-10 sm:pr-48 "
                autoComplete="off"
                placeholder={nombreFinca}
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
                Editar
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
}
