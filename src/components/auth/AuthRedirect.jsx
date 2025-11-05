import { useEffect, } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { traerToken } from '../../services/usuarios/ApiUsuarios'
import { jwtDecode } from 'jwt-decode';

export default function AuthRedirect() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const verifyUser = async () => {
            const id = searchParams.get("id");
            const token = searchParams.get("token");
            if (!id || !token) {
                console.error("Error al obtener los parametros");
                navigate("/login");
                return;
            }
            try {
                const result = await traerToken(id);
                if (result.token == token) {
                    const decode = jwtDecode(result.token);
                    if (decode.idRol  == 1) {
                    navigate('/inicio-SuperAdmin')
                    localStorage.setItem("principal", '/inicio-SuperAdmin')
                } else if (decode.idRol == 2) {
                    navigate(`/lista-fincas/${decode.id}`)
                    localStorage.setItem("principal", `/lista-fincas/${decode.id}`)
                } else {
                    navigate(`/sensores-alterno/${decode.id_finca}/${decode.id}`)
                    localStorage.setItem("principal", `/sensores-alterno/${decode.id_finca}/${decode.id}`)
                }
                    localStorage.setItem("rol", decode.idRol)

                    localStorage.setItem("session", result.token)
                    localStorage.setItem("user", id)
                    navigate("/perfil-usuario");
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("errorcin:", error);
            }
        }
        verifyUser();
    }, [])
    return (
        <div>Validando sesion...</div>
    )
}
