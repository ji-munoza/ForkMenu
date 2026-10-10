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
  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario con todos los campos requeridos
  const [formulario, setFormulario] = useState({
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

  // Estados de errores de validación y alerta global
  const [errores, setErrores] = useState({});
  const [alertaGeneral, setAlertaGeneral] = useState(null);

  /**
   * Maneja el cambio y formateo dinámico del campo RUN
   */
  function manejarCambioRun(evento) {
    const valorFormateado = formatearRUT(evento.target.value);
    setFormulario((prev) => ({ ...prev, run: valorFormateado }));

    const caracteresLimpios = valorFormateado.replace(/[^0-9kK]/gi, '');
    if (caracteresLimpios.length < 8) {
      setErrores((prev) => ({ ...prev, run: 'El RUN está incompleto.' }));
    } else {
      setErrores((prev) => ({ ...prev, run: '' }));
    }
  }

  /**
   * Maneja el cambio de valores en los campos de texto y selección
   */
  function manejarCambioInput(evento) {
    const { name, value } = evento.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
      // Si cambia de región, reiniciar la comuna seleccionada
      ...(name === 'region' ? { comuna: '' } : {}),
    }));

    // Limpiar el error del campo que se está modificando
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  }

  /**
   * Valida los datos y ejecuta el registro del nuevo usuario
   */
  function manejarEnvio(evento) {
    evento.preventDefault();
    setAlertaGeneral(null);
    const nuevosErrores = {};

    // 1. Validación de RUN
    const rutLimpio = formulario.run.replace(/[^0-9kK]/gi, '');
    if (rutLimpio.length < 8 || rutLimpio.length > 9) {
      nuevosErrores.run = 'El RUN debe tener entre 8 y 9 dígitos.';
    }

    // 2. Validación de nombre y apellidos
    const resultadoNombre = validarTexto(formulario.nombre, 1, 50, 'El nombre');
    if (!resultadoNombre.valido) nuevosErrores.nombre = resultadoNombre.mensaje;

    const resultadoApellidos = validarTexto(formulario.apellidos, 1, 100, 'Los apellidos');
    if (!resultadoApellidos.valido) nuevosErrores.apellidos = resultadoApellidos.mensaje;

    // 3. Validación de correo electrónico
    const resultadoCorreo = validarEmail(formulario.correo);
    if (!resultadoCorreo.valido) nuevosErrores.correo = resultadoCorreo.mensaje;

    // 4. Validación de contraseña
    const resultadoPass = validarPassword(formulario.contrasena);
    if (!resultadoPass.valido) nuevosErrores.contrasena = resultadoPass.mensaje;

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden.';
    }

    // 5. Validación de ubicación geográfica
    if (!formulario.region) nuevosErrores.region = 'Debes seleccionar una región.';
    if (!formulario.comuna) nuevosErrores.comuna = 'Debes seleccionar una comuna.';

    const resultadoDireccion = validarTexto(formulario.direccion, 3, 300, 'La dirección');
    if (!resultadoDireccion.valido) nuevosErrores.direccion = resultadoDireccion.mensaje;

    // Si existen errores, no continuar
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setAlertaGeneral({
        tipo: 'danger',
        texto: 'Por favor corrige los campos indicados antes de registrarte.',
      });
      return;
    }

    // Intentar registrar el usuario en el contexto
    const respuesta = registrarUsuario(formulario);
    if (!respuesta.success) {
      setAlertaGeneral({ tipo: 'danger', texto: respuesta.error });
      return;
    }

    // Navegar al login con mensaje de éxito
    navigate('/login', {
      state: { message: '¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.' },
    });
  }

  // Lista de comunas disponibles según la región seleccionada
  const comunasDisponibles = formulario.region ? comunasPorRegion[formulario.region] || [] : [];

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

            <Form id="form-registro" onSubmit={manejarEnvio} noValidate>
              <Row className="g-3">
                {/* RUN */}
                <Col xs={12}>
                  <Form.Group controlId="run">
                    <Form.Label className="fw-semibold">RUN</Form.Label>
                    <Form.Control
                      type="text"
                      name="run"
                      placeholder="Ej: 19.011.022-K"
                      value={formulario.run}
                      onChange={manejarCambioRun}
                      maxLength={12}
                      isInvalid={Boolean(errores.run)}
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
                      value={formulario.nombre}
                      onChange={manejarCambioInput}
                      maxLength={50}
                      isInvalid={Boolean(errores.nombre)}
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
                      value={formulario.apellidos}
                      onChange={manejarCambioInput}
                      maxLength={100}
                      isInvalid={Boolean(errores.apellidos)}
                    />
                    <Form.Control.Feedback type="invalid" id="error-apellidos">
                      {errores.apellidos}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Correo Electrónico */}
                <Col xs={12}>
                  <Form.Group controlId="correo">
                    <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      placeholder="ejemplo@duoc.cl o @gmail.com"
                      value={formulario.correo}
                      onChange={manejarCambioInput}
                      isInvalid={Boolean(errores.correo)}
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
                      value={formulario.contrasena}
                      onChange={manejarCambioInput}
                      maxLength={10}
                      isInvalid={Boolean(errores.contrasena)}
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
                      value={formulario.confirmarContrasena}
                      onChange={manejarCambioInput}
                      maxLength={10}
                      isInvalid={Boolean(errores.confirmarContrasena)}
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
                      value={formulario.region}
                      onChange={manejarCambioInput}
                      isInvalid={Boolean(errores.region)}
                    >
                      <option value="">-- Seleccione la región --</option>
                      {Object.keys(comunasPorRegion).map((claveRegion) => (
                        <option key={claveRegion} value={claveRegion}>
                          {nombresRegiones[claveRegion] || claveRegion}
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
                      value={formulario.comuna}
                      onChange={manejarCambioInput}
                      disabled={!formulario.region}
                      isInvalid={Boolean(errores.comuna)}
                    >
                      <option value="">-- Seleccione la comuna --</option>
                      {comunasDisponibles.map((comunaNombre) => (
                        <option key={comunaNombre} value={comunaNombre.toLowerCase()}>
                          {comunaNombre}
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
                      value={formulario.direccion}
                      onChange={manejarCambioInput}
                      maxLength={300}
                      isInvalid={Boolean(errores.direccion)}
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
