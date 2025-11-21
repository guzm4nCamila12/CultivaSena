// hooks/useUsuarios.js
import { useEffect, useState } from "react";
import { getUsuarios } from "../services/usuarios/ApiUsuarios";

export const useUsuarios = (id) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  // Función para traer todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      const admins = data.filter((u) => u.id_rol === 2);
      setUsuariosAdmin(admins);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    }
  };

  // Cargar usuarios al montar o si cambia el id
  useEffect(() => {
    fetchUsuarios();
  }, [id]);

  return { usuarios, usuariosAdmin };
};