import React, { useState } from 'react'
import { recuperarClave } from '../services/usuarios/ApiUsuarios';
export default function useRecuperarClave() {
    const [telefonoRecuperar, setTelefono] = useState({
        telefono: ""
    })
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);

    const handleChangeRecuperar = (e) => {
        const { name, value } = e.target
        setTelefono((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const recuperar = async (e) => {
        e.preventDefault();
        setError(null);
        setExito(false);
        try {
            const data = await recuperarClave(telefonoRecuperar);
            console.log("chi:", data)
            setExito(true); // ✅ éxito

        } catch (error) {
            console.error("errorsin:", error)
        }
    }
    return [
        telefonoRecuperar,
        handleChangeRecuperar,
        recuperar,
        exito,
         error 
    ]
}
