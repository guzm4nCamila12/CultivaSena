import React, { useState, useEffect } from "react";
import Mapa from "../../../../components/Mapa";
import { useParams, useNavigate } from "react-router";
import { acctionSucessful } from "../../../../components/alertSuccesful";
import { actualizarFinca, getFincasByIdFincas } from "../../../../services/fincas/ApiFincas";
import Navbar from "../../../../components/navbar"

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
      <div style={{fontFamily: "work sans"}} className="max-w-[1906px] min-h-[580px] mx-40 my-0 p-1 mb-auto rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 mt-0">
          <div className="flex max-w-[1721px] gap-4 relative ">
          <h2 className="whitespace-nowrap text-4xl font-medium pt-2 ml-9">{nombreFinca}</h2>
            <input
              type="text"
              name="nombreFinca"
              value={nombreFinca}
              onChange={(e) => setNombreFinca(e.target.value)}
              className="z-10 max-w-[1260px] flex-grow pl-7 h-14 border-4 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#10314669]"
              placeholder="Ingrese su nuevo nombre"
              autoComplete="off"
            />
            <button type="submit"
             className="z-20 absolute bottom-0 -right-1 w-64 p-0 font-extrabold h-14 mr-0 bg-[rgba(0,_158,_0,_1)] text-white text-center text-[25px] rounded-full hover:bg-[#005F00] focus:outline-none" 
            >
              Editar
            </button>
          </div>

          <div className="m-0 w-full shadow-xl rounded-b-3xl">
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
