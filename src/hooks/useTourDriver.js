// hooks/useTourDriver.js
import { useRef } from 'react';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import '../assets/driver.css';

export function useDriverTour() {
  const driverRef = useRef(new Driver({
    showProgress: true,
    allowClose: true,
    overlayClickNext: true,
    doneBtnText: "Finalizar",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    closeBtnText: "⨉",
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
      onHighlightStarted: el => el?.classList?.add('tour-disabled'),
      onDeselected: el => el?.classList?.remove('tour-disabled'),
    }));

    driverRef.current.defineSteps(enhancedSteps);
    driverRef.current.start();
  };

  return { startTour };
}
//probar corriendo el tour con un tamaño menor a 768px