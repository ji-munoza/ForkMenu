import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const meta = {
  title: 'ForkMenu - Iniciar Sesión',
  layout: 'main',
};

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(location.state?.message || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(correo, contrasena);
    if (!res.success) {
      setError(res.error);
      return;
    }

    if (res.user.rol === 'admin') {
      navigate('/admin/pedidos');
    } else {
      const destino = location.state?.from?.pathname || '/';
      navigate(destino);
    }
  };

  const llenarDemo = (emailDemo, passDemo) => {
    setCorreo(emailDemo);
    setContrasena(passDemo);
    setError('');
  };

  return (
    <Container className="my-5 d-flex align-items-center justify-content-center" style={{ minHeight: '65vh' }}>
      <Card className="shadow border-0 rounded-4 p-4 p-md-5 bg-white w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div className="fs-1 text-danger mb-2">
            <i className="bi bi-box-arrow-in-right"></i>
          </div>
          <h1 className="h3 fw-bold">Iniciar Sesión</h1>
          <p className="text-muted small">Ingresa tus credenciales para acceder a ForkMenu.</p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Form id="form-login" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="correo">
            <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="admin@forkmenu.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="contrasena">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="danger" size="lg" className="w-100 fw-bold shadow-sm mb-3">
            Ingresar
          </Button>
        </Form>

        {/* Cuentas Demo Rápidas */}
        <div className="p-3 bg-light rounded-3 my-3 small border">
          <span className="fw-bold text-muted d-block mb-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
            ⚡ Cuentas Demo Rápidas:
          </span>
          <div className="d-flex flex-column gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-dark text-start d-flex justify-content-between align-items-center py-1"
              onClick={() => llenarDemo('admin@forkmenu.cl', 'admin123')}
            >
              <span>admin@forkmenu.cl</span>
              <Badge bg="danger">Admin</Badge>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center py-1"
              onClick={() => llenarDemo('juan.perez@duoc.cl', 'cliente123')}
            >
              <span>juan.perez@duoc.cl</span>
              <Badge bg="secondary">Cliente</Badge>
            </button>
          </div>
        </div>

        <div className="text-center mt-3 text-muted small">
          ¿No tienes una cuenta aún?{' '}
          <Link to="/registro" className="text-danger fw-semibold text-decoration-none">
            Regístrate aquí
          </Link>
        </div>
      </Card>
    </Container>
  );
}
