import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { formatearPrecio } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Tu comida, a tu manera',
  layout: 'main',
};

export default function HomePage() {
  const { productos } = useProducts();
  const { agregarAlCarrito } = useCart();
  const [feedback, setFeedback] = useState(null);

  // Seleccionar los primeros 3 productos para la sección destacada
  const platosDestacados = productos.slice(0, 3);

  /**
   * Agrega un plato destacado directamente al carrito
   */
  function manejarAgregarAlCarrito(producto) {
    const resultado = agregarAlCarrito(producto, 1);
    setFeedback({
      tipo: resultado.success ? 'success' : 'danger',
      mensaje: resultado.message,
    });
    setTimeout(() => setFeedback(null), 3500);
  }

  return (
    <div>
      {/* Alerta flotante de feedback al interactuar con el carrito */}
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

      {/* Hero Section Principal */}
      <section
        className="text-white text-center py-5 mb-5 shadow-sm position-relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`,
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10}>
              <span className="badge bg-danger px-3 py-2 text-uppercase mb-3 fw-semibold letter-spacing-1">
                La mejor experiencia culinaria
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Explora, arma y recibe tu pedido como prefieras
              </h1>
              <p className="lead mx-auto mb-4 text-light" style={{ maxWidth: '750px' }}>
                Disfruta de nuestra carta eligiendo tu modalidad favorita: a domicilio, retiro en el local o pidiendo directamente desde tu mesa. Una experiencia simple, rápida y deliciosa.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button as={Link} to="/productos" variant="danger" size="lg" className="px-4 fw-bold shadow">
                  <i className="bi bi-journal-richtext me-2"></i>Explorar Menú
                </Button>
                <Button as={Link} to="/nosotros" variant="outline-light" size="lg" className="px-4 fw-semibold">
                  <i className="bi bi-info-circle me-2"></i>Conócenos
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Características Destacadas del Servicio */}
      <Container className="mb-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
              <div className="display-5 text-danger mb-3">
                <i className="bi bi-bicycle"></i>
              </div>
              <h3 className="h5 fw-bold">Delivery Express</h3>
              <p className="text-muted small mb-0">
                Llevamos tu comida recién preparada caliente y en tiempo récord directo a tu puerta.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
              <div className="display-5 text-danger mb-3">
                <i className="bi bi-qr-code-scan"></i>
              </div>
              <h3 className="h5 fw-bold">Pide en tu Mesa</h3>
              <p className="text-muted small mb-0">
                Elige tu mesa en el restaurante, ordena desde tu smartphone y la cocina lo prepara al instante.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 hover-lift">
              <div className="display-5 text-danger mb-3">
                <i className="bi bi-shop"></i>
              </div>
              <h3 className="h5 fw-bold">Retiro en Local</h3>
              <p className="text-muted small mb-0">
                Pide con anticipación y tu pedido estará listo sin filas cuando llegues al local.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Platos Destacados */}
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-danger fw-bold text-uppercase small">Nuestra Selección</span>
            <h2 className="h2 fw-bold mb-0">Platos Destacados</h2>
          </div>
          <Link to="/productos" className="text-danger fw-semibold text-decoration-none">
            Ver toda la carta <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {platosDestacados.map((plato) => (
            <Col key={plato.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card transition-all">
                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                  <Card.Img
                    variant="top"
                    src={plato.imagen}
                    alt={plato.nombre}
                    className="w-100 h-100 object-fit-cover product-img-zoom"
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-capitalize px-3 py-2 rounded-pill">
                    {plato.categoria}
                  </span>
                </div>
                <Card.Body className="d-flex flex-column p-4">
                  <Link to={`/productos/${plato.id}`} className="text-decoration-none text-dark">
                    <Card.Title as="h3" className="h5 fw-bold mb-2">
                      {plato.nombre}
                    </Card.Title>
                  </Link>
                  <p className="text-muted small line-clamp-2 mb-3">
                    {plato.descripcion}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
                    <span className="text-danger fw-bold fs-4">
                      {formatearPrecio(plato.precio)}
                    </span>
                    <span className="small text-secondary">
                      Stock: <strong>{plato.stock}</strong>
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-danger"
                      className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
                      onClick={() => manejarAgregarAlCarrito(plato)}
                      disabled={plato.stock <= 0}
                    >
                      <i className="bi bi-cart-plus"></i>
                      <span>{plato.stock > 0 ? 'Añadir al carrito' : 'Agotado'}</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
