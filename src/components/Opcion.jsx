import React, { useState, useEffect } from 'react'; // Asegúrate de importar 'useEffect'
import OpcionTabla from "../assets/icons/OpcionTabla.png";
import OpcionTarjeta from "../assets/icons/OpcionTarjetas.png";
import Tabla from './Tabla'; // Asegúrate de que la ruta esté bien
import UserCards from './UseCards'; // Asegúrate de que la ruta esté bien
import { getUsuarios } from "../services/usuarios/ApiUsuarios"; // Asegúrate de que la ruta y el método estén bien

function Opcion({ onChangeVista, columnas, acciones, obtenerRol, setModalInsertarAbierto }) {
    const [vistaActiva, setVistaActiva] = useState('tabla');
    const [usuarios, setUsuarios] = useState([]);
  
    useEffect(() => {
        getUsuarios()
          .then((data) => {
            console.log("Usuarios obtenidos:", data); // Verifica si los datos son correctos
            setUsuarios(data || []);
          })
          .catch((error) => {
            console.error("Error al obtener usuarios:", error);
            setUsuarios([]);
          });
      }, []);
      
  
    const handleVistaChange = (vista) => {
      setVistaActiva(vista);
      onChangeVista(vista);
    };
  
    return (
      <div>
        <div className="flex items-center mb-4">
          <div className="flex w-28 rounded-full border-4 border-gray-200 overflow-hidden">
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tabla' ? 'bg-white' : 'bg-[#93A6B2]'}`}
              onClick={() => handleVistaChange('tabla')}
            >
              <img src={OpcionTabla} alt="Lista" />
            </button>
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tarjetas' ? 'bg-white' : 'bg-[#93A6B2]'}`}
              onClick={() => handleVistaChange('tarjetas')}
            >
              <img src={OpcionTarjeta} alt="Tarjetas" />
            </button>
          </div>
        </div>
  
        {/* Renderizar Tabla o UserCards dependiendo de la vista activa */}
        {/* {vistaActiva === 'tabla' ? (
          <Tabla
          titulo="Usuarios registrados"
          columnas={columnas}
          datos={usuarios && Array.isArray(usuarios) ? usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) })) : []}
          acciones={acciones}
          onAddUser={() => setModalInsertarAbierto(true)}
          mostrarAgregar={true}
        />
        
        ) : (
            <UserCards
            titulo="Usuarios registrados"
            columnas={columnas}
            datos={usuarios && Array.isArray(usuarios) ? usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) })) : []}
            acciones={acciones}
            onAddUser={() => setModalInsertarAbierto(true)}
            mostrarAgregar={true}
          />
          
        )} */}
      </div>
    );
  }
  
export default Opcion;
