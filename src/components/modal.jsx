const Modal = ({ titulo, icono, descripcion, texto, onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-3xl shadow-lg w-1/4 p-6">
          <h5 className="text-2xl font-bold mb-4 text-center">{titulo}</h5>
          <hr />
          <form>
            <div className="flex justify-center my-4">
              <div className="bg-[#00304D] p-4 rounded-full">
                <img src={icono} alt="icono" />
              </div>
            </div>
            <p className="text-lg text-center font-semibold">{descripcion}</p>
            <p className="text-gray-500 text-center text-sm">{texto}</p>
  
            <div className="flex justify-between mt-6 space-x-4">
              <button 
                className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                onClick={onClose} // ✅ Llama a la función para cerrar el modal
                type="button" 
              >
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Modal;
  