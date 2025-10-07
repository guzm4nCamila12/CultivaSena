import { obtenerIdUsuario, obtenerFinca } from '../../hooks/useDecodeToken';
import { fetchConToken, fetchConTokenFormData, fetchSinToken } from '../fetchHelpers';
//Variable que almacena la url base del localhost para concatenar a los endpoints
const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todos los sensores de la finca a la cual pertenece el ID
export const getSensoresById = async (id) =>
  fetchConToken(`/sensores/${id}`);
//funcion para obtener los sensores de manera individual por su propio ID

export const getSensor = async (id) => 
  fetchConToken(`/api/sensores/${id}`);
  
//Funcion que obtiene la cantidad de sensores que hay en una finca
export const getCountSensoresByFinca = async () => 
  fetchConToken(`/api/sensores/count/${obtenerFinca()}`);
  

export const getTipoSensor = async (id) => 
  fetchConToken(`/api/tipos_sensores/${id}`);



//Funcion para agregar un sensor a su respectiva finca
export const crearSensor = async (nuevaFinca) => 
  fetchConToken(`/api/sensores/${obtenerIdUsuario()}`, {
    method: "POST",
    body: JSON.stringify(nuevaFinca),
  });
 
//Funcion para actualizar la informacion de un sensor ya existente
export const editarSensor = async (id, fincaActualizada) => 
  fetchConToken(`/api/sensores/${id}/${obtenerIdUsuario()}`, {
    method: "PUT",
    body: JSON.stringify(fincaActualizada),
  });
  

export const getCantidadSensores = async (id) => 
  fetchConToken(`/cantidad/sensores/${id}`);


//Funcion para eliminar un sensor de la finca
export const eliminarSensores = async (id) => 
  fetchConToken(`/api/sensores/${id}/${obtenerIdUsuario()}`, { method: "DELETE" });


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

export const getHistorialSensores = async (mac) => 
  fetchSinToken(`/historial/sensores/${mac}`);


export const activarDatosSensor = async (mac) => {
 await fetch (`${API_URL}/prueba/${mac}`);
}

// Función para obtener todos los sensores de la finca a la cual pertenece el ID
export const getSensoresZonasById = async (id) => 
  fetchConToken(`/sensoreszona/${id}`);

