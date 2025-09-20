function ModalConfirmacion({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-lg font-bold mb-4">¡Correo enviado!</h2>
        <p className="mb-4">
          Hemos enviado un enlace de recuperación a tu correo electrónico.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalConfirmacion;
