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

    // Evento cuando empieza el tour
    onReset: () => {
      document.body.style.pointerEvents = 'auto';
    },
    onDestroyStarted: () => {
      document.body.style.pointerEvents = 'auto';
    }
  }));

  const startTour = (steps) => {
    const enhancedSteps = steps.map(step => ({
      ...step,
    }));

    // Deshabilitar interacción al empezar
    document.body.style.pointerEvents = 'none';

    driverRef.current.defineSteps(enhancedSteps);
    driverRef.current.start();
  };

  return { startTour };
}
