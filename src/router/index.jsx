import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedAdminRoute from '../components/common/ProtectedAdminRoute';
import { descubrirRutas } from './routeDiscovery';

// Busca las páginas dentro de src/pages.
const modulosPaginas = import.meta.glob('/src/pages/**/*.{jsx,js}', { eager: true });
export const discoveredRoutes = descubrirRutas(modulosPaginas);

// Separa las páginas de clientes y las de administración.
const paginasClientes = discoveredRoutes.filter(
  (r) => r.meta.layout !== 'admin' && !r.path.startsWith('/admin') && r.path !== '*'
);

const paginasAdmin = discoveredRoutes.filter(
  (r) => r.meta.layout === 'admin' || r.path.startsWith('/admin')
);

const pagina404 = discoveredRoutes.find((r) => r.path === '*');

// Define qué página mostrar para cada dirección.
export const router = createBrowserRouter([
  // Rutas de las páginas principales.
  {
    path: '/',
    element: <MainLayout />,
    children: [
      ...paginasClientes.map((ruta) => {
        if (ruta.path === '/') {
          return {
            index: true,
            element: <ruta.Component />,
          };
        }
        return {
          path: ruta.path.replace(/^\//, ''),
          element: <ruta.Component />,
        };
      }),
      // Muestra la página 404 para direcciones desconocidas.
      {
        path: '*',
        element: pagina404 ? <pagina404.Component /> : <div>404 Not Found</div>,
      },
    ],
  },

  // Rutas del panel, protegidas para administradores.
  {
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/pedidos" replace />,
      },
      ...paginasAdmin.map((ruta) => ({
        path: ruta.path.replace(/^\/admin\/?/, ''),
        element: <ruta.Component />,
      })),
    ],
  },
]);
