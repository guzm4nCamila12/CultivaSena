import React, { useState } from 'react'
import { restablecerClave } from '../services/usuarios/ApiUsuarios';
export default function useRestablecer(propToken) {
    const [NuevaClave, setNuevaClave] = useState({
        token: propToken || "",
        nueva_clave: ""
    });
    const handleChange = (e) =>{
        console.log("nueva clave:", NuevaClave.nueva_clave)
        const {name, value} = e.target
        setNuevaClave((prev) =>({
            ...prev,
            [name]: value
        }))
    }

    const restablecer = async (e) =>{
        e.preventDefault();
        try {
            const data = await restablecerClave(NuevaClave);
            console.log("chi:", data)
        } catch (error) {
            error(error)
        }
    }
 return [
    NuevaClave,
    handleChange,
    restablecer
  ]
   
  
}
