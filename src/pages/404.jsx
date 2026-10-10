import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

export const meta = {
  title: 'Página no encontrada - ForkMenu',
  layout: 'main',
};

export default function NotFoundPage() {
  return (
    <Container className="my-5 py-5 text-center">
      <Card className="shadow-sm border-0 rounded-4 p-5 mx-auto bg-white" style={{ maxWidth: '600px' }}>
        <div className="display-1 text-danger fw-bold mb-2">404</div>
        <h1 className="h3 fw-bold mb-3">Página No Encontrada</h1>
        <p className="text-muted mb-4">
          Lo sentimos, el enlace o la vista a la que intentas acceder no existe o ha cambiado de lugar.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to="/" variant="danger" size="lg" className="px-4">
            <i className="bi bi-house-door-fill me-2"></i>Ir al Inicio
          </Button>
          <Button as={Link} to="/productos" variant="outline-secondary" size="lg">
            Ver la Carta
          </Button>
        </div>
      </Card>
    </Container>
  );
}
