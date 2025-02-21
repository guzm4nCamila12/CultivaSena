const API_URL = "http://localhost:3000";


export const getFincasById = async (id) => {
  const response = await fetch(`${API_URL}/fincas/${id}`);
  return response.json();
};

export const getFincasByIdFincas = async (id) => {
    const response = await fetch(`${API_URL}/fincasid/${id}`);
    return response.json();
  };

export const insertarFinca = async (nuevaFinca) => {
  const response = await fetch(`${API_URL}/fincas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaFinca),
  });
  return response.json();
};

export const actualizarFinca = async (id, fincaActualizada) => {
  const response = await fetch(`${API_URL}/fincas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fincaActualizada),
  });
  return response;
  
};

export const eliminarFincas = async (id) => {
  await fetch(`${API_URL}/fincas/${id}`, { method: "DELETE" });
};
