// Importación del hook useState para manejar estado local
import React, { useState } from 'react';

// Hook de React Router para redirigir a otras rutas
import { useNavigate } from 'react-router-dom';

// Imagen mostrada al cerrar sesión (para la alerta visual)
import goodBye from "../../assets/img/sesionFinalizada.png";

// Función personalizada para mostrar alertas tipo "éxito"
import { acctionSucessful } from "../../components/alertSuccesful";

// Ícono del botón de cerrar sesión
import salir from "../../assets/icons/log-out-1.png";

// Componente modal de confirmación que aparece antes de cerrar sesión
import ConfirmationModal from '../confirmationModal/confirmationModal';

const LogOut = () => {
  // Hook para manejar navegación programática
  const navigate = useNavigate();

  // Estado para controlar si el modal de confirmación está visible
  const [modalOpen, setModalOpen] = useState(false);

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    // Eliminar el token del localStorage (fin de sesión)
    localStorage.removeItem('token');

    // Redirigir al usuario al inicio (o página de login)
    navigate('/');

    // Mostrar una alerta visual 
    acctionSucessful.fire({
      imageUrl: goodBye,
      imageAlt: 'Icono personalizado',
      title: `¡Sesión finalizada exitosamente!`
    });
  };

  return (
    <div>
      {/* Botón que abre el modal de confirmación */}
      <button
        onClick={() => setModalOpen(true)}
        className='text-white p-2 w-full rounded-3xl m-2 flex justify-items-start bg-red-600'
      >
        <img src={salir} alt="" className="mr-2 h-7" />
        <h3>Cerrar sesión</h3>
      </button>

      {/* Modal de confirmación para evitar cierre accidental */}
      <ConfirmationModal
        isOpen={modalOpen}                      // Estado para mostrar/ocultar modal
        onCancel={() => setModalOpen(false)}   // Acción al cancelar
        onConfirm={handleLogout}               // Acción al confirmar
        title="Cerrar sesión"                  // Título del modal
        message="¿Seguro que quieres salir?"   // Mensaje del modal
        confirmText="Sí, salir"                // Texto del botón de confirmación
        cancelText="Cancelar"                  // Texto del botón de cancelar
      />
    </div>
  );
};

export default LogOut;
