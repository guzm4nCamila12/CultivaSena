import { useState } from "react";
import { recuperarClave } from "../../services/usuarios/ApiUsuarios";
function ModalTelefono({ isOpen, onClose, telefono, handleChange, recuperar, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Recuperar contraseña</h2>
        <p className="my-2">Ingrese el número de telefono correspondiente a su usuario.</p>
        <form onSubmit={recuperar}>

        <input
          type="text"
          placeholder="Número de teléfono"
          value={telefono.telefono}
          name="telefono"
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
          />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            type="submit"
            >
            Enviar
          </button>
        </div>
              </form>
      </div>
    </div>
  );
}

export default ModalTelefono;
