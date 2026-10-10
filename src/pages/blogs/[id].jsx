import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Breadcrumb, Badge, Button, Alert } from 'react-bootstrap';
import { blogsIniciales } from '../../utils/dataInicial';

export const meta = {
  title: 'ForkMenu - Artículo del Blog',
  layout: 'main',
};

export default function DetalleBlogPage() {
  const { id } = useParams();
  const blog = blogsIniciales.find((b) => b.id === id || b.slug === id);

  if (!blog) {
    return (
      <Container className="my-5 py-5 text-center">
        <Alert variant="warning" className="shadow-sm p-5 mx-auto rounded-4" style={{ maxWidth: '600px' }}>
          <div className="display-4 mb-3">📰</div>
          <Alert.Heading className="fw-bold">Artículo no encontrado</Alert.Heading>
          <p className="text-muted">El artículo solicitado no existe o fue despublicado.</p>
          <Button as={Link} to="/blogs" variant="danger">
            Volver a Blogs
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/blogs' }}>
          Blogs
        </Breadcrumb.Item>
        <Breadcrumb.Item active className="text-truncate" style={{ maxWidth: '300px' }}>
          {blog.titulo}
        </Breadcrumb.Item>
      </Breadcrumb>

      <article className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '900px' }}>
        <header className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge bg="danger-subtle" className="text-danger border border-danger-subtle rounded-pill px-3 py-1">
              {blog.categoria}
            </Badge>
            <span className="text-muted small">
              <i className="bi bi-calendar3 me-1"></i>{blog.fecha}
            </span>
          </div>

          <h1 className="h2 fw-bold text-dark mb-3">{blog.titulo}</h1>
          <p className="lead text-secondary">{blog.resumen}</p>
        </header>

        <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ maxHeight: '450px' }}>
          <img
            src={blog.imagen}
            alt={blog.titulo}
            className="img-fluid w-100 object-fit-cover"
            style={{ maxHeight: '450px' }}
          />
        </div>

        <div className="article-content text-secondary lh-lg fs-5">
          {blog.contenido.map((parrafo, idx) => (
            <p key={idx} className="mb-4">
              {parrafo}
            </p>
          ))}
        </div>

        <hr className="my-4" />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button as={Link} to="/blogs" variant="outline-danger">
            <i className="bi bi-arrow-left me-2"></i>Volver a todos los artículos
          </Button>
          <Button as={Link} to="/productos" variant="danger">
            <i className="bi bi-journal-richtext me-2"></i>Explorar el Menú
          </Button>
        </div>
      </article>
    </Container>
  );
}
