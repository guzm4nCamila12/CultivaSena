import { useState } from "react";
import { login } from "../services/usuarios/ApiUsuarios";
import { editarUsuario } from "../services/usuarios/ApiUsuarios";
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

                const formData = new FormData()
                formData.append("token", resultado.token)
                await editarUsuario(resultado.user.id, { token: resultado.token }, resultado.user.id)
                localStorage.setItem("session", resultado.token)
                localStorage.setItem("user", resultado.user.id)
                localStorage.setItem("rol", resultado.user.id_rol)

                if (resultado.user.id_rol === 1) {
                    navigate('/inicio-SuperAdmin')
                    localStorage.setItem("principal", '/inicio-SuperAdmin')
                } else if (resultado.user.id_rol === 2) {
                    navigate(`/lista-fincas/${resultado.user.id}`)
                    localStorage.setItem("principal", `/lista-fincas/${resultado.user.id}`)

                } else {
                    navigate(`/sensores-alterno/${resultado.user.id_finca}/${resultado.user.id}`)
                    localStorage.setItem("principal", `/sensores-alterno/${resultado.user.id_finca}/${resultado.user.id}`)

                }
            } else {
                console.warn("Credenciales incorrectas o respuesta inválida:", resultado);

            }
        } catch (error) {
            console.error("No se pudo iniciar sesion:", error)
        }
    }

    const logout = async () => {
        try {
            const userId = localStorage.getItem("user");
            if (userId) {
                //  Actualizamos en backend para dejar el token vacío
                await editarUsuario(userId, { token: "" }, userId);
            }

            // Limpiamos el localStorage
            localStorage.removeItem("session");
            localStorage.removeItem("user");
            navigate('/login')

            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };


    return [
        usuario,
        handleChange,
        iniciarSesion,
        logout
    ]
}