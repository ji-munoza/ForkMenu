import React, { createContext, useContext, useState, useEffect } from 'react';
import { cuponesDisponibles } from '../utils/dataInicial';
import { calcularDescuento } from '../utils/validaciones';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { productos } = useProducts();

  // Estado del carrito almacenado en localStorage para persistencia
  const [cart, setCart] = useState(() => {
    try {
      const guardado = localStorage.getItem('carritoForkMenu');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Estado del cupón de descuento activo
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const guardado = localStorage.getItem('cuponForkMenu');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Sincronización automática con localStorage al modificar el carrito
  useEffect(() => {
    localStorage.setItem('carritoForkMenu', JSON.stringify(cart));
  }, [cart]);

  // Sincronización del cupón activo con localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cuponForkMenu', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cuponForkMenu');
    }
  }, [appliedCoupon]);

  /**
   * Agrega un producto al carrito verificando stock disponible en inventario
   */
  function agregarAlCarrito(producto, cantidad = 1) {
    const prodBD = productos.find((p) => String(p.id) === String(producto.id));
    const stockDisponible = prodBD ? prodBD.stock : producto.stock || 0;

    const itemExistente = cart.find((item) => String(item.id) === String(producto.id));
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad;

    // Validación de disponibilidad de stock
    if (nuevaCantidad > stockDisponible) {
      return {
        success: false,
        message: `Stock insuficiente. Solo quedan ${stockDisponible} unidades de ${producto.nombre}.`,
      };
    }

    if (itemExistente) {
      setCart((prev) =>
        prev.map((item) =>
          String(item.id) === String(producto.id)
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: String(producto.id),
          codigo: producto.codigo || '',
          nombre: producto.nombre,
          precio: Number(producto.precio),
          imagen: producto.imagen || '',
          cantidad: cantidad,
        },
      ]);
    }

    return {
      success: true,
      message: `¡Excelente! Se añadió ${producto.nombre} al carrito.`,
    };
  }

  /**
   * Elimina un producto del carrito por su ID
   */
  function eliminarDelCarrito(id) {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }

  /**
   * Incrementa o decrementa la cantidad de un producto en el carrito
   */
  function actualizarCantidad(id, delta) {
    const item = cart.find((i) => String(i.id) === String(id));
    if (!item) return;

    if (delta > 0) {
      const prodBD = productos.find((p) => String(p.id) === String(id));
      const stockDisponible = prodBD ? prodBD.stock : 999;
      if (item.cantidad + 1 > stockDisponible) {
        return {
          success: false,
          message: `No puedes agregar más. Stock disponible: ${stockDisponible}`,
        };
      }
      setCart((prev) =>
        prev.map((i) =>
          String(i.id) === String(id) ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      if (item.cantidad > 1) {
        setCart((prev) =>
          prev.map((i) =>
            String(i.id) === String(id) ? { ...i, cantidad: i.cantidad - 1 } : i
          )
        );
      } else {
        eliminarDelCarrito(id);
      }
    }

    return { success: true };
  }

  /**
   * Vacía todos los productos del carrito y remueve cupones aplicados
   */
  function vaciarCarrito() {
    setCart([]);
    setAppliedCoupon(null);
  }

  /**
   * Aplica un cupón promocional si es válido y no hay otro aplicado
   */
  function aplicarCupon(codigo) {
    if (!codigo) {
      return { success: false, message: 'Ingresa un cupón válido.' };
    }

    const codigoUpper = codigo.trim().toUpperCase();

    if (appliedCoupon) {
      return { success: false, message: 'Ya tienes un cupón aplicado.' };
    }

    const cupon = cuponesDisponibles[codigoUpper];
    if (!cupon) {
      return { success: false, message: 'El código ingresado no existe o expiró.' };
    }

    setAppliedCoupon(cupon);
    return { success: true, message: `¡Cupón ${cupon.codigo} aplicado exitosamente!` };
  }

  /**
   * Remueve el cupón actualmente aplicado
   */
  function quitarCupon() {
    setAppliedCoupon(null);
  }

  // Cálculos de totales
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const discount = calcularDescuento(subtotal, appliedCoupon);
  const total = Math.max(0, subtotal - discount);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        // Métodos y propiedades en español
        carrito: cart,
        cuponAplicado: appliedCoupon,
        subtotal,
        descuento: discount,
        total,
        totalArticulos: totalItems,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        aplicarCupon,
        quitarCupon,

        // Alias en inglés para compatibilidad total
        cart,
        appliedCoupon,
        discount,
        totalItems,
        addToCart: agregarAlCarrito,
        removeFromCart: eliminarDelCarrito,
        updateQuantity: actualizarCantidad,
        clearCart: vaciarCarrito,
        applyCoupon: aplicarCupon,
        removeCoupon: quitarCupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
}
