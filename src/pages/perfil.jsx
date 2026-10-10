import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatearPrecio } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Mi Perfil',
  layout: 'main',
};

export default function PerfilPage() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { pedidos } = useOrders();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Filtrar pedidos realizados por este usuario o ver todos si admin
  const misPedidos = pedidos.filter(
    (p) =>
      p.cliente?.toLowerCase() === currentUser.nombre?.toLowerCase() ||
      currentUser.rol === 'admin'
  );

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Tarjeta de Datos del Usuario */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-4 p-4 bg-white text-center">
            <div className="display-4 text-danger mb-3">
              <i className="bi bi-person-circle"></i>
            </div>
            <h1 className="h4 fw-bold mb-1" id="perfil-nombre">
              {currentUser.nombre}
            </h1>
            <p className="text-muted small mb-2" id="perfil-correo">
              {currentUser.correo}
            </p>
            <div className="mb-3">
              <Badge bg={currentUser.rol === 'admin' ? 'danger' : 'secondary'} className="px-3 py-2 text-uppercase">
                Rol: {currentUser.rol}
              </Badge>
            </div>

            <div className="text-start bg-light p-3 rounded-3 mb-4 small">
              <div className="mb-2">
                <span className="text-muted d-block">RUN:</span>
                <strong>{currentUser.run || 'No especificado'}</strong>
              </div>
              <div>
                <span className="text-muted d-block">Tipo de Cuenta:</span>
                <strong className="text-capitalize">{currentUser.rol}</strong>
              </div>
            </div>

            <div className="d-grid gap-2">
              {isAdmin && (
                <Button as={Link} to="/admin/pedidos" variant="outline-danger">
                  <i className="bi bi-shield-lock me-2"></i>Ir al Panel Admin
                </Button>
              )}
              <Button variant="outline-secondary" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </Button>
            </div>
          </Card>
        </Col>

        {/* Historial de Pedidos */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-5">
                <i className="bi bi-clock-history me-2 text-danger"></i>Historial de Pedidos
              </span>
              <Badge bg="light" text="dark" className="border">
                {misPedidos.length} pedido(s)
              </Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {misPedidos.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-receipt display-4 d-block mb-2 text-black-50"></i>
                  <p>Aún no has registrado pedidos en esta cuenta.</p>
                  <Button as={Link} to="/productos" variant="danger" size="sm">
                    Ir al Menú
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Modalidad</th>
                        <th>Estado</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misPedidos.map((ped, idx) => (
                        <tr key={idx}>
                          <td>
                            <code>{ped.codigo}</code>
                          </td>
                          <td className="small text-muted">{ped.fecha}</td>
                          <td className="small">{ped.modalidad}</td>
                          <td>
                            <Badge
                              bg={
                                ped.estado === 'Entregado'
                                  ? 'success'
                                  : ped.estado === 'Cancelado'
                                  ? 'danger'
                                  : 'warning'
                              }
                              text={ped.estado === 'En preparación' ? 'dark' : 'white'}
                              className="rounded-pill px-2 py-1"
                            >
                              {ped.estado}
                            </Badge>
                          </td>
                          <td className="text-end fw-bold text-danger">
                            {formatearPrecio(ped.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
