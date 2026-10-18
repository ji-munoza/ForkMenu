import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { useCart } from './CartContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { descontarStock, deductStock } = useProducts();
  const { vaciarCarrito, clearCart } = useCart();

  // Carga los pedidos guardados o muestra pedidos de ejemplo.
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

  // Carga el último pedido confirmado.
  const [ordenReciente, setOrdenReciente] = useState(() => {
    try {
      const guardado = localStorage.getItem('ordenReciente');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Guarda los pedidos cuando cambian.
  useEffect(() => {
    localStorage.setItem('pedidosForkMenu', JSON.stringify(pedidos));
  }, [pedidos]);

  // Guarda o elimina el último pedido.
  useEffect(() => {
    if (ordenReciente) {
      localStorage.setItem('ordenReciente', JSON.stringify(ordenReciente));
    } else {
      localStorage.removeItem('ordenReciente');
    }
  }, [ordenReciente]);

  // Registra un pedido, descuenta el stock y vacía el carrito.
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

    // Descuenta del inventario los productos comprados.
    const descontarFn = descontarStock || deductStock;
    if (descontarFn) descontarFn(items);

    // Guarda el pedido en el historial y como el más reciente.
    setPedidos((prev) => [nuevaOrden, ...prev]);
    setOrdenReciente(nuevaOrden);

    // Vacía el carrito después de confirmar el pedido.
    const vaciarFn = vaciarCarrito || clearCart;
    if (vaciarFn) vaciarFn();

    return nuevaOrden;
  }

  // Cambia el estado de un pedido.
  function actualizarEstadoPedido(codigo, nuevoEstado) {
    setPedidos((prev) =>
      prev.map((ord) => (ord.codigo === codigo ? { ...ord, estado: nuevoEstado } : ord))
    );
  }

  return (
    <OrderContext.Provider
      value={{
        // Nombres en español usados por la aplicación.
        pedidos,
        ordenReciente,
        crearPedido,
        actualizarEstadoPedido,

        // Los mismos datos y funciones también están disponibles en inglés.
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
