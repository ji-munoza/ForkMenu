import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert, Container, Button } from 'react-bootstrap';

export default function ProtectedAdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, message: 'Debes iniciar sesión con perfil Administrador para acceder.' }} replace />;
  }

  if (!isAdmin) {
    return (
      <Container className="my-5 py-5 text-center">
        <Alert variant="danger" className="shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <Alert.Heading className="fw-bold">
            <i className="bi bi-shield-x me-2"></i>Acceso Restringido
          </Alert.Heading>
          <p className="mb-3">
            Esta sección está reservada exclusivamente para administradores del restaurante. Tu cuenta actual (<strong>{currentUser.correo}</strong>) tiene rol <strong>{currentUser.rol}</strong>.
          </p>
          <hr />
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-danger" href="/">
              Volver a la Tienda
            </Button>
            <Button variant="danger" href="/login">
              Iniciar con otra cuenta
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return children;
}
