import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { blogsIniciales } from '../../utils/dataInicial';

export const meta = {
  title: 'ForkMenu - Blogs y Noticias',
  layout: 'main',
};

export default function BlogsPage() {
  return (
    <Container className="my-5">
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-2 d-flex align-items-center">
          <i className="bi bi-journal-text me-2 text-danger"></i>Nuestra Cocina y Crónicas
        </h1>
        <p className="text-muted mb-0">
          Conoce los secretos, ingredientes y el trabajo artesanal detrás de nuestros mejores platos.
        </p>
      </div>

      <div className="d-flex flex-column gap-4">
        {blogsIniciales.map((blog) => (
          <Card key={blog.id} className="shadow-sm border-0 rounded-4 overflow-hidden blog-card">
            <Row className="g-0 align-items-center">
              <Col md={4} lg={3} className="text-center p-3">
                <img
                  src={blog.imagen}
                  alt={blog.titulo}
                  className="img-fluid rounded-3 object-fit-cover w-100 shadow-sm"
                  style={{ height: '200px' }}
                />
              </Col>
              <Col md={8} lg={9}>
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg="danger-subtle" className="text-danger border border-danger-subtle">
                      {blog.categoria}
                    </Badge>
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>{blog.fecha}
                    </small>
                  </div>

                  <Card.Title as="h2" className="h4 fw-bold mb-2">
                    <Link to={`/blogs/${blog.id}`} className="text-dark text-decoration-none hover-danger">
                      {blog.titulo}
                    </Link>
                  </Card.Title>

                  <Card.Text className="text-secondary mb-3">
                    {blog.resumen}
                  </Card.Text>

                  <Link to={`/blogs/${blog.id}`} className="btn btn-outline-danger btn-sm fw-semibold">
                    Leer artículo completo <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </Container>
  );
}
