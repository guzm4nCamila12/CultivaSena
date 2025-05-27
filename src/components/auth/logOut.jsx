// src/auth/logOut.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import goodBye from "../../assets/img/sesionFinalizada.png";
import { acctionSucessful } from "../../components/alertSuccesful";
import salir from "../../assets/icons/log-out-1.png";
import ConfirmationModal from '../confirmationModal/confirmationModal';

export default function CerrarSesion({ onClose }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    acctionSucessful.fire({
      imageUrl: goodBye,
      imageAlt: 'Icono personalizado',
      title: `¡Sesión finalizada exitosamente!`
    });
    onClose();
  };

  return (
    <ConfirmationModal
      isOpen={modalOpen}
      onCancel={() => { setModalOpen(false); onClose(); }}
      onConfirm={handleLogout}
      title="Cerrar sesión"
      message="¿Seguro que quieres salir?"
      confirmText="Sí, salir"
      cancelText="Cancelar"
      iconSrc={salir}
    />
  );
}
