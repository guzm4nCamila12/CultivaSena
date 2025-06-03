//importacion de libreria para mostrar alertas
import Swal from 'sweetalert2';
//funcion para mostrar la alerta con caracteristicas especificas
export const acctionSucessful = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    // Se aplican clases personalizadas para modificar el alert
    popup: 'my-toast-popup',
    timerProgressBar: 'my-timer-progress-bar',
    title: 'my-toast-title',
  },
  //Funcion de la libreria para detener la barra de pogreso cuando se hace hover
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Estilos personalizados
const style = document.createElement('style');
style.innerHTML = `
  .my-timer-progress-bar {
    background-color: #009E00 !important; /* Color de la barra de carga */
  }
  /* Alinea el contenido horizontalmente */
  .my-toast-popup {
  display: flex !important;
  align-items: center !important; /* Alinea verticalmente */
  justify-content: flex-end !important; /* Alinea el contenido a la izquierda */
  height: 90px; /* Mantiene una altura fija */
  padding: 20px;
  border-radius: 25px;
}
.my-toast-popup img { 
  width: 80px !important; /* Ajusta el tamaño de la imagen */
  height: 80px !important;
  margin: 10px !important;
}
.my-toast-title {
  color: black;
  font-size: 18px !important;
  line-height: 1.2 !important; /* Ajusta el espaciado para mantener alineado el texto */
}
`;

document.head.appendChild(style);