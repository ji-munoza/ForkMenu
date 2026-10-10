import { describe, it, expect } from 'vitest';
import { convertPathToRoute, discoverRoutes } from '../router/routeDiscovery';

describe('Descubrimiento de Rutas con React Router y Vite', () => {
  describe('convertPathToRoute', () => {
    it('convierte la ruta raíz index.jsx en "/"', () => {
      expect(convertPathToRoute('/src/pages/index.jsx')).toBe('/');
      expect(convertPathToRoute('src/pages/index.jsx')).toBe('/');
    });

    it('convierte subdirectorios con index.jsx en rutas limpias', () => {
      expect(convertPathToRoute('/src/pages/productos/index.jsx')).toBe('/productos');
      expect(convertPathToRoute('/src/pages/blogs/index.jsx')).toBe('/blogs');
    });

    it('convierte parámetros dinámicos [id] a la convención :id de React Router', () => {
      expect(convertPathToRoute('/src/pages/productos/[id].jsx')).toBe('/productos/:id');
      expect(convertPathToRoute('/src/pages/blogs/[id].jsx')).toBe('/blogs/:id');
    });

    it('convierte rutas administrativas anidadas', () => {
      expect(convertPathToRoute('/src/pages/admin/pedidos.jsx')).toBe('/admin/pedidos');
      expect(convertPathToRoute('/src/pages/admin/productos.jsx')).toBe('/admin/productos');
      expect(convertPathToRoute('/src/pages/admin/usuarios.jsx')).toBe('/admin/usuarios');
    });

    it('convierte archivos de páginas estándar', () => {
      expect(convertPathToRoute('/src/pages/carrito.jsx')).toBe('/carrito');
      expect(convertPathToRoute('/src/pages/checkout.jsx')).toBe('/checkout');
      expect(convertPathToRoute('/src/pages/confirmacion.jsx')).toBe('/confirmacion');
      expect(convertPathToRoute('/src/pages/contacto.jsx')).toBe('/contacto');
      expect(convertPathToRoute('/src/pages/nosotros.jsx')).toBe('/nosotros');
      expect(convertPathToRoute('/src/pages/login.jsx')).toBe('/login');
      expect(convertPathToRoute('/src/pages/registro.jsx')).toBe('/registro');
      expect(convertPathToRoute('/src/pages/perfil.jsx')).toBe('/perfil');
    });

    it('convierte archivos 404 y NotFound al comodín "*" de React Router', () => {
      expect(convertPathToRoute('/src/pages/404.jsx')).toBe('*');
      expect(convertPathToRoute('/src/pages/NotFound.jsx')).toBe('*');
    });
  });

  describe('discoverRoutes', () => {
    it('descubre y ordena rutas colocando fijas primero, dinámicas después y "*" al final', () => {
      const mockModules = {
        '/src/pages/404.jsx': {
          default: () => 'NotFound',
          meta: { title: '404' },
        },
        '/src/pages/productos/[id].jsx': {
          default: () => 'Detalle',
          meta: { title: 'Detalle' },
        },
        '/src/pages/productos/index.jsx': {
          default: () => 'Productos',
          meta: { title: 'Productos' },
        },
        '/src/pages/index.jsx': {
          default: () => 'Home',
          meta: { title: 'Home' },
        },
        '/src/pages/admin/pedidos.jsx': {
          default: () => 'AdminPedidos',
          meta: { title: 'Admin', adminOnly: true },
        },
      };

      const result = discoverRoutes(mockModules);

      expect(result).toHaveLength(5);
      expect(result[0].path).toBe('/');
      expect(result[1].path).toBe('/admin/pedidos');
      expect(result[2].path).toBe('/productos');
      expect(result[3].path).toBe('/productos/:id');
      expect(result[4].path).toBe('*');

      // Verifica metadata
      expect(result[1].meta.adminOnly).toBe(true);
    });

    it('ignora módulos sin export default', () => {
      const mockModules = {
        '/src/pages/util.js': { notDefault: true },
        '/src/pages/index.jsx': { default: () => 'Home' },
      };

      const result = discoverRoutes(mockModules);
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('/');
    });
  });
});
