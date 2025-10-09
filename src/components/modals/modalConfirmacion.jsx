import check from '../../assets/icons/Check-box.svg'

function ModalConfirmacion({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 items-center flex flex-col rounded-2xl shadow-lg w-[400px] text-center">
                <img src={check} alt=""/>
                <h2 className="text-2xl text-[#3D3D3D] font-bold mb-4">¡Correo enviado!</h2>
                <p className="mb-4 text-[#737373]">
                    Hemos enviado a tu correo electrónico un enlace con el que podras reeestablecer tu contraseña.
                    ¡Revisa tu bandeja de entrada!
                </p>
                <button
                    className="bg-[#39A900] hover:scale-95 transition-all ease-in-out duration-300 text-white px-5 py-3 rounded-full"
                    onClick={onClose}
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}

export default ModalConfirmacion