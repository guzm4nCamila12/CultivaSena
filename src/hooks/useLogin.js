import { useState } from "react";
import { login } from "../services/usuarios/ApiUsuarios";
import { crearUsuario, editarUsuario } from "../services/usuarios/ApiUsuarios";
import { useNavigate } from "react-router-dom";
export function useLogin() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        telefono: '',
        clave: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const iniciarSesion = async (e) => {
        e.preventDefault()

        try {
            const resultado = await login(usuario);
            if (resultado && resultado.token) {
                console.log("✅ Inicio de sesión exitoso");

                const formData = new FormData()
                formData.append("token", resultado.token)
                const result = await editarUsuario(resultado.user.id, { token: resultado.token }, resultado.user.id)
                localStorage.setItem("session", resultado.token)
                localStorage.setItem("user", resultado.user.id)

                navigate('/inicio-SuperAdmin')
            } else {
                console.warn("⚠️ Credenciales incorrectas o respuesta inválida:", resultado);

            }
        } catch (error) {
            console.error("No se pudo iniciar sesion:", error)
        }
    }

    return [
        usuario,
        handleChange,
        iniciarSesion
    ]
}