import { useState } from "react";
import { recuperarClave } from "../../services/usuarios/ApiUsuarios";
function ModalTelefono({ isOpen, onClose, telefono, handleChange, recuperar, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Recuperar contraseña</h2>
        <p className="my-2">Ingrese el número de telefono correspondiente a su usuario</p>
        <form onSubmit={recuperar}>

          <input
            type="text"
            placeholder="Número de teléfono"
            value={telefono.telefono}
            name="telefono"
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />
          <div className="flex w-full justify-between">
            <button
              className="bg-[#00304D] hover:scale-95 transition-all ease-in-out duration-300 text-white px-5 py-3 rounded-full"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-[#34a900] hover:scale-95 transition-all ease-in-out duration-300 text-white px-5 py-3 rounded-full"
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
