//URL donde esta alojado el servidor
const API_URL = "http://localhost:3000";

// Consumo al api para obtener todas las fincas de un usuario por su id
export const getFincasById = async (id) => {
  const response = await fetch(`${API_URL}/fincas/${id}`);
  return response.json();
};
// Consumo al api para obtener una finca por su id
export const getFincasByIdFincas = async (id) => {
    const response = await fetch(`${API_URL}/fincasid/${id}`);
    return response.json();
  };
// Consumo al api para crear una finca
export const insertarFinca = async (nuevaFinca) => {
  const response = await fetch(`${API_URL}/fincas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaFinca),
  });
  return response.json();
};
// Consumo al api para actualizar una finca
export const actualizarFinca = async (id, fincaActualizada) => {
  const response = await fetch(`${API_URL}/fincas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fincaActualizada),
  });
  return response;
  
};
// Consumo al api para eliminar una finca
export const eliminarFincas = async (id) => {
  await fetch(`${API_URL}/fincas/${id}`, { method: "DELETE" });
};
// Consumo al api para obtener una zona por el id de la finca
export const getZonasByIdFinca = async (id) => {
  const response = await fetch(`${API_URL}/zonas/${id}`);
  return response.json();
};
// Consumo al api para crear una zona
export const insertarZona = async (nuevaZona) => {
const response = await fetch(`${API_URL}/zonas`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(nuevaZona),
});
return response.json();
};


export const actualizarZona = async (id, zonaActualizada) => {
  const response = await fetch(`${API_URL}/zonas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zonaActualizada),
  });
  return response;
  
};

export const eliminarZonas = async (id) => {
  await fetch(`${API_URL}/zonas/${id}`, { method: "DELETE" });
};

//Consumo al api para crear una actividad
export const insertarActividad = async (nuevaActividad) => {
  const response = await fetch(`${API_URL}/zona/actividad`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaActividad),
  });
  return response.json();
  };

