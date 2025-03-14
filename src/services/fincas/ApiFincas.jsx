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