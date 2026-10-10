import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { useOrders } from '../context/OrderContext';
import { formatearPrecio } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Pedido Confirmado',
  layout: 'main',
};

export default function ConfirmacionPage() {
  const { ordenReciente } = useOrders();
  const navigate = useNavigate();

  // Si no se encuentra una orden reciente, sugerir volver al menú
  if (!ordenReciente) {
    return (
      <Container className="my-5 py-5 text-center">
        <Card className="border-0 shadow-sm p-5 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="display-3 text-muted mb-3">🧾</div>
          <h2 className="h4 fw-bold">No hay ninguna orden reciente</h2>
          <p className="text-muted mb-4">
            Parece que aún no has completado un pedido o tu sesión expiró.
          </p>
          <Button as={Link} to="/productos" variant="danger">
            Explorar Menú
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow border-0 rounded-4 mx-auto overflow-hidden bg-white" style={{ maxWidth: '650px' }}>
        {/* Banner de éxito */}
        <div className="bg-success text-white text-center py-4 px-3">
          <div className="display-4 mb-2">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h1 className="h3 fw-bold mb-1">¡Pedido Recibido con Éxito!</h1>
          <p className="mb-0 text-white-50">
            Nuestra cocina ya está preparando tus platos con los mejores ingredientes.
          </p>
        </div>

        <Card.Body className="p-4 p-md-5">
          {/* Código de seguimiento y estado del pedido */}
          <div className="p-3 bg-light rounded-3 mb-4 text-center border">
            <span className="text-muted small text-uppercase fw-semibold d-block">
              Código de Seguimiento
            </span>
            <div className="fs-2 fw-bold text-danger my-1" id="codigo-pedido">
              {ordenReciente.codigo}
            </div>
            <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 rounded-pill">
              <i className="bi bi-hourglass-split me-1"></i>{ordenReciente.estado || 'En preparación'}
            </Badge>
          </div>

          {/* Detalles del Pedido */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-muted mb-3 border-bottom pb-2">
              Información de la Orden
            </h2>
            <Row className="gy-2 small">
              <Col sm={6}>
                <span className="text-muted d-block">Cliente:</span>
                <strong className="text-dark">{ordenReciente.cliente}</strong>
              </Col>
              <Col sm={6}>
                <span className="text-muted d-block">Fecha y Hora:</span>
                <strong className="text-dark">{ordenReciente.fecha}</strong>
              </Col>
              <Col sm={12} className="mt-2">
                <span className="text-muted d-block">Modalidad de entrega:</span>
                <strong className="text-danger">{ordenReciente.modalidad}</strong>
              </Col>
            </Row>
          </div>

          {/* Detalle de Platos Comprados */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-muted mb-3 border-bottom pb-2">
              Detalle de Productos
            </h2>
            <ListGroup variant="flush" id="resumen-items-confirmacion">
              {ordenReciente.items?.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
                >
                  <div>
                    <span className="fw-semibold text-dark">{item.nombre}</span>
                    <span className="text-muted small ms-2">x{item.cantidad}</span>
                  </div>
                  <span className="fw-bold text-secondary">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Total pagado */}
          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4">
            <span className="fs-5 fw-bold">Monto Total Pagado:</span>
            <span className="fs-3 fw-bold text-danger" id="total-confirmacion">
              {formatearPrecio(ordenReciente.total)}
            </span>
          </div>

          {/* Opciones de navegación */}
          <div className="d-grid gap-2">
            <Button as={Link} to="/productos" variant="danger" size="lg" className="fw-bold">
              <i className="bi bi-journal-richtext me-2"></i>Seguir Ordenando
            </Button>
            <Button as={Link} to="/" variant="outline-secondary">
              Volver al Inicio
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
