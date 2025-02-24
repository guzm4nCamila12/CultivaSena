import React, { useState, useEffect } from "react";
import Mapa from "../../../components/Mapa";
import { useParams, useNavigate } from "react-router";
import { acctionSucessful } from "../../../components/alertSuccesful";
import { actualizarFinca, getFincasByIdFincas } from "../../../services/fincas/ApiFincas";
import Gov from "../../../components/gov/gov"

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
      <div>
      <Gov />
      </div>
      <div className="container mx-auto my-5 p-6">
      <div className="flex justify-start">
        <button className="me-auto p-2 bg-green-500 text-white rounded hover:bg-green-400" onClick={irAtras}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        </button>
      </div>

        <h3 className="text-xl font-semibold text-gray-800">EDITAR FINCA {fincas.nombre}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">Ingrese su nuevo nombre:</label>
            <input
              type="text"
              name="nombreFinca"
              value={nombreFinca}
              onChange={(e) => setNombreFinca(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={fincas.nombre}
              autoComplete="off"
            />
          </div>

          <div>
            <h1 className="text-3xl text-gray-700"><i className="bi bi-geo-alt"></i></h1>
            {/* Solo renderizamos el mapa si la ubicación no es null */}
            {ubicacion ? (
              <Mapa setUbicacion={setUbicacion} ubicacion={ubicacion} />
            ) : (
              <p>Cargando mapa...</p>
            )}
          </div>

          <div>
            <p className="text-lg text-gray-700">Ubicación Actual: {ubicacion ? `${ubicacion.lat}, ${ubicacion.lng}` : "Cargando..."}</p>
          </div>

          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 focus:outline-none">
            EDITAR
          </button>
        </form>
      </div>
    </div>
  );
}
