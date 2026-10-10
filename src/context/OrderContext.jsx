import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { useCart } from './CartContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { descontarStock, deductStock } = useProducts();
  const { vaciarCarrito, clearCart } = useCart();

  // Historial de pedidos registrados en el sistema
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

  // Última orden confirmada por el usuario en la sesión actual
  const [ordenReciente, setOrdenReciente] = useState(() => {
    try {
      const guardado = localStorage.getItem('ordenReciente');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Sincronizar pedidos con localStorage
  useEffect(() => {
    localStorage.setItem('pedidosForkMenu', JSON.stringify(pedidos));
  }, [pedidos]);

  // Sincronizar orden reciente con localStorage
  useEffect(() => {
    if (ordenReciente) {
      localStorage.setItem('ordenReciente', JSON.stringify(ordenReciente));
    } else {
      localStorage.removeItem('ordenReciente');
    }
  }, [ordenReciente]);

  /**
   * Crea un nuevo pedido, descuenta inventario y limpia el carrito
   */
  function crearPedido({ modalidad, detalleModalidad, items, total, cliente }) {
    const codigoGenerado = 'FM-' + Math.floor(1000 + Math.random() * 9000);
    const nuevaOrden = {
      codigo: codigoGenerado,
      cliente: cliente || 'Cliente Anónimo',
      modalidad: detalleModalidad || modalidad,
      items: [...items],
      total: total,
      estado: 'En preparación',
      fecha: new Date().toLocaleString('es-CL'),
    };

    // Descontar inventario disponible
    const descontarFn = descontarStock || deductStock;
    if (descontarFn) descontarFn(items);

    // Guardar pedido en el listado y como orden reciente
    setPedidos((prev) => [nuevaOrden, ...prev]);
    setOrdenReciente(nuevaOrden);

    // Vaciar los productos del carrito
    const vaciarFn = vaciarCarrito || clearCart;
    if (vaciarFn) vaciarFn();

    return nuevaOrden;
  }

  /**
   * Actualiza el estado de seguimiento de un pedido
   */
  function actualizarEstadoPedido(codigo, nuevoEstado) {
    setPedidos((prev) =>
      prev.map((ord) => (ord.codigo === codigo ? { ...ord, estado: nuevoEstado } : ord))
    );
  }

  return (
    <OrderContext.Provider
      value={{
        // Propiedades y métodos en español
        pedidos,
        ordenReciente,
        crearPedido,
        actualizarEstadoPedido,

        // Alias en inglés para compatibilidad
        createOrder: crearPedido,
        updateOrderStatus: actualizarEstadoPedido,
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
