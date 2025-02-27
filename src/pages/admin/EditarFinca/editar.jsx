import React, { useState, useEffect } from "react";
import Mapa from "../../../components/Mapa/Mapa";
import { useParams, useNavigate } from "react-router";
import { acctionSucessful } from "../../../components/alertSuccesful";
import { actualizarFinca, getFincasByIdFincas } from "../../../services/fincas/ApiFincas";
import Navbar from "../../../components/gov/navbar"

export default function EditarFinca() {
  const { id } = useParams();
  const [nombreFinca, setNombreFinca] = useState("");
  const [fincas, setFincas] = useState({});
  const [ubicacion, setUbicacion] = useState(null); // Estado para la ubicación
  const [originalFinca, setOriginalFinca] = useState({}); // Estado para almacenar los datos originales
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
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
      <Navbar/>
      <div className="m-10">
      </div>
      <div className="flex items-center justify-between">
        <button className="ml-6 p-2 text-white  bg-green-500 rounded hover:bg-green-400 h-8 w-14" 
        onClick={irAtras}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-12 pb-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        </button>

        <h1 className="text-center flex-1 mr-auto pr-20 text-xl">FINCA: {fincas.nombre}</h1>
      </div>
      <div className="max-w-4xl mx-auto p-6 mb-auto w-full rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="flex h-28 w-full mb-0 ">
            <input
              type="text"
              name="nombreFinca"
              value={nombreFinca}
              onChange={(e) => setNombreFinca(e.target.value)}
              className="mr-4 w-full h-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10314669]"
              placeholder="Ingrese su nuevo nombre"
              autoComplete="off"
            />

            <button type="submit"
             className="w-64 p-3 h-12 bg-[rgba(0,_158,_0,_1)] text-white rounded-2xl hover:bg-[#30b63096] focus:outline-none" 
            >
              EDITAR
            </button>
          </div>

          <div>
            <h1 className="text-3xl text-gray-700"><i className="bi bi-geo-alt"></i></h1>
            {/* Solo renderizamos el mapa si la ubicación no es null */}
            {ubicacion ? (
              <Mapa setUbicacion={setUbicacion} ubicacion={ubicacion} />
            ) : (
              <p className="text-gray-600">Cargando mapa...</p>
            )}
          </div>

          <div className="flex justify-start">
            <p className="text-lg text-gray-700">
              Ubicación Actual: {ubicacion ? `${ubicacion.lat}, ${ubicacion.lng}` : "Cargando..."}
              </p>
          </div>
        </form>
      </div>
    </div>
  );
}
