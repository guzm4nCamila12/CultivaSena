// src/components/ModalFechaRango.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import * as Images from "../../assets/img/imagesExportation"
import { acctionSucessful } from "../alertSuccesful";

const ModalFechaRango = ({ isOpen, onClose, onConfirm, vista }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Determinar texto del botón según la vista
  let btnText = "Generar Reporte";
  if (vista === "/reporte") btnText = "Generar Reporte";
  else if (vista === "/estadistica") btnText = "Generar Gráfica";

  const handleConfirm = () => {
    if (!fechaInicio || !fechaFin) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: `¡Por favor selecciona ambas fechas!`,
      });
      return;
    }
  
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    end.setHours(23, 59, 59, 999); // Asegura que se incluya todo el día de 'fechaFin'
  
    if (start > end) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        title: `¡La fecha de inicio no puede ser mayor que la fecha de fin!`,
      });
      return;
    }
  
    onConfirm({ fechaInicio, fechaFin });
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-auto xl:1/3 2xl:w-1/3 p-6 mx-4 my-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Seleccionar Rango de Fechas</h2>
        <hr/>
        <div className="mb-4 my-2">
          <label className="block text-lg font-medium mb-1 pl-3">Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-1 pl-3">Fecha de Fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onClose}
            className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

ModalFechaRango.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  vista: PropTypes.string,
};

ModalFechaRango.defaultProps = {
  vista: "",
};

export default ModalFechaRango;
