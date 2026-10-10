import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedAdminRoute from '../components/common/ProtectedAdminRoute';
import { descubrirRutas } from './routeDiscovery';

// Descubrimiento automático de vistas desde la carpeta /src/pages
const modulosPaginas = import.meta.glob('/src/pages/**/*.{jsx,js}', { eager: true });
export const discoveredRoutes = descubrirRutas(modulosPaginas);

// Separar las rutas según su layout y nivel de acceso
const paginasClientes = discoveredRoutes.filter(
  (r) => r.meta.layout !== 'admin' && !r.path.startsWith('/admin') && r.path !== '*'
);

const paginasAdmin = discoveredRoutes.filter(
  (r) => r.meta.layout === 'admin' || r.path.startsWith('/admin')
);

const pagina404 = discoveredRoutes.find((r) => r.path === '*');

// Configuración de rutas de la aplicación
export const router = createBrowserRouter([
  // Layout de la tienda para comensales y clientes
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
      // Ruta comodín para vistas no encontradas (404)
      {
        path: '*',
        element: pagina404 ? <pagina404.Component /> : <div>404 Not Found</div>,
      },
    ],
  },

  // Layout del Panel de Administración protegido por rol
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
