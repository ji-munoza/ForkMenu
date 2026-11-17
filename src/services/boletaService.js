import { api } from './api';

/**
 * Servicio encargado de la emisión de boletas, compras y seguimiento de pedidos
 * contra la API REST de Spring Boot.
 */
export const boletaService = {
  /**
   * Emite una nueva boleta de compra. El backend valida el inventario en MySQL
   * y descuenta las existencias automáticamente.
   */
  async emitirBoleta(datosPedido) {
    const payload = {
      cliente: (datosPedido.cliente || 'Cliente Anónimo').trim(),
      clienteCorreo: datosPedido.clienteCorreo || null,
      modalidad: datosPedido.modalidad || 'retirar',
      detalleModalidad: datosPedido.detalleModalidad || datosPedido.modalidad || 'Retiro en local',
      descuento: Number(datosPedido.descuento || 0),
      items: (datosPedido.items || []).map((item) => ({
        productoId: Number(item.id || item.productoId),
        cantidad: Number(item.cantidad),
      })),
    };

    return await api.post('/boletas', payload);
  },

  /**
   * Obtiene la lista completa de pedidos con filtro opcional de estado (Admin y Vendedor).
   */
  async listarBoletas(estado = 'todos') {
    const query = estado && estado !== 'todos' ? `?estado=${encodeURIComponent(estado)}` : '';
    return await api.get(`/boletas${query}`);
  },

  /**
   * Consulta el estado en vivo de un pedido mediante su código único (FM-XXXX).
   */
  async obtenerPorCodigo(codigo) {
    return await api.get(`/boletas/${encodeURIComponent(codigo)}`);
  },

  /**
   * Consulta el historial de pedidos asociados al usuario conectado.
   */
  async misBoletas() {
    return await api.get('/boletas/mis-boletas');
  },

  /**
   * Actualiza el estado de preparación o despacho de una orden (Admin y Vendedor).
   */
  async actualizarEstado(codigo, nuevoEstado) {
    return await api.patch(`/boletas/${encodeURIComponent(codigo)}/estado`, {
      estado: nuevoEstado,
    });
  },
};
