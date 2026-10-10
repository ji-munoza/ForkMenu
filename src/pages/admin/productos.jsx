import React, { useState } from 'react';
import { Card, Table, Form, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useProducts } from '../../context/ProductContext';
import { formatearPrecio } from '../../utils/validaciones';

export const meta = {
  title: 'ForkMenu Admin - Productos y Stock',
  layout: 'admin',
  adminOnly: true,
};

export default function AdminProductosPage() {
  const { productos, actualizarStock, guardarProducto } = useProducts();

  // Estado del formulario de creación y edición
  const [formulario, setFormulario] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    stockCritico: '',
    descripcion: '',
    imagen: '',
  });

  // Estado de los inputs de stock editados directamente en la tabla
  const [stocksEditados, setStocksEditados] = useState({});
  const [feedback, setFeedback] = useState(null);

  /**
   * Maneja el cambio de inputs en el formulario de producto
   */
  function manejarCambioFormulario(evento) {
    const { id, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [id]: value }));
  }

  /**
   * Actualiza el valor temporal en el input de stock de la fila
   */
  function manejarCambioStockInput(id, valor) {
    setStocksEditados((prev) => ({ ...prev, [id]: valor }));
  }

  /**
   * Guarda el stock modificado para un producto
   */
  function manejarGuardarStock(id) {
    const valor = stocksEditados[id];
    if (valor === undefined || valor === '') return;

    const parsed = parseInt(valor, 10);
    if (isNaN(parsed) || parsed < 0) {
      setFeedback({ tipo: 'danger', texto: 'Ingresa una cantidad de stock válida.' });
      return;
    }

    actualizarStock(id, parsed);
    setFeedback({ tipo: 'success', texto: 'Stock actualizado exitosamente.' });
    setTimeout(() => setFeedback(null), 3000);
  }

  /**
   * Valida y guarda un nuevo producto o actualiza uno existente
   */
  function manejarEnvio(evento) {
    evento.preventDefault();
    if (!formulario.codigo || !formulario.nombre || !formulario.precio || !formulario.stock) {
      setFeedback({ tipo: 'danger', texto: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    const respuesta = guardarProducto({
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria || 'otros',
      precio: parseFloat(formulario.precio),
      stock: parseInt(formulario.stock, 10),
      stockCritico: parseInt(formulario.stockCritico, 10) || 0,
      descripcion: formulario.descripcion || 'Producto agregado desde el panel de administración.',
      imagen:
        formulario.imagen ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    });

    setFeedback({ tipo: 'success', texto: respuesta.message });
    setFormulario({
      codigo: '',
      nombre: '',
      categoria: '',
      precio: '',
      stock: '',
      stockCritico: '',
      descripcion: '',
      imagen: '',
    });
    setTimeout(() => setFeedback(null), 3500);
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Gestión y Registro de Productos</h1>
        <p className="text-muted mb-0">Controla el inventario de la carta y mantén actualizados los límites críticos.</p>
      </div>

      {feedback && (
        <Alert variant={feedback.tipo} dismissible onClose={() => setFeedback(null)} className="mb-4 shadow-sm">
          <i className={`bi ${feedback.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {feedback.texto}
        </Alert>
      )}

      {/* Formulario en Card */}
      <Card className="shadow-sm border-0 rounded-4 mb-4 bg-white">
        <Card.Header className="bg-white py-3 border-bottom">
          <h2 className="card-title h5 mb-0 fw-bold">Agregar / Editar Producto</h2>
        </Card.Header>
        <Card.Body className="p-4">
          <Form id="form-producto" onSubmit={manejarEnvio}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group controlId="codigo">
                  <Form.Label className="fw-semibold small">Código</Form.Label>
                  <Form.Control
                    type="text"
                    id="codigo"
                    placeholder="Ej: FM-107"
                    minLength={3}
                    value={formulario.codigo}
                    onChange={manejarCambioFormulario}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group controlId="nombre">
                  <Form.Label className="fw-semibold small">Nombre del Producto</Form.Label>
                  <Form.Control
                    type="text"
                    id="nombre"
                    placeholder="Ej: Empanada de Pino Horno"
                    maxLength={100}
                    value={formulario.nombre}
                    onChange={manejarCambioFormulario}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="categoria">
                  <Form.Label className="fw-semibold small">Categoría</Form.Label>
                  <Form.Select
                    id="categoria"
                    value={formulario.categoria}
                    onChange={manejarCambioFormulario}
                    required
                  >
                    <option value="">Seleccione categoría</option>
                    <option value="hamburguesas">Hamburguesas</option>
                    <option value="pizzas">Pizzas</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="postres">Postres</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="precio">
                  <Form.Label className="fw-semibold small">Precio ($ CLP)</Form.Label>
                  <Form.Control
                    type="number"
                    id="precio"
                    min={0}
                    placeholder="Ej: 5000"
                    value={formulario.precio}
                    onChange={manejarCambioFormulario}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="stock">
                  <Form.Label className="fw-semibold small">Stock Total</Form.Label>
                  <Form.Control
                    type="number"
                    id="stock"
                    min={0}
                    placeholder="Ej: 20"
                    value={formulario.stock}
                    onChange={manejarCambioFormulario}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="stockCritico">
                  <Form.Label className="fw-semibold small">Stock Crítico (Alerta)</Form.Label>
                  <Form.Control
                    type="number"
                    id="stockCritico"
                    min={0}
                    placeholder="Ej: 5"
                    value={formulario.stockCritico}
                    onChange={manejarCambioFormulario}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group controlId="descripcion">
                  <Form.Label className="fw-semibold small">Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    id="descripcion"
                    placeholder="Ingredientes y notas del plato..."
                    value={formulario.descripcion}
                    onChange={manejarCambioFormulario}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="imagen">
                  <Form.Label className="fw-semibold small">URL de Imagen (Opcional)</Form.Label>
                  <Form.Control
                    type="url"
                    id="imagen"
                    placeholder="https://images.unsplash.com/..."
                    value={formulario.imagen}
                    onChange={manejarCambioFormulario}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="text-end mt-3">
                <Button type="submit" variant="danger" className="px-4 fw-semibold shadow-sm">
                  <i className="bi bi-save me-1"></i> Guardar Producto
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Tabla de Control de Stock */}
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h2 className="card-title h5 mb-0 fw-bold">Inventario y Control de Stock</h2>
          <Badge bg="secondary">{productos.length} platos</Badge>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock Actual</th>
                  <th>Stock Crítico</th>
                  <th>Categoría</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="tabla-productos-body">
                {productos.map((p) => {
                  const esCritico = p.stock <= (p.stockCritico || 0);
                  const valorStock =
                    stocksEditados[p.id] !== undefined ? stocksEditados[p.id] : p.stock;

                  return (
                    <tr key={p.id} className={esCritico ? 'table-danger' : ''}>
                      <td>
                        <code>{p.codigo}</code>
                      </td>
                      <td>
                        <strong>{p.nombre}</strong>
                      </td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="number"
                            min={0}
                            size="sm"
                            style={{ width: '85px' }}
                            value={valorStock}
                            onChange={(e) => manejarCambioStockInput(p.id, e.target.value)}
                            id={`stock-input-${p.id}`}
                          />
                          {esCritico && (
                            <Badge bg="danger" className="d-flex align-items-center gap-1">
                              <i className="bi bi-exclamation-triangle"></i>Crítico
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>{p.stockCritico || 0}</td>
                      <td>
                        <Badge bg="secondary" className="text-capitalize">
                          {p.categoria}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => manejarGuardarStock(p.id)}
                        >
                          Guardar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
