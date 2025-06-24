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

  const startTour = (steps) => {
    driverRef.current.defineSteps(steps);
    driverRef.current.start();
  };

  return { startTour };
}
