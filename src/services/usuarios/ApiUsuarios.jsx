//URL base de la api
const API_URL = "http://localhost:3000";

//Funcion para obtener todos los usuarios
export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/api/usuario`);
  return response.json();
};

//Funcion para obtener un usuario por su ID
export const getUsuarioById = async (id) => {
  const response = await fetch(`${API_URL}/api/usuario/${id}`);
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
    // Leemos el cuerpo de la respuesta de error
    const errorText = await response.text(); // Lee el cuerpo como texto
    throw new Error(errorText); // Lanza el error con el mensaje del servidor 
  }
  const data = await response.json();

  return data;
};


  //Funcion para insertar un usuario
  export const insertarUsuario = async (nuevoUsuario) => {
    console.log(nuevoUsuario)
    const response = await fetch(`${API_URL}/api/usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
    });
    return response.json();
  };


//Funcion para actualizar un usuario existente
export const actualizarUsuario = async (id, usuarioActualizado) => {
  const response = await fetch(`${API_URL}/api/usuario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioActualizado),
  });

};

//Funcion para eliminar un usuario
export const eliminarUsuario = async (id) => {
  await fetch(`${API_URL}/api/usuario/${id}`, { method: "DELETE" });
};

// Función para verificar si el correo o teléfono ya existe
export const verificarExistenciaCorreo = async (correo) => {
  const usuarios = await getUsuarios();

  // Verifica si algún usuario tiene el mismo correo o teléfono
  const correoExistente = usuarios.find(usuario => usuario.correo === correo);

  return correoExistente;
};

export const verificarExistenciaTelefono = async (telefono) => {
  const usuarios = await getUsuarios();

  const telefonoExistente = usuarios.find(usuario => usuario.telefono === telefono);

  return telefonoExistente;
}
