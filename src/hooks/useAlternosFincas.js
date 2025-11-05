// hooks/useAlternosFinca.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUsuarioByIdRol } from "../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas } from "../services/fincas/ApiFincas";

const useAlternosFinca = () => {
  const { id } = useParams();

  const [fincas, setFincas] = useState({});
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarioByIdRol(id).then(data => setUsuarios(data || [])).catch(console.error);
    getFincasByIdFincas(id).then(data => setFincas(data));
  }, [id]);

  return {
    id,
    fincas,
    usuarios,
  };
};

export default useAlternosFinca;
