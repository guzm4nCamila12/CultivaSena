import React, { useState } from "react";
import Mapa from "../../../../components/Mapa";
import Gov from "../../../../components/gov/gov";
import { insertarFinca } from "../../../../services/fincas/ApiFincas";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { useNavigate, useParams } from "react-router";

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
    
    //Validación de campos
    if (!nombre || !ubicacion.lat || !ubicacion.lng) {
      acctionSucessful.fire({
        icon: "error",
        title: "Debe ingresar un nombre y seleccionar una ubicación",
      });
      return; // Detener el envío del formulario
    }

    const nuevaFinca = {
      idUsuario: Number(id),
      nombre,
      ubicacion,
    };

    insertarFinca(nuevaFinca);

    acctionSucessful.fire({
      icon: "success",
      title: `Finca ${nuevaFinca.nombre} insertada correctamente`,
    });

    //Si la inserción fue exitosa, proceder a la navegación
    irAtras(); 
  };

  return (
    <div>
      <div className="m-10">
        <Gov></Gov>
      </div>
      <div className="flex items-center justify-between"> {/* Cambié justify-around por justify-between */}
        {/* Botón a la izquierda */}
        <button
          onClick={irAtras}
          className="ml-6 p-2 text-white  bg-green-500 rounded hover:bg-green-400 h-8 w-14"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
  
        {/* Título centrado */}
        <h1 className="text-center flex-1 mr-auto pr-20 text-xl">
          AGREGAR FINCA
        </h1>
      </div>
      <div className="max-w-4xl mx-auto p-6 mb-auto w-full rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="flex h-28 w-full mb-0 ">
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mr-4 w-full h-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el nombre de la finca"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-64 p-3 h-12 bg-[rgba(0,_158,_0,_1)] text-white rounded-2xl hover:bg-blue-400 focus:outline-none"
            >
              AGREGAR
            </button>
          </div>
  
          <div className="mt-auto w-full rounded-xl shadow-xl">
            {/* Solo renderizamos el mapa si la ubicación no es null */}
            {ubicacion ? (
              <Mapa setUbicacion={setUbicacion}/>
            ) : (
              <p className="text-gray-600">Cargando mapa...</p>
            )}
          </div>
  
          <div className="flex justify-start bg-[rgba()]">
            <p className="text-lg text-gray-700">
              Ubicación Actual: {ubicacion.lat} {ubicacion.lng}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar;
