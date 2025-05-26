import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import goodBye from "../../assets/img/sesionFinalizada.png";
import { acctionSucessful } from "../../components/alertSuccesful";
import salir from "../../assets/icons/log-out-1.png";
import ConfirmationModal from '../confirmationModal/confirmationModal'; // Asegúrate de importar correctamente

const LogOut = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    acctionSucessful.fire({
      imageUrl: goodBye,
      imageAlt: 'Icono personalizado',
      title: `¡Sesión finalizada exitosamente!`
    });
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className='text-white p-2 w-full rounded-3xl m-2 flex justify-items-start bg-red-600'
      >
        <img src={salir} alt="" className="mr-2 h-7" />
        <h3>Cerrar sesión</h3>
      </button>

      <ConfirmationModal
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message="¿Seguro que quieres salir?"
        confirmText="Sí, salir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default LogOut;
