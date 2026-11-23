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
  const { usuarioActual: currentUser, cerrarSesion, esAdmin: isAdmin, esVendedor: isVendedor } = useAuth();
  const { pedidos } = useOrders();

  // Si no hay sesión, vuelve al login.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Cierra la sesión.
  function manejarCerrarSesion() {
    cerrarSesion();
  }

  // Muestra los pedidos del usuario o todos si es administrador o vendedor.
  const misPedidos = pedidos.filter(
    (p) =>
      p.cliente?.toLowerCase() === currentUser.nombre?.toLowerCase() ||
      (p.clienteCorreo && p.clienteCorreo.toLowerCase() === currentUser.correo?.toLowerCase()) ||
      currentUser.rol === 'admin' ||
      currentUser.rol === 'vendedor'
  );

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Datos del usuario. */}
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
              <Badge
                bg={
                  currentUser.rol === 'admin'
                    ? 'danger'
                    : currentUser.rol === 'vendedor'
                    ? 'warning'
                    : 'secondary'
                }
                text={currentUser.rol === 'vendedor' ? 'dark' : undefined}
                className="px-3 py-2 text-uppercase"
              >
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
              {(isAdmin || isVendedor) && (
                <Button as={Link} to="/admin/pedidos" variant="outline-danger">
                  <i className="bi bi-shield-lock me-2"></i>
                  {isAdmin ? 'Ir al Panel Admin' : 'Ir al Panel Vendedor'}
                </Button>
              )}
              <Button variant="outline-secondary" onClick={manejarCerrarSesion}>
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </Button>
            </div>
          </Card>
        </Col>

        {/* Historial de pedidos. */}
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
