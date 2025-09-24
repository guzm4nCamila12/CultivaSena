import { useState } from "react";
import { login } from "../services/usuarios/ApiUsuarios";
import { editarUsuario } from "../services/usuarios/ApiUsuarios";
import { useNavigate } from "react-router-dom";
import { acctionSucessful } from "../components/alertSuccesful"
import { Alerta } from "../assets/img/imagesExportation";
import { jwtDecode } from "jwt-decode";
import cerrar from "../assets/img/sesionFinalizada.png"
export function useLogin() {
    const [errorMensaje, setErrorMensaje] = useState("");
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
            if(resultado.status === 401){
                setErrorMensaje(resultado)
            }
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
                 acctionSucessful.fire({
                    imageUrl: Alerta,
                    imageAlt: "Icono de error",
                    title: resultado.error
                })
            }
        } catch (error) {
            console.error("No se pudo iniciar sesion:", error)
            
        }
    }

    const logout = async () => {
        try {
            const token = localStorage.getItem("session")
            const userId = localStorage.getItem("user");
             // Decodificar el token para ver si ya expiró
            let isExpired = false;

            if (!token || !userId) {
                console.warn("No hay sesión activa para cerrar");
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Math.floor(Date.now() / 1000); // segundos
                if (decoded.exp && decoded.exp < now) {
                    isExpired = true;
                }
            } catch (err) {
                console.error("Token inválido o no decodificable", err);
                isExpired = true;
            }
            // Si no está expirado, actualizar en el backend
            await editarUsuario(userId, { token: "" }, userId);
            if (!isExpired) {
                acctionSucessful.fire({
                    imageUrl: cerrar,
                    title: "¡Sesión cerrada correctamente!",
                });
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