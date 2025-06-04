import { jwtDecode } from 'jwt-decode'
//Variable que almacena la url base del localhost para concatenar a los endpoints
const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todos los sensores de la finca a la cual pertenece el ID
export const getSensoresById = async (id) => {
  const response = await fetch(`${API_URL}/sensores/${id}`);
  return response.json();
};
//funcion para obtener los sensores de manera individual por su propio ID
export const getSensor = async (id) => {
  const response = await fetch(`${API_URL}/api/sensores/${id}`);
  return response.json();
};

export const getTiposSensor = async () => {
  const response = await fetch(`${API_URL}/api/tipos_sensores`);
  return response.json();
};

export const getTipoSensorById = async (id) => {
  const response = await fetch(`${API_URL}/api/tipos_sensores/${id}`);
  return response.json();
};

//Funcion para agregar un sensor a su respectiva finca
export const crearSensor = async (nuevaFinca) => {
  const token = localStorage.getItem('token')
  const decodedToken = token ? jwtDecode(token) : {}
  const idUsuario = decodedToken.id
  const response = await fetch(`${API_URL}/api/sensores/${idUsuario}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaFinca),
  });
  return response.json();
};
//Funcion para actualizar la informacion de un sensor ya existente
export const editarSensor = async (id, fincaActualizada) => {
  const token = localStorage.getItem('token')
  const decodedToken = token ? jwtDecode(token) : {}
  const idUsuario = decodedToken.id
  const response = await fetch(`${API_URL}/api/sensores/${id}/${idUsuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fincaActualizada),
  });
  
};

export const getCantidadSensores = async (id) => {
  const response = await fetch(`${API_URL}/cantidad/sensores/${id}`);
  return response.json();
};

//Funcion para eliminar un sensor de la finca
export const eliminarSensores = async (id) => {
  const token = localStorage.getItem('token')
  const decodedToken = token ? jwtDecode(token) : {}
  const idUsuario = decodedToken.id
  await fetch(`${API_URL}/api/sensores/${id}/${idUsuario}`, { method: "DELETE" });
};

//Funcion para simular la lectura de datos del sensor a partir de su MAC
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

    // Si la respuesta es JSON
    if (contentType && contentType.includes("application/json")) {
      // Parseamos la respuesta JSON
      const data = await response.json();
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
export const getHistorialSensores = async (mac) => {
  const response = await fetch(`${API_URL}/historial/sensores/${mac}`);
  return response.json();
};

export const activarDatosSensor = async (mac) => {
 await fetch (`${API_URL}/prueba/${mac}`);
}

// Función para obtener todos los sensores de la finca a la cual pertenece el ID
export const getSensoresZonasById = async (id) => {
  const response = await fetch(`${API_URL}/sensoreszona/${id}`);
  return response.json();
};
