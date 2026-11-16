import { api } from './api';

/**
 * Servicio encargado de las operaciones de productos y categorías gastronómicas
 * contra el backend Spring Boot.
 */
export const productoService = {
  /**
   * Obtiene la lista de productos del catálogo con filtros opcionales.
   */
  async listar(categoria = 'todas', busqueda = '') {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'todas') params.append('categoria', categoria);
    if (busqueda && busqueda.trim()) params.append('busqueda', busqueda.trim());

    const query = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/productos${query}`);
  },

  /**
   * Obtiene los datos detallados de un producto por su identificador.
   */
  async obtenerPorId(id) {
    return await api.get(`/productos/${id}`);
  },

  /**
   * Obtiene el listado de todas las categorías disponibles.
   */
  async listarCategorias() {
    return await api.get('/categorias');
  },

  /**
   * Crea un nuevo plato en la carta (requiere rol ADMIN).
   */
  async crear(datosProducto) {
    const payload = {
      codigo: datosProducto.codigo,
      nombre: datosProducto.nombre,
      precio: Number(datosProducto.precio),
      stock: Number(datosProducto.stock),
      stockCritico: Number(datosProducto.stockCritico || 0),
      categoria: datosProducto.categoria,
      descripcion: datosProducto.descripcion || '',
      imagen: datosProducto.imagen || '',
    };
    return await api.post('/productos', payload);
  },

  /**
   * Actualiza los datos de un plato existente (requiere rol ADMIN).
   */
  async actualizar(id, datosProducto) {
    const payload = {
      codigo: datosProducto.codigo,
      nombre: datosProducto.nombre,
      precio: Number(datosProducto.precio),
      stock: Number(datosProducto.stock),
      stockCritico: Number(datosProducto.stockCritico || 0),
      categoria: datosProducto.categoria,
      descripcion: datosProducto.descripcion || '',
      imagen: datosProducto.imagen || '',
    };
    return await api.put(`/productos/${id}`, payload);
  },

  /**
   * Actualiza únicamente el stock disponible (requiere rol ADMIN o VENDEDOR).
   */
  async actualizarStock(id, nuevoStock) {
    return await api.patch(`/productos/${id}/stock`, { stock: Number(nuevoStock) });
  },

  /**
   * Elimina un plato del catálogo (requiere rol ADMIN).
   */
  async eliminar(id) {
    return await api.delete(`/productos/${id}`);
  },
};
