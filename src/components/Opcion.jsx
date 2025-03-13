import React, { useState, useEffect } from 'react'; // Asegúrate de importar 'useEffect'
import OpcionTabla from "../assets/icons/OpcionTabla.png";
import OpcionTarjeta from "../assets/icons/OpcionTarjetas.png";
import Tabla from './Tabla'; // Asegúrate de que la ruta esté bien
import UserCards from './UseCards'; // Asegúrate de que la ruta esté bien
import { getUsuarios } from "../services/usuarios/ApiUsuarios"; // Asegúrate de que la ruta y el método estén bien

function Opcion({ onChangeVista, columnas, acciones, obtenerRol, setModalInsertarAbierto }) {
    // Estado para controlar la vista activa
    const [vistaActiva, setVistaActiva] = useState('tabla');
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Suponiendo que traes usuarios de una API
        getUsuarios().then((data) => {
          setUsuarios(data || []); // Si no hay datos, asegúrate de pasar un array vacío
        }).catch((error) => {
          console.error("Error al obtener usuarios:", error);
          setUsuarios([]); // Si hay error, pasamos un array vacío
        });
    }, []); // Este useEffect se ejecuta solo una vez al montar el componente

    // Función para manejar el cambio entre vistas
    const handleVistaChange = (vista) => {
      setVistaActiva(vista);
      onChangeVista(vista); // Llamamos al callback para actualizar la vista en el componente principal
    };

    return (
      <div>
        <div className="flex items-center mb-4">
          <div className="flex w-28 rounded-full border-4 border-gray-200 overflow-hidden">
            {/* Botón de Lista - Activa */}
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tabla' ? 'bg-white' : 'bg-[#93A6B2]'}`}
              onClick={() => handleVistaChange('tabla')}
            >
              <img src={OpcionTabla} alt="Lista" />
            </button>
            {/* Botón de Tarjetas - Inactiva */}
            <button
              className={`flex-1 flex justify-center items-center p-2 ${vistaActiva === 'tarjetas' ? 'bg-white' : 'bg-[#93A6B2]'}`}
              onClick={() => handleVistaChange('tarjetas')}
            >
              <img src={OpcionTarjeta} alt="Tarjetas" />
            </button>
          </div>
        </div>

        {/* Renderizamos el componente correspondiente según la vista activa */}
        {vistaActiva === 'tabla' ? (
          <Tabla
            titulo="Usuarios registrados"
            columnas={columnas}
            datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
            acciones={acciones}
            onAddUser={() => setModalInsertarAbierto(true)}
            mostrarAgregar={true}
          />
        ) : (
          <UserCards
            titulo="Usuarios registrados"
            columnas={columnas}
            datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
            acciones={acciones}
            onAddUser={() => setModalInsertarAbierto(true)}
            mostrarAgregar={true}
          />
        )}
      </div>
    );
}

export default Opcion;
