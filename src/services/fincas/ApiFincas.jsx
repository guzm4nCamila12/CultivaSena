import { obtenerIdUsuario, obtenerFinca } from '../../hooks/useDecodeToken';
//URL donde esta alojado el servidor
const API_URL = process.env.REACT_APP_API_URL;

// Consumo al api para obtener todas las fincas de un usuario por su id
export const getFincasById = async (id) => {
  const response = await fetch(`${API_URL}/fincas/${id}`);
  return response.json();
};
// Consumo al api para obtener una finca por su id
export const getFincasByIdFincas = async (id) => {
  const response = await fetch(`${API_URL}/api/fincas/${id}`);
  return response.json();
};
//Ontener la cantidad de fincas en la aplicacion
export const getCountFincas = async () => {
  const response = await fetch(`${API_URL}/api/fincas/count`);
  return response.json();
};
//obtener la cantidad de zonas de una finca
export const getCountZonasByFinca = async () => {
  const response = await fetch(`${API_URL}/api/zonas/count/${obtenerFinca()}`);
  return response.json();
};
// Consumo al api para crear una finca
export const crearFinca = async (nuevaFinca) => {
  const response = await fetch(`${API_URL}/api/fincas/${obtenerIdUsuario()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaFinca),
  });
  return response.json();
};
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
export const eliminarFincas = async (id) => {
  await fetch(`${API_URL}/api/fincas/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });
};
// Consumo al api para obtener una zona por el id de la finca
export const getZonasByIdFinca = async (id) => {
  const response = await fetch(`${API_URL}/zonas/${id}`);
  return response.json();
};
// Consumo al api para crear una zona
export const crearZona = async (nuevaZona) => {
  const response = await fetch(`${API_URL}/api/zonas/${obtenerIdUsuario()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaZona),
  });
  return response.json();
};


export const editarZona = async (id, zonaActualizada) => {
  const response = await fetch(`${API_URL}/api/zonas/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zonaActualizada),
  });
  return response;

};

export const eliminarZonas = async (id) => {
  await fetch(`${API_URL}/api/zonas/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });
};

//Consumo al api para crear una actividad
export const crearActividad = async (nuevaActividad) => {
  const response = await fetch(`${API_URL}/api/registro_actividades/${obtenerIdUsuario()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaActividad),
  });
  return response.json();
};

// Consumo al api para actualizar una actividad
export const editarActividad = async (id, actividadActualizada) => {
  const response = await fetch(`${API_URL}/api/registro_actividades/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actividadActualizada),
  });
  return response;

};

export const eliminarActividad = async (id) => {
  await fetch(`${API_URL}/api/registro_actividades/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });
}

export const getZonasById = async (id) => {
  const response = await fetch(`${API_URL}/api/zonas/${id}`);
  return response.json();
};

export const getActividadesByZona = async (id) => {
  const response = await fetch(`${API_URL}/zonas/actividades/${id}`);
  return response.json();
};

export const getActividadesByUsuario = async (id) => {
  const response = await fetch(`${API_URL}/actividades/usuario/${id}`);
  return response.json();
}

export const getActividadesTotales = async (id) => {
  const response = await fetch(`${API_URL}/actividades/totales/${id}`);
  return response.json();
};
