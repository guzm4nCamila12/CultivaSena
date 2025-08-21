import { traerToken } from "../services/Endpoints";
import { jwtDecode } from "jwt-decode";
//si hay un token activo 
export const mantenerSesion = async () => {
    const tokenLocal = localStorage.getItem("session");
    if (tokenLocal) {
        const decode = jwtDecode(tokenLocal)
        const result = await traerToken(decode.id)

        return result.token == tokenLocal
    }
    return false
}