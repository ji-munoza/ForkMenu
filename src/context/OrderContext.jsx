import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProducts } from './ProductContext';
import { useCart } from './CartContext';
import { boletaService } from '../services/boletaService';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { descontarStock, deductStock } = useProducts();
  const { vaciarCarrito, clearCart } = useCart();

  const [pedidos, setPedidos] = useState(() => {
    try {
      const guardados = localStorage.getItem('pedidosForkMenu');
      if (guardados) return JSON.parse(guardados);
      return [
        {
          codigo: 'FM-1001',
          cliente: 'Juan Pérez',
          modalidad: 'Mesa #4',
          items: [
            { id: '1', nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 8000 },
            { id: '4', nombre: 'Limonada Natural Menta-Jengibre', cantidad: 2, precio: 3000 },
          ],
          total: 22000,
          estado: 'Entregado',
          fecha: '05/10/2026, 20:30:15',
        },
        {
          codigo: 'FM-1002',
          cliente: 'Administrador General',
          modalidad: 'Delivery (Av. Providencia 1234)',
          items: [
            { id: '2', nombre: 'Pizza Margarita', cantidad: 1, precio: 10000 },
            { id: '3', nombre: 'Tiramisú Tradizionale', cantidad: 1, precio: 5500 },
          ],
          total: 15500,
          estado: 'En preparación',
          fecha: '06/10/2026, 09:15:00',
        },
      ];
    } catch {
      return [];
    }
  });

  const [ordenReciente, setOrdenReciente] = useState(() => {
    try {
      const guardado = localStorage.getItem('ordenReciente');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const cargarPedidosDesdeBackend = useCallback(async () => {
    const token = localStorage.getItem('tokenForkMenu');
    if (!token) return;

    try {
      const datos = await boletaService.listarBoletas();
      if (Array.isArray(datos) && datos.length > 0) {
        setPedidos(datos);
        localStorage.setItem('pedidosForkMenu', JSON.stringify(datos));
      }
    } catch {
      try {
        const misBoletas = await boletaService.misBoletas();
        if (Array.isArray(misBoletas) && misBoletas.length > 0) {
          setPedidos(misBoletas);
          localStorage.setItem('pedidosForkMenu', JSON.stringify(misBoletas));
        }
      } catch (err) {
        console.warn('Operando con historial de pedidos en caché local:', err.message);
      }
    }
  }, []);

  useEffect(() => {
    cargarPedidosDesdeBackend();
  }, [cargarPedidosDesdeBackend]);

  useEffect(() => {
    localStorage.setItem('pedidosForkMenu', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    if (ordenReciente) {
      localStorage.setItem('ordenReciente', JSON.stringify(ordenReciente));
    } else {
      localStorage.removeItem('ordenReciente');
    }
  }, [ordenReciente]);

  async function crearPedido({ modalidad, detalleModalidad, items, subtotal, descuento, total, cliente, clienteCorreo }) {
    let nuevaOrden = null;

    try {
      const boletaServidor = await boletaService.emitirBoleta({
        modalidad,
        detalleModalidad,
        items,
        descuento,
        cliente,
        clienteCorreo,
      });

      nuevaOrden = {
        id: boletaServidor.id,
        codigo: boletaServidor.codigo,
        cliente: boletaServidor.cliente,
        clienteCorreo: boletaServidor.clienteCorreo,
        modalidad: boletaServidor.detalleModalidad || boletaServidor.modalidad,
        items: boletaServidor.items || items,
        subtotal: boletaServidor.subtotal || subtotal,
        descuento: boletaServidor.descuento || descuento,
        total: boletaServidor.total || total,
        estado: boletaServidor.estado || 'En preparación',
        fecha: boletaServidor.fecha || new Date().toLocaleString('es-CL'),
      };
    } catch (error) {
      console.warn('Backend sin respuesta o no disponible, emitiendo boleta en modo local:', error.message);

      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Fallback local
      const codigoGenerado = 'FM-' + Math.floor(1000 + Math.random() * 9000);
      nuevaOrden = {
        codigo: codigoGenerado,
        cliente: cliente || 'Cliente Anónimo',
        clienteCorreo: clienteCorreo || '',
        modalidad: detalleModalidad || modalidad,
        items: [...items],
        subtotal: subtotal || total,
        descuento: descuento || 0,
        total: total,
        estado: 'En preparación',
        fecha: new Date().toLocaleString('es-CL'),
      };
    }

    const descontarFn = descontarStock || deductStock;
    if (descontarFn) descontarFn(items);

    setPedidos((prev) => [nuevaOrden, ...prev]);
    setOrdenReciente(nuevaOrden);

    const vaciarFn = vaciarCarrito || clearCart;
    if (vaciarFn) vaciarFn();

    return nuevaOrden;
  }

  async function actualizarEstadoPedido(codigo, nuevoEstado) {
    try {
      await boletaService.actualizarEstado(codigo, nuevoEstado);
    } catch (err) {
      console.warn('No se pudo actualizar el estado en el backend, aplicando cambio en local:', err.message);
    }

    setPedidos((prev) =>
      prev.map((ord) => (ord.codigo === codigo ? { ...ord, estado: nuevoEstado } : ord))
    );
  }

  async function consultarPedidoPorCodigo(codigo) {
    try {
      return await boletaService.obtenerPorCodigo(codigo);
    } catch {
      return pedidos.find((p) => p.codigo === codigo) || null;
    }
  }

  return (
    <OrderContext.Provider
      value={{
        pedidos,
        ordenReciente,
        crearPedido,
        actualizarEstadoPedido,
        consultarPedidoPorCodigo,
        recargarPedidos: cargarPedidosDesdeBackend,

        createOrder: crearPedido,
        updateOrderStatus: actualizarEstadoPedido,
        getOrderDetails: consultarPedidoPorCodigo,
        reloadOrders: cargarPedidosDesdeBackend,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders debe ser usado dentro de OrderProvider');
  }
  return context;
}
