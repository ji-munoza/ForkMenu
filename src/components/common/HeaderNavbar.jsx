import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function HeaderNavbar() {
  const { usuarioActual: currentUser, cerrarSesion, esAdmin: isAdmin } = useAuth();
  const { totalArticulos: totalItems } = useCart();
  const navigate = useNavigate();

  /**
   * Cierra la sesión activa y redirige a la página principal
   */
  function manejarCerrarSesion() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-danger fs-3 d-flex align-items-center">
            <i className="bi bi-cup-hot-fill me-2"></i>ForkMenu
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarContent" />

          <Navbar.Collapse id="navbarContent">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/productos">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros">
                Nosotros
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blogs">
                Blogs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">
                Contacto
              </Nav.Link>
              {isAdmin && (
                <Nav.Link as={NavLink} to="/admin/pedidos" className="text-warning fw-semibold">
                  <i className="bi bi-shield-lock-fill me-1"></i>Panel Admin
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {currentUser ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" size="sm" className="d-flex align-items-center gap-2">
                    <i className="bi bi-person-circle"></i>
                    <span>Hola, {currentUser.nombre.split(' ')[0]}</span>
                    {isAdmin && <Badge bg="danger" className="ms-1">Admin</Badge>}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm">
                    <Dropdown.Item as={Link} to="/perfil">
                      <i className="bi bi-person me-2"></i>Mi Perfil
                    </Dropdown.Item>
                    {isAdmin && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin/pedidos">
                          <i className="bi bi-receipt me-2"></i>Gestión de Pedidos
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/productos">
                          <i className="bi bi-box-seam me-2"></i>Inventario Productos
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/usuarios">
                          <i className="bi bi-people me-2"></i>Gestión de Usuarios
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={manejarCerrarSesion} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline-light" size="sm">
                    Iniciar sesión
                  </Button>
                  <span className="text-white-50 d-none d-sm-inline">|</span>
                  <Button as={Link} to="/registro" variant="outline-light" size="sm">
                    Registrar usuario
                  </Button>
                </>
              )}

              <Button
                as={Link}
                to="/carrito"
                variant="danger"
                size="sm"
                className="ms-1 position-relative d-flex align-items-center gap-1 shadow-sm"
                id="contador-carrito"
              >
                <i className="bi bi-cart-fill"></i>
                <span>Cart ({totalItems})</span>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
