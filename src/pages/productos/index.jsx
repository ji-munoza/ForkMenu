import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert, Badge } from 'react-bootstrap';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Nuestros Productos',
  layout: 'main',
};

const CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'hamburguesas', label: 'Hamburguesas' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'postres', label: 'Postres' },
];

export default function ProductosPage() {
  const { productos } = useProducts();
  const { agregarAlCarrito } = useCart();

  // Estados locales para los filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [feedback, setFeedback] = useState(null);

  /**
   * Filtra los productos según la categoría activa y el término de búsqueda
   */
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCat =
        categoriaSeleccionada === 'todas' ||
        (producto.categoria || '').toLowerCase() === categoriaSeleccionada.toLowerCase();

      const textoBusqueda = busqueda.toLowerCase().trim();
      const coincideTexto =
        !textoBusqueda ||
        producto.nombre.toLowerCase().includes(textoBusqueda) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(textoBusqueda));

      return coincideCat && coincideTexto;
    });
  }, [productos, categoriaSeleccionada, busqueda]);

  /**
   * Agrega un producto al carrito de compras
   */
  function manejarAgregarAlCarrito(producto) {
    const resultado = agregarAlCarrito(producto, 1);
    setFeedback({
      tipo: resultado.success ? 'success' : 'danger',
      mensaje: resultado.message,
    });
    setTimeout(() => setFeedback(null), 3500);
  }

  /**
   * Actualiza el valor del input de búsqueda
   */
  function manejarCambioBusqueda(evento) {
    setBusqueda(evento.target.value);
  }

  /**
   * Selecciona una categoría específica para filtrar
   */
  function manejarSeleccionarCategoria(idCategoria) {
    setCategoriaSeleccionada(idCategoria);
  }

  /**
   * Restablece los filtros a su estado inicial
   */
  function manejarLimpiarFiltros() {
    setBusqueda('');
    setCategoriaSeleccionada('todas');
  }

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

      <div className="mb-4">
        <h1 className="h2 fw-bold mb-2 d-flex align-items-center">
          <i className="bi bi-journal-richtext me-2 text-danger"></i>Nuestros Productos
        </h1>
        <p className="text-muted">
          Platos preparados al minuto con ingredientes frescos y recetas artesanales.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <Card className="shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <Row className="g-3 align-items-center">
          <Col lg={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                id="buscar-producto"
                placeholder="Buscar por nombre o ingrediente..."
                value={busqueda}
                onChange={manejarCambioBusqueda}
                className="bg-light border-start-0"
              />
            </InputGroup>
          </Col>

          <Col lg={8}>
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
              {CATEGORIAS.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoriaSeleccionada === cat.id ? 'danger' : 'outline-danger'}
                  size="sm"
                  className="rounded-pill px-3 fw-semibold"
                  onClick={() => manejarSeleccionarCategoria(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Contador de resultados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Mostrando <strong>{productosFiltrados.length}</strong> plato(s)
        </span>
        {categoriaSeleccionada !== 'todas' && (
          <Badge bg="secondary" className="text-capitalize">
            Filtro: {categoriaSeleccionada}
          </Badge>
        )}
      </div>

      {/* Grilla de Productos */}
      {productosFiltrados.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-4 my-4">
          <Card.Body>
            <div className="display-4 text-muted mb-3">
              <i className="bi bi-search"></i>
            </div>
            <h4 className="fw-bold">No se encontraron productos</h4>
            <p className="text-muted mb-4">
              Intenta con otro término de búsqueda o selecciona otra categoría.
            </p>
            <Button
              variant="outline-danger"
              onClick={manejarLimpiarFiltros}
            >
              Restablecer filtros
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4" id="grilla-productos">
          {productosFiltrados.map((prod) => (
            <Col key={prod.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card transition-all">
                <Link to={`/productos/${prod.id}`} className="text-decoration-none">
                  <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                    <Card.Img
                      variant="top"
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-100 h-100 object-fit-cover product-img-zoom"
                    />
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-capitalize rounded-pill">
                      {prod.categoria}
                    </span>
                  </div>
                </Link>

                <Card.Body className="d-flex flex-column p-3">
                  <Link to={`/productos/${prod.id}`} className="text-decoration-none text-dark">
                    <Card.Title as="h3" className="h6 fw-bold mb-1 text-truncate">
                      {prod.nombre}
                    </Card.Title>
                  </Link>

                  <p className="text-muted small line-clamp-2 mb-2" style={{ minHeight: '38px' }}>
                    {prod.descripcion}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
                    <span className="text-danger fw-bold fs-5">
                      {formatearPrecio(prod.precio)}
                    </span>
                    <span className="small text-secondary">
                      Stock: <strong className={prod.stock <= prod.stockCritico ? 'text-danger' : ''}>{prod.stock}</strong>
                    </span>
                  </div>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-1 btn-agregar"
                    onClick={() => manejarAgregarAlCarrito(prod)}
                    disabled={prod.stock <= 0}
                  >
                    <i className="bi bi-cart-plus"></i>
                    <span>{prod.stock > 0 ? 'Añadir al carrito' : 'Agotado'}</span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
