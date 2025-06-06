import React from 'react';
import ConfirmarEliminar from '../../assets/img/eliminar.png'

const ConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-3/4 lg:w-1/3 sm:w-2/3 md:w-2/4 xl:w-1/4 p-6 mx-4 my-8 sm:my-12">
        <h5 className="text-3xl font-bold mb-2 text-black text-center">{title}</h5>
        <hr />
        <div className="flex justify-center my-2">
          <img src={ConfirmarEliminar} alt="modal-icon" />
        </div>
        <p className="text-2xl text-center text-black font-semibold">{message}</p>
        <div className="flex justify-between mt-6 space-x-4">
          <button
            className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 rounded-full text-lg"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
