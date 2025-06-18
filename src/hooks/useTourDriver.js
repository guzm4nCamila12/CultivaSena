// src/hooks/useDriverTour.js
import { useEffect } from "react";
import Driver from "driver.js";
import "../assets/driver.css";

export function useDriverTour(steps = []) {
  useEffect(() => {
    const interval = setInterval(() => {
      const allExist = steps.every(step => document.querySelector(step.element));
      if (allExist) {
        clearInterval(interval);
        const driver = new Driver({
          showProgress: true,
          animate: true,
          opacity: 0.5,
          doneBtnText: "Finalizar",
          nextBtnText: "Siguiente",
          prevBtnText: "Anterior",
        });

        driver.defineSteps(steps);
        driver.start();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [steps]);
}
