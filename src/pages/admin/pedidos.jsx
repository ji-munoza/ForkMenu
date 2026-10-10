import React, { useState } from 'react';
import { Card, Table, Form, Badge, Alert } from 'react-bootstrap';
import { useOrders } from '../../context/OrderContext';
import { formatearPrecio } from '../../utils/validaciones';

export const meta = {
  title: 'ForkMenu Admin - Gestión de Pedidos',
  layout: 'admin',
  adminOnly: true,
};

const ESTADOS_DISPONIBLES = [
  'En preparación',
  'Listo para retiro',
  'En camino',
  'Entregado',
  'Cancelado',
];

export default function AdminPedidosPage() {
  const { pedidos, updateOrderStatus } = useOrders();
  const [feedback, setFeedback] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const handleEstadoChange = (codigo, nuevoEstado) => {
    updateOrderStatus(codigo, nuevoEstado);
    setFeedback(`El pedido ${codigo} cambió a estado: "${nuevoEstado}"`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado === 'todos') return true;
    return p.estado === filtroEstado;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Historial y Control de Pedidos</h1>
          <p className="text-muted mb-0">Gestiona los pedidos entrantes y actualiza su estado en cocina o despacho.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0 small fw-bold text-muted text-nowrap">Filtrar por estado:</Form.Label>
          <Form.Select
            size="sm"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="todos">Todos ({pedidos.length})</option>
            {ESTADOS_DISPONIBLES.map((est) => (
              <option key={est} value={est}>
                {est}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {feedback && (
        <Alert variant="info" dismissible onClose={() => setFeedback(null)} className="mb-4 shadow-sm">
          <i className="bi bi-info-circle-fill me-2"></i>
          {feedback}
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h2 className="card-title h5 mb-0 fw-bold">Gestión y Control de Pedidos</h2>
          <Badge bg="secondary">{pedidosFiltrados.length} pedidos</Badge>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Modalidad</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Detalle de Items</th>
                </tr>
              </thead>
              <tbody id="tabla-pedidos-body">
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">
                      No hay pedidos registrados para el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((ped, idx) => (
                    <tr key={ped.codigo || idx}>
                      <td>
                        <code>{ped.codigo}</code>
                        <div className="small text-muted">{ped.fecha}</div>
                      </td>
                      <td>
                        <strong>{ped.cliente}</strong>
                      </td>
                      <td>
                        <span className="small">{ped.modalidad}</span>
                      </td>
                      <td style={{ minWidth: '170px' }}>
                        <Form.Select
                          size="sm"
                          value={ped.estado}
                          onChange={(e) => handleEstadoChange(ped.codigo, e.target.value)}
                          className={`fw-semibold ${
                            ped.estado === 'Entregado'
                              ? 'text-success'
                              : ped.estado === 'Cancelado'
                              ? 'text-danger'
                              : 'text-warning'
                          }`}
                        >
                          {ESTADOS_DISPONIBLES.map((est) => (
                            <option key={est} value={est}>
                              {est}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td className="fw-bold text-danger">
                        {formatearPrecio(ped.total)}
                      </td>
                      <td className="small text-secondary">
                        {ped.items && ped.items.length > 0 ? (
                          <ul className="list-unstyled mb-0">
                            {ped.items.map((i, iIdx) => (
                              <li key={iIdx}>
                                • {i.nombre} <strong className="text-dark">x{i.cantidad}</strong>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          'Sin items'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
