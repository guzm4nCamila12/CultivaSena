import { useState } from "react";
import { login } from "../services/usuarios/ApiUsuarios";
import { crearUsuario, editarUsuario } from "../services/usuarios/ApiUsuarios";
import { useNavigate } from "react-router-dom";
import { acctionSucessful } from "../components/alertSuccesful";
import { error } from "../assets/icons/IconsExportation";
import { inicioSesion } from "../assets/img/imagesExportation";
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
        if (!usuario.telefono || !usuario.clave) {
            acctionSucessful.fire({
                imageUrl: estadoRechazado,
                imageAlt: "Icono de error",
                title: `Complete todos los campos`
            })
            return
        }
        try {
            const resultado = await login(usuario);
            if (resultado && resultado.token) {
                console.log("Inicio de sesión exitoso");
                console.log(resultado);

                const formData = new FormData()
                formData.append("token", resultado.token)
                const result = await editarUsuario(resultado.user.id, { token: resultado.token }, resultado.user.id)
                localStorage.setItem("session", resultado.token)
                localStorage.setItem("user", resultado.user.id)
                localStorage.setItem("rol", resultado.user.id_rol)

                if (resultado.user.id_rol == 1) {
                    navigate('/inicio-SuperAdmin')
                    localStorage.setItem("principal", '/inicio-SuperAdmin')
                } else if (resultado.user.id_rol == 2) {
                    navigate(`/lista-fincas/${resultado.user.id}`)
                    localStorage.setItem("principal", `/lista-fincas/${resultado.user.id}`)

                } else {
                    console.log(resultado.user.id_rol);
                    navigate(`/sensores-alterno/${resultado.user.id_finca}/${resultado.user.id}`)
                    localStorage.setItem("principal", `/sensores-alterno/${resultado.user.id_finca}/${resultado.user.id}`)

                }
                acctionSucessful.fire({
                    imageUrl: inicioSesion,
                    imageAlt: "Icono de exito",
                    title: `Bienvenido usuario`
                });
            } else {
                acctionSucessful.fire({
                    imageUrl: error,
                    imageAlt: "Icono de error",
                    title: resultado.error
                });
            }
        } catch (responseError) {
            acctionSucessful.fire({
                imageUrl: error,
                imageAlt: "Icono de error",
                title: 'Usuario no econtrado'
            });
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
            console.log("Sesión cerrada");

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