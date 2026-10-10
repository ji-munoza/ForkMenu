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
 * @param {string} filePath
 * @returns {string}
 */
export function convertPathToRoute(filePath) {
  let normalized = filePath
    .replace(/^\/?(src\/)?pages\//, '')
    .replace(/\.(jsx|js|tsx|ts)$/, '');

  // Manejo de comodín 404
  if (normalized === '404' || normalized.toLowerCase() === 'notfound') {
    return '*';
  }

  // Manejo de parámetros dinámicos [param] -> :param
  normalized = normalized.replace(/\[([^\]]+)\]/g, ':$1');

  // Quitar /index al final o si es solo index
  if (normalized === 'index') {
    return '/';
  }

  normalized = normalized.replace(/\/index$/, '');

  // Asegurar que comience con /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  return normalized;
}

/**
 * Descubre y transforma los módulos obtenidos con import.meta.glob en una lista de rutas ordenadas
 * @param {Record<string, any>} modules
 * @returns {Array<{ path: string, Component: any, meta: any, filePath: string }>}
 */
export function discoverRoutes(modules) {
  const routes = [];

  for (const [filePath, moduleExport] of Object.entries(modules)) {
    const Component = moduleExport.default;
    if (!Component) continue;

    const path = convertPathToRoute(filePath);
    const meta = moduleExport.meta || {};

    routes.push({
      path,
      Component,
      meta,
      filePath,
    });
  }

  // Ordenar rutas:
  // 1. Rutas fijas primero
  // 2. Rutas dinámicas (:id) después
  // 3. Comodín (*) al final
  return routes.sort((a, b) => {
    if (a.path === '*') return 1;
    if (b.path === '*') return -1;
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;

    const aIsDynamic = a.path.includes(':');
    const bIsDynamic = b.path.includes(':');
    if (aIsDynamic && !bIsDynamic) return 1;
    if (!aIsDynamic && bIsDynamic) return -1;

    return a.path.localeCompare(b.path);
  });
}
