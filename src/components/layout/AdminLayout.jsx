import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { Nav, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { usuarioActual: currentUser, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  /**
   * Cierra la sesión activa del administrador y navega al login
   */
  function manejarCerrarSesion() {
    cerrarSesion();
    navigate('/login');
  }

  return (
    <div className="admin-wrapper">
      {/* Sidebar Lateral de Administración */}
      <aside className="admin-sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <Link to="/" className="d-flex align-items-center mb-4 text-white text-decoration-none fs-4 fw-bold">
            <i className="bi bi-cup-hot-fill text-danger me-2"></i> ForkMenu
          </Link>
          <div className="px-2 py-2 mb-3 rounded bg-dark border border-secondary text-white-50 small">
            <div className="fw-semibold text-white d-flex align-items-center gap-1">
              <i className="bi bi-person-badge text-warning"></i>
              <span>{currentUser?.nombre || 'Administrador'}</span>
            </div>
            <div className="text-truncate">{currentUser?.correo}</div>
            <Badge bg="danger" className="mt-1">ADMINISTRADOR</Badge>
          </div>

          <Nav className="nav-pills flex-column">
            <Nav.Item className="mb-1">
              <Nav.Link as={NavLink} to="/admin/pedidos" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="bi bi-receipt me-2"></i> Pedidos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-1">
              <Nav.Link as={NavLink} to="/admin/productos" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="bi bi-box-seam me-2"></i> Productos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-1">
              <Nav.Link as={NavLink} to="/admin/usuarios" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="bi bi-people me-2"></i> Usuarios
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="d-flex flex-column gap-2 mt-4">
          <Button as={Link} to="/" variant="outline-light" size="sm" className="w-100">
            <i className="bi bi-shop me-2"></i> Ir a la Tienda
          </Button>
          <Button onClick={manejarCerrarSesion} variant="danger" size="sm" className="w-100">
            <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido Principal Admin */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
