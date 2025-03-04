import Swal from 'sweetalert2';

export const acctionSucessful = (options = {}) => {
  // Configuración base
  const defaultOptions = {
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'my-toast-popup',
      timerProgressBar: 'my-timer-progress-bar',
      title: 'my-toast-title',
    },
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  };
// Estilos para personalización
const style = document.createElement('style');
style.innerHTML = `
  .my-timer-progress-bar {
    background-color: #009E00 !important; /* Color de la barra de carga */
  }

  /* Alinea el contenido horizontalmente */
  .my-toast-popup {
  display: flex !important;
  align-items: center !important; /* Alinea verticalmente */
  justify-content: flex-start !important; /* Alinea el contenido a la izquierda */
  height: 90px; /* Mantiene una altura fija */
}

.my-toast-popup .swal2-icon {
  margin-top: -5px !important;
  margin-right: 30px !important; /* Espacio entre el icono y el texto */
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-toast-title {
  margin-left: 30px !important;
  font-size: 16px !important;
  line-height: 1.2 !important; /* Ajusta el espaciado para mantener alineado el texto */
}

`;

document.head.appendChild(style);
