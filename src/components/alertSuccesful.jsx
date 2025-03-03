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

  // Configuración dinámica con las opciones pasadas
  const finalOptions = {
    ...defaultOptions,
    icon: options.icon || 'success',  // Default icon is 'success', but can be changed
    customClass: {
      ...defaultOptions.customClass,
      timerProgressBar: options.timerProgressBarClass || defaultOptions.customClass.timerProgressBar,
      iconCustom: options.iconCustom || '', // Nueva clase personalizada para el icono
    },
    title: options.title || 'Operación exitosa',  // Default title text
  };

  // Personalizar el color de la barra de progreso si se proporciona
  if (options.progressBarColor) {
    finalOptions.customClass.timerProgressBar = options.progressBarColor;
  }

  // Llamar al Swal con las opciones finales
  return Swal.fire(finalOptions);
};
