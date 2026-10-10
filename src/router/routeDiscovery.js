/**
 * Convierte una ruta de archivo dentro de /src/pages a una ruta de React Router
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

  // Manejo de comodín 404
  if (normalizada === '404' || normalizada.toLowerCase() === 'notfound') {
    return '*';
  }

  // Manejo de parámetros dinámicos [param] -> :param
  normalizada = normalizada.replace(/\[([^\]]+)\]/g, ':$1');

  // Quitar /index al final o si es solo index
  if (normalizada === 'index') {
    return '/';
  }

  normalizada = normalizada.replace(/\/index$/, '');

  // Asegurar que comience con /
  if (!normalizada.startsWith('/')) {
    normalizada = '/' + normalizada;
  }

  return normalizada;
}

// Alias en inglés para compatibilidad con tests
export const convertPathToRoute = convertirRutaEnPath;

/**
 * Descubre y transforma los módulos obtenidos con import.meta.glob en una lista de rutas ordenadas
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

  // Ordenar rutas:
  // 1. Rutas fijas primero
  // 2. Rutas dinámicas (:id) después
  // 3. Comodín (*) al final
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

// Alias en inglés para compatibilidad con tests y router
export const discoverRoutes = descubrirRutas;
