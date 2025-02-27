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
      acctionSucessful.fire({
        icon: "success",
        title: `Finca ${nuevaFinca.nombre} insertada correctamente`,
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
      <Navbar></Navbar>
      <div  style={{fontFamily: "work sans"}} className="max-w-[1906px] min-h-[580px] mx-20 my-0 p-1 mb-auto rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
        <div className="flex max-w-[1721px] gap-4 relative ">
          <h2 className="whitespace-nowrap text-4xl font-medium ml-9">Agregar Finca</h2>
          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="z-10 max-w-[1260px] flex-grow pl-7 h-14 border-4 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#10314669]"
            placeholder="Ingrese el nombre"
            autoComplete="off"
            style={{
              backgroundImage: `url(${userGray})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left 6px center',
            }}
          />
          <button
            type="submit"
            className="z-20 absolute bottom-0 -right-1 w-80 p-0 font-extrabold h-14 mr-0 bg-[rgba(0,_158,_0,_1)] text-white text-center text-[25px] rounded-full hover:bg-[#005F00] focus:outline-none"
          >
            Agregar
          </button>
        </div>

          <div className="m-0 w-full shadow-xl rounded-b-3xl">
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
