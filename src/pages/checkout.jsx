import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { formatearPrecio } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Finalizar Pedido',
  layout: 'main',
};

export default function CheckoutPage() {
  const {
    carrito: cart,
    subtotal,
    descuento: discount,
    total,
    cuponAplicado: appliedCoupon,
    aplicarCupon,
    quitarCupon,
  } = useCart();

  const { usuarioActual: currentUser } = useAuth();
  const { crearPedido } = useOrders();
  const { productos } = useProducts();
  const navigate = useNavigate();

  // Estados locales para el proceso de compra
  const [modalidad, setModalidad] = useState('retirar');
  const [direccion, setDireccion] = useState(currentUser?.direccion || '');
  const [numeroMesa, setNumeroMesa] = useState('1');
  const [nombreCliente, setNombreCliente] = useState(currentUser?.nombre || '');
  const [codigoCupon, setCodigoCupon] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState(null);
  const [errorEnvio, setErrorEnvio] = useState('');

  // Si no hay productos en el carrito, mostrar advertencia
  if (cart.length === 0) {
    return (
      <Container className="my-5 py-5 text-center">
        <Alert variant="warning" className="shadow-sm p-5 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
          <div className="display-4 mb-3">🛒</div>
          <Alert.Heading className="fw-bold">No hay productos en el carrito</Alert.Heading>
          <p className="text-muted">
            Agrega deliciosos platos a tu orden antes de proceder con el checkout.
          </p>
          <Button as={Link} to="/productos" variant="danger" className="mt-2">
            Ir al Menú
          </Button>
        </Alert>
      </Container>
    );
  }

  /**
   * Procesa la aplicación del código promocional
   */
  function manejarAplicarCupon(evento) {
    evento.preventDefault();
    const resultado = aplicarCupon(codigoCupon);
    setMensajeCupon({
      tipo: resultado.success ? 'success' : 'danger',
      texto: resultado.message,
    });
    if (resultado.success) {
      setCodigoCupon('');
    }
  }

  /**
   * Remueve el cupón activo
   */
  function manejarQuitarCupon() {
    quitarCupon();
    setMensajeCupon(null);
  }

  /**
   * Valida la información y envía la orden a cocina
   */
  function manejarEnvio(evento) {
    evento.preventDefault();
    setErrorEnvio('');

    // Validación de nombre del comensal
    if (!nombreCliente.trim()) {
      setErrorEnvio('Por favor ingresa tu nombre para el pedido.');
      return;
    }

    // Validación según la modalidad seleccionada
    if (modalidad === 'delivery' && !direccion.trim()) {
      setErrorEnvio('Debes ingresar la dirección de entrega para la modalidad delivery.');
      return;
    }

    if (modalidad === 'mesa' && !numeroMesa.trim()) {
      setErrorEnvio('Debes indicar el número de mesa en el restaurante.');
      return;
    }

    // Validación de stock antes de confirmar orden
    for (const item of cart) {
      const prodBD = productos.find((p) => String(p.id) === String(item.id));
      if (prodBD && prodBD.stock < item.cantidad) {
        setErrorEnvio(`Lo sentimos, no hay suficiente stock para "${prodBD.nombre}". Stock disponible: ${prodBD.stock}.`);
        return;
      }
    }

    let detalleModalidad = 'Retiro en local (Av. Principal 456)';
    if (modalidad === 'delivery') {
      detalleModalidad = `Delivery (${direccion.trim()})`;
    } else if (modalidad === 'mesa') {
      detalleModalidad = `Mesa #${numeroMesa.trim()}`;
    }

    // Crear pedido en el sistema
    crearPedido({
      modalidad,
      detalleModalidad,
      items: cart,
      total,
      cliente: nombreCliente.trim(),
    });

    navigate('/confirmacion');
  }

  return (
    <Container className="my-5">
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-1 d-flex align-items-center">
          <i className="bi bi-credit-card-2-front me-2 text-danger"></i>Finalizar Pedido
        </h1>
        <p className="text-muted">Selecciona la forma de recibir tu pedido y confirma tu orden.</p>
      </div>

      {errorEnvio && (
        <Alert variant="danger" dismissible onClose={() => setErrorEnvio('')} className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorEnvio}
        </Alert>
      )}

      <Form id="form-checkout" onSubmit={manejarEnvio}>
        <Row className="g-4">
          <Col lg={7}>
            {/* 1. Modalidad de Entrega */}
            <Card className="shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
              <h2 className="h5 fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>1. ¿Cómo deseas recibir tu comida?
              </h2>

              <div className="d-flex flex-column gap-3 mb-4">
                <Card
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    modalidad === 'retirar' ? 'border-danger bg-danger-subtle' : 'border-light-subtle'
                  }`}
                  onClick={() => setModalidad('retirar')}
                >
                  <Form.Check
                    type="radio"
                    id="modalidad-retirar"
                    name="modalidad"
                    label={
                      <div className="ms-2">
                        <strong className="d-block">Retiro en el Local</strong>
                        <small className="text-muted">Pide ahora y retira en caja sin filas (Av. Principal 456).</small>
                      </div>
                    }
                    value="retirar"
                    checked={modalidad === 'retirar'}
                    onChange={(e) => setModalidad(e.target.value)}
                  />
                </Card>

                <Card
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    modalidad === 'delivery' ? 'border-danger bg-danger-subtle' : 'border-light-subtle'
                  }`}
                  onClick={() => setModalidad('delivery')}
                >
                  <Form.Check
                    type="radio"
                    id="modalidad-delivery"
                    name="modalidad"
                    label={
                      <div className="ms-2">
                        <strong className="d-block">A Domicilio (Delivery Express)</strong>
                        <small className="text-muted">Despacho seguro hasta la puerta de tu hogar o trabajo.</small>
                      </div>
                    }
                    value="delivery"
                    checked={modalidad === 'delivery'}
                    onChange={(e) => setModalidad(e.target.value)}
                  />
                </Card>

                <Card
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    modalidad === 'mesa' ? 'border-danger bg-danger-subtle' : 'border-light-subtle'
                  }`}
                  onClick={() => setModalidad('mesa')}
                >
                  <Form.Check
                    type="radio"
                    id="modalidad-mesa"
                    name="modalidad"
                    label={
                      <div className="ms-2">
                        <strong className="d-block">Directamente en tu Mesa</strong>
                        <small className="text-muted">¿Estás en nuestro local? Dinos qué mesa ocupas y te serviremos.</small>
                      </div>
                    }
                    value="mesa"
                    checked={modalidad === 'mesa'}
                    onChange={(e) => setModalidad(e.target.value)}
                  />
                </Card>
              </div>

              {/* Campos dinámicos según modalidad */}
              {modalidad === 'delivery' && (
                <div id="campos-delivery" className="p-3 bg-light rounded-3 mb-3">
                  <Form.Group controlId="direccion">
                    <Form.Label className="fw-semibold">Dirección de entrega</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Calle, número, depto o punto de referencia..."
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              )}

              {modalidad === 'mesa' && (
                <div id="campos-mesa" className="p-3 bg-light rounded-3 mb-3">
                  <Form.Group controlId="numero-mesa">
                    <Form.Label className="fw-semibold">Número de Mesa</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Ej: 5"
                      value={numeroMesa}
                      onChange={(e) => setNumeroMesa(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              )}
            </Card>

            {/* 2. Datos del Cliente */}
            <Card className="shadow-sm border-0 rounded-4 p-4 bg-white">
              <h2 className="h5 fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-person-circle text-danger me-2"></i>2. Datos del Cliente
              </h2>

              <Form.Group controlId="nombre-cliente" className="mb-3">
                <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tu nombre y apellidos"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  required
                />
              </Form.Group>
            </Card>
          </Col>

          {/* Resumen y Cupones */}
          <Col lg={5}>
            <Card className="shadow-sm border-0 rounded-4 bg-white p-4 sticky-top" style={{ top: '90px' }}>
              <h2 className="h5 fw-bold mb-3 border-bottom pb-2">Resumen de la Orden</h2>

              <ListGroup variant="flush" className="mb-3" id="resumen-items">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-0 py-2">
                    <div>
                      <span className="fw-semibold">{item.nombre}</span>
                      <span className="text-muted small ms-1">x{item.cantidad}</span>
                    </div>
                    <span className="text-secondary fw-semibold">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Formulario de Cupón */}
              <div className="mb-4 p-3 bg-light rounded-3">
                <Form.Label className="fw-semibold small text-muted text-uppercase mb-2">
                  ¿Tienes un cupón de descuento?
                </Form.Label>
                {appliedCoupon ? (
                  <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border border-success">
                    <div>
                      <Badge bg="success" className="me-2">{appliedCoupon.codigo}</Badge>
                      <small className="text-success fw-bold">{appliedCoupon.descripcion}</small>
                    </div>
                    <Button variant="link" size="sm" className="text-danger p-0" onClick={manejarQuitarCupon}>
                      Quitar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <InputGroup>
                      <Form.Control
                        id="input-cupon"
                        placeholder="Ej: FORK20 o BIENVENIDA"
                        value={codigoCupon}
                        onChange={(e) => setCodigoCupon(e.target.value)}
                        className="text-uppercase"
                      />
                      <Button
                        id="btn-aplicar-cupon"
                        variant="outline-danger"
                        type="button"
                        onClick={manejarAplicarCupon}
                      >
                        Aplicar
                      </Button>
                    </InputGroup>
                    <div className="form-text small mt-1">
                      Prueba con <code>FORK20</code> (20% off) o <code>BIENVENIDA</code> ($3.000 off).
                    </div>
                  </div>
                )}

                {mensajeCupon && (
                  <div className={`small mt-2 text-${mensajeCupon.tipo}`} id="mensaje-cupon">
                    {mensajeCupon.texto}
                  </div>
                )}
              </div>

              {/* Desglose de totales */}
              <div className="d-flex justify-content-between mb-2 text-secondary" id="linea-subtotal">
                <span>Subtotal:</span>
                <span id="resumen-subtotal">{formatearPrecio(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success fw-semibold" id="linea-descuento">
                  <span>Descuento aplicado:</span>
                  <span id="resumen-descuento">-{formatearPrecio(discount)}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Total Final:</span>
                <span className="fs-3 fw-bold text-danger" id="resumen-total">
                  {formatearPrecio(total)}
                </span>
              </div>

              <Button
                type="submit"
                variant="danger"
                size="lg"
                className="w-100 fw-bold shadow py-3"
              >
                <i className="bi bi-bag-check-fill me-2"></i>Confirmar y Enviar a Cocina
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
