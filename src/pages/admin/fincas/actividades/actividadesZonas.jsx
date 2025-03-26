import React, { useEffect,useState } from 'react'
import { getActividadesByZona } from '../../../../services/fincas/ApiFincas'
import { data, useParams } from 'react-router-dom'



function ActividadesZonas() {
    const { id } = useParams();

    console.log(id)

    useEffect(() => {
        getActividadesByZona(id)
        .then(data => {
            console.log(data)
        })
    });

  return (
    <div>actividadesZonas</div>
  )
}

export default ActividadesZonas