// src/auth/logOut.jsx
import  { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import goodBye from "../../assets/img/sesionFinalizada.png";
import { acctionSucessful } from "../../components/alertSuccesful";
import salir from "../../assets/icons/cerrarRojo.svg";
import ConfirmationModal from '../confirmationModal/confirmationModal';
import { useLogin } from '../../hooks/useLogin';

export default function CerrarSesion({ onClose }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);
  const [usuario, handleChange, iniciarSesion, logout] = useLogin();


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