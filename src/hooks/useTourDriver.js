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

  // 👇 Ajusta posición y alineación según el tamaño de pantalla
  const ajustarPosicionesSteps = (steps) => {
    const isMobile = window.innerWidth < 1300;
    return steps.map(step => {
      if (!step.popover) return step;

      return {
        ...step,
        popover: {
          ...step.popover,
          position: isMobile ? 'bottom' : step.popover.position || 'right',
          align: isMobile ? 'start' : step.popover.align || 'center',
        }
      };
    });
  };

  const startTour = (steps) => {
    const stepsConPosicion = ajustarPosicionesSteps(steps);

    const enhancedSteps = stepsConPosicion.map(step => ({
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
