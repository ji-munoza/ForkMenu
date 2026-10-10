import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import {
  formatearRUT,
  validarEmail,
  validarPassword,
  validarTexto,
} from '../utils/validaciones';
import { comunasPorRegion, nombresRegiones } from '../utils/dataInicial';

export const meta = {
  title: 'ForkMenu - Registro de Usuario',
  layout: 'main',
};

export default function RegistroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    region: '',
    comuna: '',
    direccion: '',
  });

  const [errores, setErrores] = useState({});
  const [alertaGeneral, setAlertaGeneral] = useState(null);

  const handleRunChange = (e) => {
    const formateado = formatearRUT(e.target.value);
    setForm((prev) => ({ ...prev, run: formateado }));

    const limpio = formateado.replace(/[^0-9kK]/gi, '');
    if (limpio.length < 8) {
      setErrores((prev) => ({ ...prev, run: 'El RUN está incompleto.' }));
    } else {
      setErrores((prev) => ({ ...prev, run: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Si cambia de región, limpiar comuna
      ...(name === 'region' ? { comuna: '' } : {}),
    }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertaGeneral(null);
    const nuevosErrores = {};

    const rutLimpio = form.run.replace(/[^0-9kK]/gi, '');
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      nuevosErrores.run = 'El RUN debe tener entre 8 y 9 dígitos.';
    }

    const resNombre = validarTexto(form.nombre, 1, 50, 'El nombre');
    if (!resNombre.valido) nuevosErrores.nombre = resNombre.mensaje;

    const resApellidos = validarTexto(form.apellidos, 1, 100, 'Los apellidos');
    if (!resApellidos.valido) nuevosErrores.apellidos = resApellidos.mensaje;

    const resCorreo = validarEmail(form.correo);
    if (!resCorreo.valido) nuevosErrores.correo = resCorreo.mensaje;

    const resPass = validarPassword(form.contrasena);
    if (!resPass.valido) nuevosErrores.contrasena = resPass.mensaje;

    if (form.contrasena !== form.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden.';
    }

    if (!form.region) nuevosErrores.region = 'Debes seleccionar una región.';
    if (!form.comuna) nuevosErrores.comuna = 'Debes seleccionar una comuna.';

    const resDir = validarTexto(form.direccion, 3, 300, 'La dirección');
    if (!resDir.valido) nuevosErrores.direccion = resDir.mensaje;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setAlertaGeneral({
        tipo: 'danger',
        texto: 'Por favor corrige los campos indicados antes de registrarte.',
      });
      return;
    }

    const res = register(form);
    if (!res.success) {
      setAlertaGeneral({ tipo: 'danger', texto: res.error });
      return;
    }

    navigate('/login', {
      state: { message: '¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.' },
    });
  };

  const comunasDisponibles = form.region ? comunasPorRegion[form.region] || [] : [];

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow border-0 rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div className="fs-1 text-danger mb-2">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h1 className="h3 fw-bold">Crear Cuenta</h1>
              <p className="text-muted small">
                Regístrate para realizar pedidos más rápido, acumular cupones y ver tu historial.
              </p>
            </div>

            {alertaGeneral && (
              <Alert variant={alertaGeneral.tipo} dismissible onClose={() => setAlertaGeneral(null)} className="mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {alertaGeneral.texto}
              </Alert>
            )}

            <Form id="form-registro" onSubmit={handleSubmit} noValidate>
              <Row className="g-3">
                {/* RUN */}
                <Col xs={12}>
                  <Form.Group controlId="run">
                    <Form.Label className="fw-semibold">RUN</Form.Label>
                    <Form.Control
                      type="text"
                      name="run"
                      placeholder="Ej: 19.011.022-K"
                      value={form.run}
                      onChange={handleRunChange}
                      maxLength={12}
                      isInvalid={!!errores.run}
                    />
                    <Form.Control.Feedback type="invalid" id="error-run">
                      {errores.run}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Nombre */}
                <Col md={6}>
                  <Form.Group controlId="nombre">
                    <Form.Label className="fw-semibold">Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      placeholder="Juan"
                      value={form.nombre}
                      onChange={handleChange}
                      maxLength={50}
                      isInvalid={!!errores.nombre}
                    />
                    <Form.Control.Feedback type="invalid" id="error-nombre">
                      {errores.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Apellidos */}
                <Col md={6}>
                  <Form.Group controlId="apellidos">
                    <Form.Label className="fw-semibold">Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidos"
                      placeholder="Pérez Soto"
                      value={form.apellidos}
                      onChange={handleChange}
                      maxLength={100}
                      isInvalid={!!errores.apellidos}
                    />
                    <Form.Control.Feedback type="invalid" id="error-apellidos">
                      {errores.apellidos}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Correo */}
                <Col xs={12}>
                  <Form.Group controlId="correo">
                    <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      placeholder="ejemplo@duoc.cl o @gmail.com"
                      value={form.correo}
                      onChange={handleChange}
                      isInvalid={!!errores.correo}
                    />
                    <Form.Text className="text-muted small">
                      Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid" id="error-correo">
                      {errores.correo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Contraseña */}
                <Col md={6}>
                  <Form.Group controlId="contrasena">
                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="contrasena"
                      placeholder="4 a 10 caracteres"
                      value={form.contrasena}
                      onChange={handleChange}
                      maxLength={10}
                      isInvalid={!!errores.contrasena}
                    />
                    <Form.Control.Feedback type="invalid" id="error-contrasena">
                      {errores.contrasena}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Confirmar Contraseña */}
                <Col md={6}>
                  <Form.Group controlId="confirmar-contrasena">
                    <Form.Label className="fw-semibold">Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmarContrasena"
                      placeholder="Repite la contraseña"
                      value={form.confirmarContrasena}
                      onChange={handleChange}
                      maxLength={10}
                      isInvalid={!!errores.confirmarContrasena}
                    />
                    <Form.Control.Feedback type="invalid" id="error-confirmar-contrasena">
                      {errores.confirmarContrasena}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Región */}
                <Col md={6}>
                  <Form.Group controlId="region">
                    <Form.Label className="fw-semibold">Región</Form.Label>
                    <Form.Select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      isInvalid={!!errores.region}
                    >
                      <option value="">-- Seleccione la región --</option>
                      {Object.keys(comunasPorRegion).map((regKey) => (
                        <option key={regKey} value={regKey}>
                          {nombresRegiones[regKey] || regKey}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.region}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Comuna */}
                <Col md={6}>
                  <Form.Group controlId="comuna">
                    <Form.Label className="fw-semibold">Comuna</Form.Label>
                    <Form.Select
                      name="comuna"
                      value={form.comuna}
                      onChange={handleChange}
                      disabled={!form.region}
                      isInvalid={!!errores.comuna}
                    >
                      <option value="">-- Seleccione la comuna --</option>
                      {comunasDisponibles.map((c) => (
                        <option key={c} value={c.toLowerCase()}>
                          {c}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.comuna}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Dirección */}
                <Col xs={12}>
                  <Form.Group controlId="direccion">
                    <Form.Label className="fw-semibold">Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      placeholder="Calle, número, departamento..."
                      value={form.direccion}
                      onChange={handleChange}
                      maxLength={300}
                      isInvalid={!!errores.direccion}
                    />
                    <Form.Control.Feedback type="invalid" id="error-direccion">
                      {errores.direccion}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Botón de Enviar */}
                <Col xs={12} className="mt-4">
                  <Button type="submit" variant="danger" size="lg" className="w-100 fw-bold shadow-sm">
                    Crear mi Cuenta
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="text-center mt-4 text-muted small">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                Inicia sesión aquí
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
