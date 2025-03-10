const API_URL = "http://localhost:3000";

export const getSensoresById = async (id) => {
  const response = await fetch(`${API_URL}/sensores/${id}`);
  return response.json();
};

export const getSensor = async (id) => {
  const response = await fetch(`${API_URL}/sensoresid/${id}`);
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

export const insertarDatos = async (mac) => {
  try {
    // Realizamos la petición al endpoint con el MAC del sensor
    const response = await fetch(`${API_URL}/api/sensores/simulacion/${mac}`);
    
    // Verificamos si la respuesta fue exitosa (status 200-299)
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText} (Código de estado: ${response.status})`);
    }

    // Obtener el tipo de contenido de la respuesta
    const contentType = response.headers.get("Content-Type");
    console.log("Tipo de contenido:", contentType);

    // Si la respuesta es JSON
    if (contentType && contentType.includes("application/json")) {
      // Parseamos la respuesta JSON
      const data = await response.json();
      console.log("Datos JSON recibidos:", data);
      return data;
    } else {
      // Si la respuesta no es JSON, la mostramos como texto
      const text = await response.text();
      console.error("La respuesta no es JSON, es:", text);
      throw new Error("La respuesta del servidor no es un JSON válido");
    }
  } catch (error) {
    // Si ocurre un error, lo mostramos en la consola
    console.error("Error al realizar la solicitud:", error);
    throw error; // También lanzamos el error para que el llamador lo pueda manejar
  }
};
