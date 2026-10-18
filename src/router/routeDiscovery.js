/**
 * Convierte la ubicación de una página en una dirección de la aplicación.
 * Ejemplos:
 *   /src/pages/index.jsx -> /
 *   /src/pages/productos/index.jsx -> /productos
 *   /src/pages/productos/[id].jsx -> /productos/:id
 *   /src/pages/blogs/[id].jsx -> /blogs/:id
 *   /src/pages/admin/pedidos.jsx -> /admin/pedidos
 *   /src/pages/404.jsx -> *
 *   /src/pages/NotFound.jsx -> *
 *
 * @param {string} rutaArchivo
 * @returns {string}
 */
export function convertirRutaEnPath(rutaArchivo) {
  let normalizada = rutaArchivo
    .replace(/^\/?(src\/)?pages\//, '')
    .replace(/\.(jsx|js|tsx|ts)$/, '');

  // Los archivos 404 se convierten en la ruta comodín.
  if (normalizada === '404' || normalizada.toLowerCase() === 'notfound') {
    return '*';
  }

  // Convierte parámetros como [id] al formato :id.
  normalizada = normalizada.replace(/\[([^\]]+)\]/g, ':$1');

  // Quita index del final de la ruta.
  if (normalizada === 'index') {
    return '/';
  }

  normalizada = normalizada.replace(/\/index$/, '');

  // Agrega / al inicio si falta.
  if (!normalizada.startsWith('/')) {
    normalizada = '/' + normalizada;
  }

  return normalizada;
}

// Nombre alternativo en inglés para las pruebas.
export const convertPathToRoute = convertirRutaEnPath;

/**
 * Convierte los módulos encontrados en una lista de rutas ordenadas.
 * @param {Record<string, any>} modulos
 * @returns {Array<{ path: string, Component: any, meta: any, filePath: string }>}
 */
export function descubrirRutas(modulos) {
  const rutas = [];

  for (const [rutaArchivo, exportModulo] of Object.entries(modulos)) {
    const Component = exportModulo.default;
    if (!Component) continue;

    const path = convertirRutaEnPath(rutaArchivo);
    const meta = exportModulo.meta || {};

    rutas.push({
      path,
      Component,
      meta,
      filePath: rutaArchivo,
    });
  }

  // Ordena primero las rutas fijas, luego las dinámicas y deja * al final.
  return rutas.sort((a, b) => {
    if (a.path === '*') return 1;
    if (b.path === '*') return -1;
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;

    const aEsDinamica = a.path.includes(':');
    const bEsDinamica = b.path.includes(':');
    if (aEsDinamica && !bEsDinamica) return 1;
    if (!aEsDinamica && bEsDinamica) return -1;

    return a.path.localeCompare(b.path);
  });
}

// Nombre alternativo en inglés para las pruebas.
export const discoverRoutes = descubrirRutas;
