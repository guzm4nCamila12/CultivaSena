import Swal from 'sweetalert2';

export const acctionSucessful = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    // Aplica un estilo personalizado a la barra de progreso
    popup: 'my-toast-popup', 
    timerProgressBar: 'my-timer-progress-bar', // Aplica clase personalizada a la barra de progreso
    title: 'my-toast-title', // Aplica una clase personalizada al título
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Estilos para personalización
const style = document.createElement('style');
style.innerHTML = `
  .my-timer-progress-bar {
    background-color: #FF5733 !important; /* Color de la barra de carga */
  }

  /* Alinea el contenido horizontalmente */
  .my-toast-popup {
    display: flex;
    align-items: center; /* Alinea verticalmente los elementos */
    justify-content: flex-start; /* Alinea todo al inicio (izquierda) */
  }

  /* Asegúrate de que el texto y el icono estén alineados */
  .my-toast-popup .swal2-icon {
    margin-right: 10px; /* Espacio entre el icono y el texto */
  }

  .my-toast-title {
    margin: 0; /* Elimina cualquier margen que pudiera interferir */
  }
`;

document.head.appendChild(style);