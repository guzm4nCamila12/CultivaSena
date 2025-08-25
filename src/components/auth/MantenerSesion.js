// RedirigirSesion.jsx
import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { traerToken } from "../../services/usuarios/ApiUsuarios";
export default function RedirigirSesion() {
  const { id } = useParams();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const iniciarSesion = async () => {
      try {
        const ok = await traerToken(id);
        if (ok) {
          setReady(true);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error en mantenerSesion:", err);
        setError(true);
      }
    };

    if (id) iniciarSesion();
  }, [id]);

  if (error) {
    return <div>Error iniciando sesión...</div>;
  }

  // Cuando el token ya se guardó, redirige
  if (ready) {
    return <Navigate to="/perfil-usuario" />;
  }

  return <div>Cargando sesión...</div>;
}
