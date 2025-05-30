import React from 'react'
import Navbar from '../../components/navbar'
import { useParams } from 'react-router-dom';
import { superAdminIcon, adminIcon, alternoIcon,finca } from '../../assets/img/imagesExportation';
import { fincasIcon, sensoresIcon,editar } from '../../assets/icons/IconsExportation';
import { jwtDecode } from 'jwt-decode';
import Tabla from '../../components/Tabla';

function PerfilUsuario() {

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : {};


  const obtenerRol = () => {
    switch (decodedToken?.idRol) {
      case 1: return superAdminIcon;
      case 2: return adminIcon;
      case 3: return alternoIcon;
      default: return alternoIcon;
    }
  }

  const columnas = [
    { key: "finca", label: "Finca" },
    { key: "actividad", label: "Actividad" },
    { key: "fecha", label: "Fecha" }
  ];

  return (
    <>
      <Navbar />
      <div className='flex bg-purple-300'>
        <div className='flex p-3 h-full w-full bg-yellow-200 pl-[188px] '>
          <div className='bg-slate-500 p-3 w-1/4 '>
            <div className='bg-blue-400 h-64 w-8/12 flex justify-center items-center'>
              <img src={obtenerRol()} alt="" className='w-56 h-56' />
            </div>
            <div className='bg-orange-300 px-5 w-8/12 border-b-2 border-t-2 mt-3 h-64 space-y-3 text-center flex-col justify-center'>
              <h2 className='bg-amber-600 border-b border-gray-700'>{decodedToken.nombre}</h2>
              <h2 className='bg-green-600 border-b border-gray-700'>{decodedToken.telefono}</h2>
              <h2 className='bg-rose-400 border-b border-gray-700'>{decodedToken.correo}</h2>
              <button className='bg-green-600 px-4 py-1 rounded-3xl'>
                <img src={editar} alt="" />
              </button>
            </div>
          </div>
          <div className='bg-red-400 flex flex-col items-center text-white font-semibold justify-around w-1/4'>
            <div className='bg-[#002A43] h-1/2 w-4/6 p-2 flex flex-col items-center justify-around rounded-3xl'>
              <div className='w-full flex bg-yellow-500'>
                <img src={fincasIcon} alt="" className='mr-1 w-5 h-6' />
                <h2>Contenedor Fincas</h2>
              </div>
                <div className='bg-red-500'>
                  <img src={finca} alt="" />
                </div>
            </div>
            <div className='bg-[#002A43] h-2/5 p-2 w-4/6 rounded-3xl'>
              <div className='flex bg-yellow-500'>
                <img src={sensoresIcon} alt="" className='mr-1 w-5 h-6' />
                <h2>Contenedor fincas</h2>
              </div>
            </div>
          </div>
          <div className='bg-green-300 flex flex-col py-7 items-center w-1/2'>
            <div className='bg-[#002A43] w-3/4 h-full rounded-3xl flex flex-col items-center text-white p-4'>
              <h3 className='font-bold text-xl mt-1'>Registro Actividades</h3>
              <Tabla
              titulo={"probando"}
              columnas={columnas}
              datos={[]}
              acciones={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default PerfilUsuario
