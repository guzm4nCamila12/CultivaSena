//importaciones necesarias de react
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//imgs modales
import ConfirmarEliminar from '../../assets/img/eliminar.png'
import goodBye from "../../assets/img/sesionFinalizada.png"
//componentes reutilizados
import { acctionSucessful } from "../../components/alertSuccesful";
//icons
import salir from "../../assets/icons/salir.png"

const LogOut = () => {
  const navigate = useNavigate(); // Obtén el hook useNavigate
  const [modalLogoutAbierto, setModallogoutAbierto] = useState(false);
  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de login
    navigate('/');
    acctionSucessful.fire({
      imageUrl: goodBye,
      imageAlt: 'Icono personalizado',
      title: `¡Sesión finalizada exitosamente!`
    });
  };

  return (
    <div>
      {/* Otros contenidos de tu componente */}
      <button onClick={() => setModallogoutAbierto(true)} className='text-white p-2 m-2 flex justify-items-start hover:bg-[#184a68]'>
        <img src={salir} alt="" className="mr-1 h-5" />
        Cerrar sesión
      </button>

      {modalLogoutAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-3xl font-bold mb-4 text-center">Cerrar Sesión</h5>
            <hr />
            <div className="flex justify-center my-4">
              <img src={ConfirmarEliminar} alt="icono" />
            </div>
            <p className="text-2xl text-center font-semibold">¿Seguro que quieres salir?</p>
            <div className="flex justify-between mt-6 space-x-4">
              <button
                className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                onClick={() => setModallogoutAbierto(false)} >
                Cancelar
              </button>
              <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 rounded-full text-lg" onClick={handleLogout}>
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogOut;
