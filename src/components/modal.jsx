import { useState, useEffect } from "react";

const ToastNotification = ({ titulo, descripcion, icono, barraColor = "bg-green-500", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 bg-white shadow-lg rounded-xl p-4 flex items-center space-x-4 z-50 border-l-4" style={{ borderColor: barraColor }}>
      {icono && <img src={icono} alt="icono" className="w-6 h-6" />}
      <div>
        <h5 className="text-lg font-bold text-green-700">{titulo}</h5>
        <p className="text-sm text-gray-700">{descripcion}</p>
      </div>
    </div>
  );
};

export default ToastNotification;
