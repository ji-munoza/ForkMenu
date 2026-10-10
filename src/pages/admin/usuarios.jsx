import React, { useState } from 'react';
import { Card, Table, Form, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatearRUT } from '../../utils/validaciones';

export const meta = {
  title: 'ForkMenu Admin - Usuarios y Roles',
  layout: 'admin',
  adminOnly: true,
};

export default function AdminUsuariosPage() {
  const { usersList, updateUserRole, deleteUser, addUser } = useAuth();

  const [form, setForm] = useState({
    run: '',
    correo: '',
    rol: 'cliente',
  });

  const [feedback, setFeedback] = useState(null);

  const handleRunChange = (e) => {
    setForm((prev) => ({ ...prev, run: formatearRUT(e.target.value) }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleRolChange = (identificador, nuevoRol) => {
    updateUserRole(identificador, nuevoRol);
    setFeedback({ tipo: 'info', texto: `Rol de ${identificador} actualizado a "${nuevoRol}".` });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleEliminar = (identificador) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${identificador}?`)) {
      deleteUser(identificador);
      setFeedback({ tipo: 'warning', texto: `Usuario ${identificador} eliminado.` });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.run || !form.correo) {
      setFeedback({ tipo: 'danger', texto: 'RUN y Correo son obligatorios.' });
      return;
    }

    const res = addUser({
      run: form.run.trim(),
      nombre: 'Usuario Administrado',
      correo: form.correo.trim().toLowerCase(),
      contrasena: '1234',
      rol: form.rol,
    });

    setFeedback({ tipo: 'success', texto: `${res.message} (Contraseña asignada: 1234)` });
    setForm({ run: '', correo: '', rol: 'cliente' });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Gestión de Usuarios y Roles</h1>
        <p className="text-muted mb-0">Asigna permisos de Administrador, Vendedor o Cliente para el personal y comensales.</p>
      </div>

      {feedback && (
        <Alert variant={feedback.tipo} dismissible onClose={() => setFeedback(null)} className="mb-4 shadow-sm">
          <i className="bi bi-info-circle-fill me-2"></i>
          {feedback.texto}
        </Alert>
      )}

      {/* Formulario en Card */}
      <Card className="shadow-sm border-0 rounded-4 mb-4 bg-white">
        <Card.Header className="bg-white py-3 border-bottom">
          <h2 className="card-title h5 mb-0 fw-bold">Crear / Asignar Rol de Usuario</h2>
        </Card.Header>
        <Card.Body className="p-4">
          <Form id="form-usuario-admin" onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="run">
                  <Form.Label className="fw-semibold small">RUN</Form.Label>
                  <Form.Control
                    type="text"
                    id="run-usuario"
                    placeholder="Ej: 19.011.022-K"
                    value={form.run}
                    onChange={handleRunChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="correo">
                  <Form.Label className="fw-semibold small">Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    id="correo-usuario"
                    placeholder="ejemplo@forkmenu.cl"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="rol">
                  <Form.Label className="fw-semibold small">Tipo de Usuario (Rol)</Form.Label>
                  <Form.Select
                    id="rol-usuario"
                    value={form.rol}
                    onChange={handleChange}
                    required
                  >
                    <option value="cliente">Cliente (Solo Tienda)</option>
                    <option value="vendedor">Vendedor (Ver Pedidos)</option>
                    <option value="admin">Administrador (Acceso Total)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} className="text-end mt-3">
                <Button type="submit" variant="danger" className="px-4 fw-semibold shadow-sm">
                  <i className="bi bi-person-plus me-1"></i> Guardar Usuario
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Tabla de Usuarios Registrados */}
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h2 className="card-title h5 mb-0 fw-bold">Lista de Usuarios del Sistema</h2>
          <Badge bg="secondary">{usersList.length} registrados</Badge>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>RUN / Nombre</th>
                  <th>Correo</th>
                  <th>Rol Asignado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="tabla-usuarios-body">
                {usersList.map((user, idx) => (
                  <tr key={user.correo || idx}>
                    <td>
                      <strong>{user.run || 'Sin RUN'}</strong>
                      <div className="small text-muted">{user.nombre || 'Usuario'}</div>
                    </td>
                    <td>{user.correo}</td>
                    <td style={{ minWidth: '180px' }}>
                      <Form.Select
                        size="sm"
                        value={user.rol || 'cliente'}
                        onChange={(e) => handleRolChange(user.correo, e.target.value)}
                        className={`fw-semibold ${user.rol === 'admin' ? 'border-danger text-danger' : ''}`}
                      >
                        <option value="cliente">Cliente (Solo Tienda)</option>
                        <option value="vendedor">Vendedor (Ver Pedidos)</option>
                        <option value="admin">Administrador (Acceso Total)</option>
                      </Form.Select>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleEliminar(user.correo)}
                        title="Eliminar usuario"
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
