import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import HeaderNavbar from '../components/common/HeaderNavbar';
import ProtectedAdminRoute from '../components/common/ProtectedAdminRoute';
import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';
import { CartProvider } from '../context/CartContext';

describe('Componentes UI de ForkMenu', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('HeaderNavbar renderiza el logo de ForkMenu y los enlaces principales de navegación', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <HeaderNavbar />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Marca
    expect(screen.getByText(/ForkMenu/i)).toBeInTheDocument();

    // Enlaces de navegación
    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Productos$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Nosotros$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Blogs$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Contacto$/i)).toBeInTheDocument();

    // Contador de Carrito
    expect(screen.getByText(/Cart \(0\)/i)).toBeInTheDocument();
  });

  it('ProtectedAdminRoute muestra advertencia de acceso restringido para usuarios sin rol admin', () => {
    // Simulamos un usuario cliente en localStorage
    localStorage.setItem(
      'usuarioActivo',
      JSON.stringify({
        nombre: 'Cliente Prueba',
        correo: 'cliente@gmail.com',
        rol: 'cliente',
      })
    );

    render(
      <MemoryRouter initialEntries={['/admin/pedidos']}>
        <AuthProvider>
          <ProtectedAdminRoute>
            <div>Contenido Secreto de Admin</div>
          </ProtectedAdminRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    // No debe mostrar el contenido protegido
    expect(screen.queryByText('Contenido Secreto de Admin')).not.toBeInTheDocument();

    // Debe mostrar la advertencia de acceso restringido
    expect(screen.getByText(/Acceso Restringido/i)).toBeInTheDocument();
  });

  it('ProtectedAdminRoute permite acceso si el usuario activo es admin', () => {
    localStorage.setItem(
      'usuarioActivo',
      JSON.stringify({
        nombre: 'Admin General',
        correo: 'admin@forkmenu.cl',
        rol: 'admin',
      })
    );

    render(
      <MemoryRouter initialEntries={['/admin/pedidos']}>
        <AuthProvider>
          <ProtectedAdminRoute>
            <div>Panel de Control Autorizado</div>
          </ProtectedAdminRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Panel de Control Autorizado')).toBeInTheDocument();
  });
});
