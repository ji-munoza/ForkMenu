import React from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';

export const meta = {
  title: 'ForkMenu - Nosotros',
  layout: 'main',
};

const IMAGENES_CARRUSEL = [
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000',
    alt: 'Interior minimalista del restaurante',
    titulo: 'Un ambiente pensado para compartir',
    descripcion: 'Espacios cómodos, cálidos y modernos para tus mejores momentos.',
  },
  {
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000',
    alt: 'Preparación de platos deliciosos',
    titulo: 'Pasión artesanal en cada receta',
    descripcion: 'Cocineros con vocación y respeto por cada ingrediente fresco.',
  },
  {
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
    alt: 'Ambiente y mesas del local',
    titulo: 'Tecnología al servicio del sabor',
    descripcion: 'Pide desde tu mesa en segundos sin esperas ni fricciones.',
  },
  {
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000',
    alt: 'Detalle culinario',
    titulo: 'Ingredientes de temporada seleccionados',
    descripcion: 'Apoyamos la economía local aliándonos con productores chilenos.',
  },
];

export default function NosotrosPage() {
  return (
    <Container className="my-5">
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
        {/* Encabezado */}
        <div className="text-center mb-5">
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold mb-2">
            Nuestra Historia
          </span>
          <h1 className="h2 fw-bold d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-info-circle-fill text-danger"></i>Sobre ForkMenu
          </h1>
          <p className="text-secondary lead fs-5 mt-3 max-w-750 mx-auto">
            ForkMenu nace para resolver un problema cotidiano de los restaurantes:
            pedidos desordenados y tiempos de espera largos. Ofrecemos una forma
            simple de explorar el menú, armar el pedido y elegir cómo recibirlo:
            a domicilio, retiro en el local o directamente desde la mesa.
          </p>
        </div>

        {/* Carrusel de Bootstrap */}
        <div className="shadow rounded-4 overflow-hidden mb-5">
          <Carousel id="carruselNosotros" fade interval={4000}>
            {IMAGENES_CARRUSEL.map((img, idx) => (
              <Carousel.Item key={idx}>
                <div style={{ height: '440px', backgroundColor: '#000' }}>
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="d-block w-100 h-100 object-fit-cover opacity-85"
                  />
                </div>
                <Carousel.Caption className="bg-dark bg-opacity-60 p-3 rounded-3 d-none d-md-block">
                  <h3 className="h5 fw-bold text-white mb-1">{img.titulo}</h3>
                  <p className="small mb-0 text-light">{img.descripcion}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Misión, Visión y Valores */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 text-center">
              <div className="fs-1 text-danger mb-3">
                <i className="bi bi-bullseye"></i>
              </div>
              <h2 className="h5 fw-bold mb-2">Nuestra Misión</h2>
              <p className="text-muted small mb-0">
                Transformar el momento de ordenar comida en una experiencia ágil, fluida y sabrosa, conectando cocinas apasionadas con comensales exigentes.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 text-center">
              <div className="fs-1 text-danger mb-3">
                <i className="bi bi-eye-fill"></i>
              </div>
              <h2 className="h5 fw-bold mb-2">Nuestra Visión</h2>
              <p className="text-muted small mb-0">
                Ser la plataforma gastronómica de referencia que une tecnología intuitiva y estándares culinarios artesanales en toda la región.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4 text-center">
              <div className="fs-1 text-danger mb-3">
                <i className="bi bi-heart-fill"></i>
              </div>
              <h2 className="h5 fw-bold mb-2">Nuestros Valores</h2>
              <p className="text-muted small mb-0">
                Transparencia en los ingredientes, rapidez sin sacrificar sabor, atención cercana y apoyo constante a la comunidad de productores locales.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
