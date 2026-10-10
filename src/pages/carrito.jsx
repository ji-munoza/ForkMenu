import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { formatearPrecio } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Mi Carrito',
  layout: 'main',
};

export default function CarritoPage() {
  const {
    carrito: cart,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    subtotal,
    totalArticulos: totalItems,
  } = useCart();

  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  /**
   * Actualiza la cantidad de un ítem en el carrito con validación de stock
   */
  function manejarActualizarCantidad(id, delta) {
    const resultado = actualizarCantidad(id, delta);
    if (resultado && !resultado.success) {
      setFeedback({ tipo: 'warning', mensaje: resultado.message });
      setTimeout(() => setFeedback(null), 3000);
    }
  }

  /**
   * Elimina un producto específico del carrito
   */
  function manejarEliminarDelCarrito(id) {
    eliminarDelCarrito(id);
  }

  /**
   * Limpia todos los productos del carrito
   */
  function manejarVaciarCarrito() {
    vaciarCarrito();
  }

  return (
    <Container className="my-5">
      {feedback && (
        <Alert variant={feedback.tipo} dismissible onClose={() => setFeedback(null)} className="mb-4">
          <i className="bi bi-exclamation-circle me-2"></i>
          {feedback.mensaje}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1 d-flex align-items-center">
            <i className="bi bi-cart3 me-2 text-danger"></i>Tu Carrito de Compras
          </h1>
          <p className="text-muted mb-0">Revisa tus productos antes de confirmar el pedido.</p>
        </div>

        {cart.length > 0 && (
          <Button variant="outline-secondary" size="sm" onClick={manejarVaciarCarrito}>
            <i className="bi bi-trash me-1"></i>Vaciar Carrito
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-4">
          <Card.Body className="py-5">
            <div className="display-1 text-muted mb-3">🛒</div>
            <h2 className="h4 fw-bold">Tu carrito está actualmente vacío</h2>
            <p className="text-muted mb-4 max-w-500 mx-auto">
              Aún no has agregado platos a tu orden. Revisa nuestra carta y elige tus favoritos.
            </p>
            <Button as={Link} to="/productos" variant="danger" size="lg" className="px-4 shadow-sm fw-semibold">
              <i className="bi bi-journal-richtext me-2"></i>Explorar el Menú
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {/* Lista de Productos en el Carrito */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-4">
              <Card.Header className="bg-white py-3 border-bottom">
                <span className="fw-bold">Productos seleccionados ({totalItems})</span>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="align-middle mb-0 table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ minWidth: '220px' }}>Producto</th>
                        <th className="text-center">Precio</th>
                        <th className="text-center" style={{ width: '140px' }}>Cantidad</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-center" style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody id="lista-carrito">
                      {cart.map((item) => (
                        <tr key={item.id} className="item-carrito">
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {item.imagen && (
                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="rounded-3 object-fit-cover shadow-sm"
                                  style={{ width: '56px', height: '56px' }}
                                />
                              )}
                              <div>
                                <Link to={`/productos/${item.id}`} className="text-dark fw-bold text-decoration-none">
                                  {item.nombre}
                                </Link>
                                {item.codigo && (
                                  <span className="d-block text-muted small">{item.codigo}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-semibold text-secondary">
                            {formatearPrecio(item.precio)}
                          </td>
                          <td className="text-center">
                            <div className="d-inline-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-dark text-decoration-none btn-restar"
                                onClick={() => manejarActualizarCantidad(item.id, -1)}
                              >
                                <i className="bi bi-dash"></i>
                              </Button>
                              <span className="mx-2 fw-bold" style={{ minWidth: '24px' }}>
                                {item.cantidad}
                              </span>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-dark text-decoration-none btn-sumar"
                                onClick={() => manejarActualizarCantidad(item.id, 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </Button>
                            </div>
                          </td>
                          <td className="text-end fw-bold text-danger">
                            {formatearPrecio(item.precio * item.cantidad)}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="border-0 rounded-circle"
                              onClick={() => manejarEliminarDelCarrito(item.id)}
                              title="Eliminar producto"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center">
              <Button as={Link} to="/productos" variant="outline-dark" className="fw-semibold">
                <i className="bi bi-arrow-left me-2"></i>Seguir Agregando Platos
              </Button>
            </div>
          </Col>

          {/* Resumen del Pedido */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-4 bg-white p-4 sticky-top" style={{ top: '90px' }}>
              <h2 className="h5 fw-bold mb-3 border-bottom pb-2">Resumen del Pedido</h2>

              <div className="d-flex justify-content-between mb-2 text-secondary">
                <span>Subtotal ({totalItems} items):</span>
                <span className="fw-semibold text-dark">{formatearPrecio(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Estimación de entrega:</span>
                <span className="text-success fw-semibold">Gratis</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Total a pagar:</span>
                <span className="fs-3 fw-bold text-danger" id="total-carrito">
                  {formatearPrecio(subtotal)}
                </span>
              </div>

              <Button
                variant="danger"
                size="lg"
                className="w-100 fw-bold shadow-sm mb-3"
                onClick={() => navigate('/checkout')}
              >
                Continuar al Checkout <i className="bi bi-arrow-right ms-2"></i>
              </Button>

              <div className="p-3 bg-light rounded-3 text-center small text-muted">
                <i className="bi bi-shield-check text-success me-1"></i>
                Compra segura con confirmación directa a cocina.
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
