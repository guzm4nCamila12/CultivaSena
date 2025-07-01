import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import MostrarInfo from '../../components/mostrarInfo';
import ConfirmationModal from '../../components/confirmationModal/confirmationModal';
import { useFincas } from '../../hooks/useFincas';
import { fincasIcon, zonasIcon, sensoresIcon, alternos, ajustes, editar, eliminar } from '../../assets/icons/IconsExportation';
import { Link } from 'react-router-dom';

import {fincaDriverSteps} from '../../utils/aplicationSteps';
import { useDriverTour } from '../../hooks/useTourDriver';

export default function ListaFincas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fincas,
    usuario,
    modalEliminarAbierto,
    nombreFincaEliminar,
    abrirModalEliminar,
    handleEliminarFinca,
    setModalEliminarAbierto,
  } = useFincas(id);

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: fincasIcon },
    { key: "zonas", label: "Zonas", icon: zonasIcon, icon2: zonasIcon },
    { key: "sensores", label: "Sensores", icon: sensoresIcon, icon2: sensoresIcon },
    { key: "alternos", label: "Alternos", icon: alternos, icon2: alternos },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  useDriverTour(fincaDriverSteps);

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div id='editarSteps'  className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={editar} alt="Editar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      <div id='eliminarSteps' className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={eliminar} alt="Eliminar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  const fincasConSensores = fincas.map(finca => ({
    ...finca,
    sensores: (
      <Link to={`/activar-sensores/${finca.id}/${id}`}>
        <button className="group relative">
          <div id='sensoresSteps' className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver sensores
          </span>
        </button>
      </Link>
    ),
    alternos: (
      <Link to={`/alternos/${finca.id}`}>
        <button className="group relative">
          <div id='alternosSteps' className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver alternos
          </span>
        </button>
      </Link>
    ),
    zonas: (
      <Link to={`/zonas/${finca.id}/${id}`}>
        <button className="group relative">
          <div id='zonasSteps'  className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver zonas
          </span>
        </button>
      </Link>
    )
  }));


  return (
    <div>
      <Navbar />
      <MostrarInfo
        titulo={`Fincas de: ${usuario.nombre}`}
        columnas={columnas}
        datos={Array.isArray(fincasConSensores) ? fincasConSensores : []}
        acciones={acciones}
        onAddUser={() => navigate(`/agregar-finca/${usuario.id}`)}
        mostrarAgregar={true}
      />
      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarFinca}
        title="Eliminar finca"
        message={
          <>
            ¿Estás seguro?<br />
            <span className='text-gray-400'>
              Se eliminará la finca <strong className="text-red-600">{nombreFincaEliminar}</strong> de manera permanente.
            </span>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
}
