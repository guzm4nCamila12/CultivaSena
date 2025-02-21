import React, { useState, useEffect } from "react";
import Mapa from "../../../components/Mapa";
import { useParams, useNavigate } from "react-router";

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
      return; // Detener el envío del formulario
    }

    // Abrir el modal para confirmar la actualización
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    const fincaActualizada = {
      nombre: nombreFinca,
      idUsuario: fincas.idusuario,
      ubicacion,
    };
    
    // Aquí debes enviar el objeto `fincaActualizada` a tu API o acción para actualizar la finca
    // Por ejemplo, si tienes una función como `actualizarFinca(id, fincaActualizada)`
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Cerrar el modal si se cancela
  };

  return (
    <div>
      <div className="flex justify-start">
        <button className="btn btn-success me-auto p-2 bg-green-500 text-white rounded hover:bg-green-400" onClick={irAtras}>
          <i className="bi bi-arrow-left"></i> Regresar
        </button>
      </div>
      <div className="container mx-auto p-6">

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

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h5 className="text-xl font-semibold">¿Está seguro de que desea actualizar esta finca?</h5>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-400"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                onClick={handleConfirmUpdate}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
