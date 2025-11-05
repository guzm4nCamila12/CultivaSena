import { obtenerIdUsuario, obtenerFinca } from '../../hooks/useDecodeToken';
import { fetchConToken } from '../fetchHelpers';

//URL donde esta alojado el servidor
const API_URL = process.env.REACT_APP_API_URL;

// Consumo al api para obtener todas las fincas de un usuario por su id
export const getFincasById = async (id) => 
 fetchConToken(`/fincas/${id}`);

// Consumo al api para obtener una finca por su id
export const getFincasByIdFincas = async (id) => 
 fetchConToken(`/api/fincas/${id}`);

//Ontener la cantidad de fincas en la aplicacion
export const getCountFincas = async () => 
  fetchConToken(`/api/fincas/count`);
  
//obtener la cantidad de zonas de una finca
export const getCountZonasByFinca = async () => 
  fetchConToken(`/api/zonas/count/${obtenerFinca()}`);
 
// Consumo al api para crear una finca
export const crearFinca = async (nuevaFinca) => 
  fetchConToken(`/api/fincas/${obtenerIdUsuario()}`, {
    method: "POST",
    body: JSON.stringify(nuevaFinca),
  });

// Consumo al api para actualizar una finca
export const editarFinca = async (id, fincaActualizada) => {
  const response = await fetch(`${API_URL}/api/fincas/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fincaActualizada),
  });
  return response;

};
// Consumo al api para eliminar una finca
export const eliminarFincas = async (id) => 
  fetchConToken(`/api/fincas/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });

// Consumo al api para obtener una zona por el id de la finca
export const getZonasByIdFinca = async (id) => 
  fetchConToken(`/zonas/${id}`);

// Consumo al api para crear una zona
export const crearZona = async (nuevaZona) => 
  fetchConToken(`/api/zonas/${obtenerIdUsuario()}`, {
    method: "POST",
    body: JSON.stringify(nuevaZona),
  })


export const editarZona = async (id, zonaActualizada) => 
  fetchConToken(`/api/zonas/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    body: JSON.stringify(zonaActualizada),
  });


export const eliminarZonas = async (id) => 
  fetchConToken(`/api/zonas/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });


//Consumo al api para crear una actividad
export const crearActividad = async (nuevaActividad) => 
  fetchConToken(`/api/registro_actividades/${obtenerIdUsuario()}`, {
    method: "POST",
    body: JSON.stringify(nuevaActividad),
  });

// Consumo al api para actualizar una actividad
export const editarActividad = async (id, actividadActualizada) => 
  fetchConToken(`/api/registro_actividades/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    body: JSON.stringify(actividadActualizada),
  });


export const eliminarActividad = async (id) => 
  fetchConToken(`/api/registro_actividades/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });


export const getZonasById = async (id) => 
  fetchConToken(`/api/zonas/${id}`);

export const getActividadesByZona = async (id) => 
  fetchConToken(`/zonas/actividades/${id}`);
  

export const getActividadesByUsuario = async (id) => 
  fetchConToken(`/actividades/usuario/${id}`);
 

export const getActividadesTotales = async (id) => 
  fetchConToken(`/actividades/totales/${id}`);
 
