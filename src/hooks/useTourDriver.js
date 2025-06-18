// hooks/useTourDriver.js
import { useRef } from 'react';
import Driver from 'driver.js';
import '../assets/driver.css';

export function useDriverTour() {
  const driverRef = useRef(new Driver({
    showProgress: true,
    allowClose: true,
    overlayClickNext: true
  }));

  const startTour = (steps) => {
    driverRef.current.defineSteps(steps);
    driverRef.current.start();
  };

  return { startTour };
}
