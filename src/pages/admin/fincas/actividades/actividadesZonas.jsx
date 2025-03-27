import React, { useEffect, useState } from 'react'
import { getActividadesByZona,getZonasById } from '../../../../services/fincas/ApiFincas'
import { useParams } from 'react-router-dom'
import MostrarInfo from '../../../../components/mostrarInfo';
import Navbar from '../../../../components/navbar';



function ActividadesZonas() {
    const { id } = useParams();
    const [actividades,setActividades] = useState([]);
    const [zonas,setZonas] = useState([]);


    useEffect(() => {
        getActividadesByZona(id)
            .then((data) => {setActividades(data)
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


    return (
        <div> 
             <Navbar />
            <MostrarInfo
                titulo={`Actividades de: ${zonas.nombre}`}
                columnas={columnas}
                datos={Array.isArray(actividades) ? actividades : []}
                mostrarAgregar={true}

            />
        </div>
    )

}
export default ActividadesZonas