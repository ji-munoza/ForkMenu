import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Pie de página institucional de ForkMenu
 */
export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto border-top border-secondary">
      <Container>
        <Row className="gy-3 align-items-center">
          <Col md={4} className="text-center text-md-start">
            <span className="fw-bold text-danger fs-5 d-inline-flex align-items-center">
              <i className="bi bi-cup-hot-fill me-2"></i>ForkMenu
            </span>
            <p className="text-white-50 small mb-0 mt-1">
              Tu comida, a tu manera. Pedidos rápidos a domicilio, mesa o retiro.
            </p>
          </Col>

          <Col md={4} className="text-center">
            <div className="d-flex justify-content-center gap-3">
              <Link to="/productos" className="text-white-50 text-decoration-none small hover-light">
                Carta
              </Link>
              <Link to="/nosotros" className="text-white-50 text-decoration-none small hover-light">
                Nosotros
              </Link>
              <Link to="/blogs" className="text-white-50 text-decoration-none small hover-light">
                Blog
              </Link>
              <Link to="/contacto" className="text-white-50 text-decoration-none small hover-light">
                Contacto
              </Link>
            </div>
          </Col>

          <Col md={4} className="text-center text-md-end">
            <p className="mb-0 text-white-50 small">
              &copy; {new Date().getFullYear()} ForkMenu. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
