// src/auth/logOut.jsx
import  { useState } from 'react';
import PropTypes from 'prop-types';
import salir from "../../assets/icons/cerrarRojo.svg";
import ConfirmationModal from '../confirmationModal/confirmationModal';
import { useLogin } from '../../hooks/useLogin';

export default function CerrarSesion({ onClose }) {

  const [modalOpen, setModalOpen] = useState(true);
  const [,,, logout] = useLogin();

  return (
    <ConfirmationModal
      isOpen={modalOpen}
      onCancel={() => { setModalOpen(false); onClose(); }}
      onConfirm={logout}
      title="Cerrar sesión"
      message="¿Seguro que quieres salir?"
      confirmText="Sí, salir"
      cancelText="Cancelar"
      iconSrc={salir}
    />
  );
}

CerrarSesion.propTypes = {
  onClose: PropTypes.func.isRequired, 
};