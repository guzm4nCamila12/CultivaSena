//URL base de la api
const API_URL = "http://localhost:3000";

//Funcion para obtener todos los usuarios
export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/usuarios`);
  return response.json();
};

//Funcion para obtener un usuario por su ID
export const getUsuarioById = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`);
  return response.json();
};

//Funcion para obtener un usuario por su ID pero con rol alterno
export const getUsuarioByIdRol = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/alterno/${id}`);
  return response.json();
};

//Funcion para iniciar sesion
export const login = async (inicioUsuario) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  // Especificamos que el cuerpo es JSON
    },
    body: JSON.stringify(inicioUsuario),  // Convertimos los datos a JSON
  });

  //Verifica si la respuesta es exitosa
  if (!response.ok) {
    throw new Error("Error en el inicio de sesión");
  }
  const data = await response.json();

  return data;
};

//Funcion para insertar un usuario
export const insertarUsuario = async (nuevoUsuario) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoUsuario),
  });
  return response.json();
};

//Funcion para actualizar un usuario existente
export const actualizarUsuario = async (id, usuarioActualizado) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioActualizado),
  });

};

//Funcion para eliminar un usuario
export const eliminarUsuario = async (id) => {
  await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
};