import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { validarEmail, validarTexto } from '../utils/validaciones';

export const meta = {
  title: 'ForkMenu - Contacto',
  layout: 'main',
};

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  });

  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    const resNombre = validarTexto(formData.nombre, 2, 100, 'El nombre');
    if (!resNombre.valido) nuevosErrores.nombre = resNombre.mensaje;

    const resCorreo = validarEmail(formData.correo);
    if (!resCorreo.valido) nuevosErrores.correo = resCorreo.mensaje;

    const resMensaje = validarTexto(formData.mensaje, 5, 500, 'El mensaje');
    if (!resMensaje.valido) nuevosErrores.mensaje = resMensaje.mensaje;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setEnviado(true);
    setFormData({ nombre: '', correo: '', mensaje: '' });
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="fs-1 text-danger mb-2">
                <i className="bi bi-envelope-paper-fill"></i>
              </div>
              <h1 className="h3 fw-bold">Contáctanos</h1>
              <p className="text-muted">
                Escríbenos tus dudas, sugerencias o comentarios y te responderemos a la brevedad.
              </p>
            </div>

            {enviado && (
              <Alert variant="success" dismissible onClose={() => setEnviado(false)} className="mb-4">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Tu mensaje ha sido enviado exitosamente! Nos pondremos en contacto contigo pronto.
              </Alert>
            )}

            <Form id="form-contacto" onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  isInvalid={!!errores.nombre}
                />
                <Form.Control.Feedback type="invalid" id="error-nombre">
                  {errores.nombre}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="correo">
                <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="ejemplo@duoc.cl"
                  value={formData.correo}
                  onChange={handleChange}
                  isInvalid={!!errores.correo}
                />
                <Form.Control.Feedback type="invalid" id="error-correo">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="mensaje">
                <Form.Label className="fw-semibold">Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  isInvalid={!!errores.mensaje}
                />
                <Form.Control.Feedback type="invalid" id="error-mensaje">
                  {errores.mensaje}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="danger" size="lg" className="w-100 fw-bold shadow-sm">
                <i className="bi bi-send-fill me-2"></i>Enviar Mensaje
              </Button>
            </Form>

            <hr className="my-5" />

            <Row className="g-3 text-center text-md-start">
              <Col md={4}>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-geo-alt-fill text-danger fs-3"></i>
                  <div>
                    <strong className="d-block">Dirección</strong>
                    <small className="text-muted">Av. Gastronomía 1234, Santiago</small>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-telephone-fill text-danger fs-3"></i>
                  <div>
                    <strong className="d-block">Teléfono</strong>
                    <small className="text-muted">+56 9 8765 4321</small>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-clock-fill text-danger fs-3"></i>
                  <div>
                    <strong className="d-block">Horario</strong>
                    <small className="text-muted">Lun - Dom: 12:00 a 23:00</small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
