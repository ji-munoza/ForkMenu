import React, { createContext, useContext, useState, useEffect } from 'react';
import { cuponesDisponibles } from '../utils/dataInicial';
import { calcularDescuento } from '../utils/validaciones';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { productos } = useProducts();

  const [cart, setCart] = useState(() => {
    try {
      const guardado = localStorage.getItem('carritoForkMenu');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const guardado = localStorage.getItem('cuponForkMenu');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('carritoForkMenu', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cuponForkMenu', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cuponForkMenu');
    }
  }, [appliedCoupon]);

  const addToCart = (producto, cantidad = 1) => {
    const prodBD = productos.find((p) => String(p.id) === String(producto.id));
    const stockDisponible = prodBD ? prodBD.stock : producto.stock || 0;

    const itemExistente = cart.find((item) => String(item.id) === String(producto.id));
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad;

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
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const updateQuantity = (id, delta) => {
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
        removeFromCart(id);
      }
    }

    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (codigo) => {
    if (!codigo) return { success: false, message: 'Ingresa un cupón válido.' };
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
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const discount = calcularDescuento(subtotal, appliedCoupon);
  const total = Math.max(0, subtotal - discount);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        total,
        totalItems,
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
