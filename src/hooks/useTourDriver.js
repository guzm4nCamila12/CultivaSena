// hooks/useTourDriver.js
import { useRef } from 'react';
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import '../assets/driver.css';

export function useDriverTour() {
  // Deshabilita interacción excepto en el popver y el elemento resaltado
  const deshabilitarInteraccion = () => {
    const all = document.querySelectorAll(
      'body *:not(.driver-popover):not(.driver-popover *)'
    );
    for (const el of all) {
      el.classList.add('tour-disabled');
    }
  };

  // Reactiva toda la interacción
  const habilitarInteraccion = () => {
    const elementos = document.querySelectorAll('.tour-disabled');
    for (const el of elementos) {
      el.classList.remove('tour-disabled');
    }
  };
  // Referencia a la instancia de Driver.js
  const driverRef = useRef(
    new Driver({
      showProgress: true,
      allowClose: true,
      overlayClickNext: true,
      doneBtnText: 'Finalizar',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      closeBtnText: '⨉',
      onReset: habilitarInteraccion,
      onDestroyStarted: habilitarInteraccion,
    })
  );

  // Ajusta posición y alineación según tamaño de pantalla
  const ajustarPosicionesSteps = steps => {
    const isMobile = window.innerWidth < 1300;
    return steps.map(step => {
      if (!step.popover) return step;
      return {
        ...step,
        popover: {
          ...step.popover,
          position: isMobile ? 'bottom' : step.popover.position || 'right',
          align: isMobile ? 'start' : step.popover.align || 'center',
        },
      };
    });
  };

  // Función para iniciar el tour
  const startTour = rawSteps => {
    // 1. Filtrar pasos sin elemento en el DOM
    const validSteps = rawSteps.filter(step => {
      if (!step.element) return true;
      const el = typeof step.element === 'string'
        ? document.querySelector(step.element)
        : step.element();
      return Boolean(el);
    });

    if (validSteps.length === 0) {
      console.warn('No hay pasos válidos para este tour.');
      return;
    }

    // 2. Ajustar posición/align para móvil/desktop
    const stepsConPosicion = ajustarPosicionesSteps(validSteps);

    // 3. Enriquecer cada paso con handlers de interacción
    const enhancedSteps = stepsConPosicion.map(step => ({
      ...step,
      onHighlightStarted: el => {
        habilitarInteraccion();
        deshabilitarInteraccion();
        el?.classList?.remove('tour-disabled');
      },
      onDeselected: el => {
        el?.classList?.add('tour-disabled');
      },
    }));

    // 4. Asegurar que el último paso use el texto de "Finalizar"
    const lastIdx = enhancedSteps.length - 1;
    if (enhancedSteps[lastIdx].popover) {
      enhancedSteps[lastIdx].popover.nextBtnText =
        driverRef.current.options?.doneBtnText || 'Finalizar';
    }

    // 5. Definir y arrancar el tour
    driverRef.current.defineSteps(enhancedSteps);
    driverRef.current.start();
  };

  return { startTour };
}
