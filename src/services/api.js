/**
 * Cliente HTTP centralizado para comunicar el frontend con el backend Spring Boot.
 * Gestiona la URL base, encabezados y el token JWT de las peticiones.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';

/**
 * Obtiene el token de autenticación guardado en el navegador, si existe.
 */
function obtenerToken() {
  const tokenDirecto = localStorage.getItem('tokenForkMenu');
  if (tokenDirecto) return tokenDirecto;

  try {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    return usuarioActivo?.token || null;
  } catch {
    return null;
  }
}

/**
 * Ejecuta una petición HTTP genérica utilizando fetch nativo.
 */
async function peticion(endpoint, opciones = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = obtenerToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opciones.headers,
  };

  const configuracion = {
    ...opciones,
    headers,
  };

  try {
    const respuesta = await fetch(url, configuracion);

    // Si el servidor responde 204 No Content
    if (respuesta.status === 204) {
      return null;
    }

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      // Si el backend devolvió un mensaje estructurado (MensajeRespuestaDTO o GlobalExceptionHandler)
      const mensajeError = datos?.mensaje || datos?.error || `Error ${respuesta.status}: Petición fallida`;
      const error = new Error(mensajeError);
      error.status = respuesta.status;
      error.datos = datos;
      throw error;
    }

    return datos;
  } catch (error) {
    // Si no hubo respuesta del servidor (backend apagado o problema de red)
    if (!error.status) {
      error.mensajeConexion = 'No fue posible conectar con el servidor. Verifica que el backend esté encendido.';
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, opciones) => peticion(endpoint, { method: 'GET', ...opciones }),
  post: (endpoint, body, opciones) => peticion(endpoint, { method: 'POST', body: JSON.stringify(body), ...opciones }),
  put: (endpoint, body, opciones) => peticion(endpoint, { method: 'PUT', body: JSON.stringify(body), ...opciones }),
  patch: (endpoint, body, opciones) => peticion(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...opciones }),
  delete: (endpoint, opciones) => peticion(endpoint, { method: 'DELETE', ...opciones }),
};
