import { useState } from 'react'
import { recuperarClave } from '../services/usuarios/ApiUsuarios';
import { acctionSucessful } from '../components/alertSuccesful';
import alerta from '../assets/img/alerta.png'

export default function useRecuperarClave() {
    const [telefonoRecuperar, setTelefonoRecuperar] = useState({
        telefono: ""
    })
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);

    const handleChangeRecuperar = (e) => {
        const { name, value } = e.target
        setTelefonoRecuperar((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const recuperar = async (e) => {
        e.preventDefault();
        if (!telefonoRecuperar.telefono){
            acctionSucessful.fire({
                title:'¡Ingrese el telefono!',
                imageUrl: alerta
            })
        }
        setError(null);
        setExito(false);
        try {
            await recuperarClave(telefonoRecuperar);
            setExito(true); 

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
