import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from '../common/HeaderNavbar';
import Footer from '../common/Footer';

/**
 * Layout principal de la aplicación para comensales y navegación general
 */
export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <HeaderNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
