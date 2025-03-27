import React, { useEffect, useState } from 'react'
import { getActividadesByZona,getZonasById } from '../../../../services/fincas/ApiFincas'
import { useParams } from 'react-router-dom'
import MostrarInfo from '../../../../components/mostrarInfo';
import Navbar from '../../../../components/navbar';

//Iconos para acciones
import verTodo from '../../../../assets/icons/sinFincas.png'
import eliminarIcon from '../../../../assets/icons/deleteWhite.png'


function ActividadesZonas() {
    const { id } = useParams();
    const [actividades,setActividades] = useState([]);
    const [zonas,setZonas] = useState([]);


    useEffect(() => {
        getActividadesByZona(id)
            .then((data) => {
                console.log(data)
                setActividades(data)
        })
        getZonasById(id)
        .then((data) => {
            console.log(data)
            setZonas(data)})
        
    },[id]);

    const columnas = [
        { key: "cultivo", label: "Cultivo" },
        { key: "etapa", label: "Etapa" },
    ];

    const acciones = (fila) => (
        <div className="flex justify-center gap-2">
          <div className="relative group">
            <button
              className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            //   onClick={() => HandleAgregarActividad(fila.id)}
            >
              <img src={verTodo} alt="Agregar Actividad" className="w-5 h-5" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver Todo
            </span>
          </div>
          <div className="relative group">
            <button
              className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            //   onClick={() => HandleEditarZona(fila)}
            >
              <img src={eliminarIcon} alt="Eliminar" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Eliminar
            </span>
          </div>
        </div>
      );


    return (
        <div> 
             <Navbar />
            <MostrarInfo
                titulo={`Actividades de: ${zonas.nombre}`}
                columnas={columnas}
                datos={Array.isArray(actividades) ? actividades : []}
                acciones={acciones}
                mostrarAgregar={true}
            />
        </div>
    )

}
export default ActividadesZonas