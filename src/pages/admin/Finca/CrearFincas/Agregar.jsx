import React, { useState } from "react";
import Mapa from "../../../../components/Mapa";
import Gov from "../../../../components/gov/gov";
import { insertarFinca } from "../../../../services/fincas/ApiFincas";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../../../components/gov/navbar"

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
      <div className="max-w-7xl mx-auto my-0 p-6 mb-auto w-full rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          {/* Contenedor de los elementos a alinear */}
          <div className="flex items-center space-x-4">
            <h1 className="text-center text-xl flex-shrink-0">
              Agregar Finca
            </h1>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-60 h-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10314669]"
              placeholder="Ingrese el nombre de la finca"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-32 h-12 bg-[rgba(0,_158,_0,_1)] text-white rounded-2xl hover:bg-[#30b63096] focus:outline-none"
            >
              AGREGAR
            </button>
          </div>
  
          <div className="m-0 w-full shadow-xl">
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
