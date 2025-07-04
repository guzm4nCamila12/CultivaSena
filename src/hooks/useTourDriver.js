// hooks/useTourDriver.js
import { useRef } from 'react';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import '../assets/driver.css';

export function useDriverTour() {
  const deshabilitarInteraccion = () => {
    const all = document.querySelectorAll('body *:not(.driver-popover):not(.driver-popover *)');
    all.forEach(el => {
      el.classList.add('tour-disabled');
    });
  };
  
  const habilitarInteraccion = () => {
    document.querySelectorAll('.tour-disabled').forEach(el => {
      el.classList.remove('tour-disabled');
    });
  };
  const driverRef = useRef(new Driver({
    showProgress: true,
    allowClose: true,
    overlayClickNext: true,
    doneBtnText: "Finalizar",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    closeBtnText: "⨉",

    // Limpiar estado al salir
    onReset: habilitarInteraccion,
    onDestroyStarted: habilitarInteraccion
  }));


  const startTour = (steps) => {
    const enhancedSteps = steps.map(step => ({
      ...step,
      onHighlightStarted: el => {
        habilitarInteraccion(); // limpia anteriores
        deshabilitarInteraccion(); // aplica nuevos
        el?.classList?.remove('tour-disabled'); // habilita el elemento resaltado
      },
      onDeselected: el => {
        el?.classList?.add('tour-disabled'); // re-bloquea cuando deja de estar resaltado
      }
    }));

    driverRef.current.defineSteps(enhancedSteps);
    driverRef.current.start();
  };

  return { startTour };
}

