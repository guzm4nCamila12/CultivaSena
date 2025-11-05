// fetchHelpers.js
/* global globalThis */
const API_URL = process.env.REACT_APP_API_URL;
export async function fetchConToken(endpoint, opciones = {}) {
  const token = localStorage.getItem("session");
  const config = {
    ...opciones,
    headers: {
      ...(opciones.headers && { ...opciones.headers }),
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json"
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("session");
    localStorage.removeItem("userId");
    globalThis.location.href = "/login";
    return null;
  }

  if (response.status !== 204) {
    return await response.json();
  }
  return null;
}

export async function fetchConTokenFormData(endpoint, opciones = {}) {
  const token = localStorage.getItem("session");
  // Detectar si es la ruta de InsertarNoticias ya que esta no necesita configuracion
  const config = {
    ...opciones,
    headers: {
      ...(opciones.headers && { ...opciones.headers }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("session");
    localStorage.removeItem("userId");
    globalThis.location.href = "/login";
    return null;
  }
  if (response.status !== 204) {
    return await response.json();
  }
  if (response.status === 200) {
    return response
  }
  return response;
}
export async function fetchSinToken(endpoint, opciones = {}) {
  const config = {
    ...opciones,
    headers: {
      ...(opciones.headers && { ...opciones.headers }),
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 500) {
    localStorage.removeItem("session");
    localStorage.removeItem("userId");
    globalThis.location.href = "/login";
    return;
  }

  if (response.status !== 204) {
    return await response.json();
  }
  return response.json();
}

//cambiar el useLogin para que solo guarde un token