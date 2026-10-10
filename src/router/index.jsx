import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedAdminRoute from '../components/common/ProtectedAdminRoute';
import { discoverRoutes } from './routeDiscovery';

// Descubrimiento dinámico de rutas desde /src/pages
const pageModules = import.meta.glob('/src/pages/**/*.{jsx,js}', { eager: true });
export const discoveredRoutes = discoverRoutes(pageModules);

// Separar rutas según layout y permisos
const customerPages = discoveredRoutes.filter(
  (r) => r.meta.layout !== 'admin' && !r.path.startsWith('/admin') && r.path !== '*'
);

const adminPages = discoveredRoutes.filter(
  (r) => r.meta.layout === 'admin' || r.path.startsWith('/admin')
);

const catchAllPage = discoveredRoutes.find((r) => r.path === '*');

export const router = createBrowserRouter([
  // Layout de la tienda para clientes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      ...customerPages.map((route) => {
        if (route.path === '/') {
          return {
            index: true,
            element: <route.Component />,
          };
        }
        return {
          path: route.path.replace(/^\//, ''),
          element: <route.Component />,
        };
      }),
      // Si hay página 404 descubierta, registrarla como comodín en MainLayout
      {
        path: '*',
        element: catchAllPage ? <catchAllPage.Component /> : <div>404 Not Found</div>,
      },
    ],
  },

  // Layout de Administración con protección de rutas
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
      ...adminPages.map((route) => ({
        path: route.path.replace(/^\/admin\/?/, ''),
        element: <route.Component />,
      })),
    ],
  },
]);
