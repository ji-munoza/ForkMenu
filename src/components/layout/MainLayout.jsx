import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNavbar from '../common/HeaderNavbar';
import Footer from '../common/Footer';

// Estructura común de las páginas principales.
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
