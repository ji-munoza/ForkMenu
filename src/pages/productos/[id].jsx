import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Breadcrumb, Form, Alert, Badge } from 'react-bootstrap';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Detalle de Producto',
  layout: 'main',
};

export default function DetalleProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();

  const producto = getProductById(id);

  const [cantidad, setCantidad] = useState(1);
  const [tamano, setTamano] = useState('individual');
  const [feedback, setFeedback] = useState(null);

  if (!producto) {
    return (
      <Container className="my-5 py-5 text-center">
        <Alert variant="warning" className="shadow-sm p-5 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
          <div className="display-4 mb-3">🍽️</div>
          <Alert.Heading className="fw-bold">Producto no encontrado</Alert.Heading>
          <p className="text-muted">
            El plato o bebida solicitado no se encuentra en nuestro menú o fue retirado temporalmente.
          </p>
          <Button variant="danger" onClick={() => navigate('/productos')} className="mt-2">
            Volver a la Carta
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleAgregar = (e) => {
    e.preventDefault();
    const res = addToCart(producto, cantidad);
    setFeedback({
      tipo: res.success ? 'success' : 'danger',
      mensaje: res.message,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <Container className="my-5">
      {feedback && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999, marginTop: '60px' }}
        >
          <Alert
            variant={feedback.tipo}
            dismissible
            onClose={() => setFeedback(null)}
            className="shadow-lg animate__animated animate__fadeInDown"
          >
            <i
              className={`bi ${
                feedback.tipo === 'success'
                  ? 'bi-check-circle-fill'
                  : 'bi-exclamation-triangle-fill'
              } me-2`}
            ></i>
            {feedback.mensaje}
          </Alert>
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/productos' }}>
          Productos
        </Breadcrumb.Item>
        <Breadcrumb.Item active id="breadcrumb-nombre">
          {producto.nombre}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
        <Row className="g-5 align-items-center">
          {/* Imagen del plato */}
          <Col md={6}>
            <div className="rounded-4 overflow-hidden shadow-sm bg-light position-relative" style={{ maxHeight: '450px' }}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid w-100 object-fit-cover"
                style={{ height: '420px' }}
                id="detalle-imagen"
              />
              <span className="position-absolute top-0 start-0 m-3 badge bg-danger text-uppercase px-3 py-2 rounded-pill">
                {producto.categoria}
              </span>
            </div>
          </Col>

          {/* Información del plato */}
          <Col md={6}>
            <div className="mb-2 d-flex align-items-center gap-2">
              <Badge bg="secondary" className="px-2 py-1">
                {producto.codigo}
              </Badge>
              {producto.stock <= (producto.stockCritico || 0) && (
                <Badge bg="danger">¡Últimas unidades!</Badge>
              )}
            </div>

            <h1 className="h2 fw-bold text-dark mb-2" id="detalle-nombre">
              {producto.nombre}
            </h1>

            <p className="text-danger fw-bold fs-2 mb-3" id="detalle-precio">
              {formatearPrecio(producto.precio)}
            </p>

            <p className="text-secondary lh-base mb-4 fs-5" id="detalle-descripcion">
              {producto.descripcion}
            </p>

            <div className="p-3 bg-light rounded-3 mb-4">
              <div className="row text-center">
                <div className="col-6 border-end">
                  <span className="text-muted small d-block">Disponibilidad</span>
                  <strong className={producto.stock > 0 ? 'text-success' : 'text-danger'}>
                    {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                  </strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Preparación</span>
                  <strong className="text-dark">15 - 20 min</strong>
                </div>
              </div>
            </div>

            <Form onSubmit={handleAgregar} className="row g-3">
              <Col sm={6}>
                <Form.Group controlId="tamano">
                  <Form.Label className="fw-semibold">Porción / Tamaño</Form.Label>
                  <Form.Select
                    value={tamano}
                    onChange={(e) => setTamano(e.target.value)}
                  >
                    <option value="individual">Individual</option>
                    <option value="doble">Doble (+20% ingredientes)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="cantidad">
                  <Form.Label className="fw-semibold">Cantidad</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                      disabled={cantidad <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      min={1}
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10) || 1;
                        setCantidad(Math.min(Math.max(1, v), producto.stock));
                      }}
                      className="text-center fw-bold"
                      style={{ width: '70px' }}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setCantidad((prev) => Math.min(producto.stock, prev + 1))}
                      disabled={cantidad >= producto.stock}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} className="mt-4">
                <Button
                  type="submit"
                  variant="danger"
                  size="lg"
                  className="w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={producto.stock <= 0}
                  id="detalle-btn-agregar"
                >
                  <i className="bi bi-cart-plus-fill fs-5"></i>
                  <span>Añadir {cantidad} al carrito</span>
                </Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
