import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert, Container, Button } from 'react-bootstrap';

export default function ProtectedAdminRoute({ children }) {
  const { usuarioActual: currentUser, esAdmin: isAdmin, esVendedor: isVendedor } = useAuth();
  const location = useLocation();

  // Si no inició sesión, lo envía al login y recuerda la página que pidió.
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Debes iniciar sesión con perfil Administrador o Vendedor para acceder.',
        }}
        replace
      />
    );
  }

  // Si no es administrador ni vendedor, muestra un aviso de acceso restringido.
  if (!isAdmin && !isVendedor) {
    return (
      <Container className="my-5 py-5 text-center">
        <Alert variant="danger" className="shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <Alert.Heading className="fw-bold">
            <i className="bi bi-shield-x me-2"></i>Acceso Restringido
          </Alert.Heading>
          <p className="mb-3">
            Esta sección está reservada exclusivamente para el personal del restaurante (Administrador y Vendedor). Tu cuenta actual (<strong>{currentUser.correo}</strong>) tiene rol <strong>{currentUser.rol}</strong>.
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
