const API_URL = "http://localhost:3000";


export const getSensoresById = async (id) => {
  const response = await fetch(`${API_URL}/sensores/${id}`);
  return response.json();
};

export const insertarSensor = async (nuevaFinca) => {
  const response = await fetch(`${API_URL}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaFinca),
  });
  return response.json();
};

export const actualizarSensor = async (id, fincaActualizada) => {
  const response = await fetch(`${API_URL}/sensores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fincaActualizada),
  });
  
};

export const eliminarSensores = async (id) => {
  await fetch(`${API_URL}/sensores/${id}`, { method: "DELETE" });
};
