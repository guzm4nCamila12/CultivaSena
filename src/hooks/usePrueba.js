// src/hooks/useGetFincas.js
import { getFincasById } from "../services/fincas/ApiFincas";

/**
 * Devuelve la promesa con las fincas del usuario.
 * 
 * @param {number|string} idUsuario  El ID del usuario
 * @returns {Promise<Array>}         Promise que resuelve en el array de fincas
 */
export const obtenerFincas = (idUsuario) => {
  return getFincasById(idUsuario);
};
