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
    const enhancedSteps = steps.map(step => ({
      ...step,
      onHighlightStarted: el => el?.classList?.add('tour-disabled'),
      onDeselected: el => el?.classList?.remove('tour-disabled'),
    }));

    driverRef.current.defineSteps(enhancedSteps);
    driverRef.current.start();
  };

  return { startTour };
}
