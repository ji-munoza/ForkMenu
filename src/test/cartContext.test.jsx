import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProductProvider } from '../context/ProductContext';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => (
  <ProductProvider>
    <CartProvider>{children}</CartProvider>
  </ProductProvider>
);

// Prueba el estado y las acciones del carrito.
describe('CartContext y Lógica del Carrito', () => {
  // Limpia los datos guardados antes de cada prueba.
  beforeEach(() => {
    localStorage.clear();
  });

  // El carrito y sus totales empiezan vacíos.
  it('inicia con el carrito vacío y subtotal en 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.total).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  // Agregar productos actualiza la cantidad y los totales.
  it('permite añadir productos al carrito y actualiza subtotal y contador', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const productoPrueba = {
      id: '1',
      codigo: 'FM-101',
      nombre: 'Hamburguesa Clásica',
      precio: 8000,
      stock: 10,
    };

    act(() => {
      const res = result.current.addToCart(productoPrueba, 2);
      expect(res.success).toBe(true);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].cantidad).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(16000);
  });

  // No permite agregar más unidades que las disponibles.
  it('evita agregar más unidades de las disponibles en stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // El producto de ejemplo con ID 1 tiene 15 unidades disponibles.
    const productoPocoStock = {
      id: '1',
      codigo: 'FM-101',
      nombre: 'Hamburguesa Clásica',
      precio: 8000,
    };

    act(() => {
      // Intenta agregar más unidades de las que hay.
      const res = result.current.addToCart(productoPocoStock, 20);
      expect(res.success).toBe(false);
      expect(res.message).toContain('Stock insuficiente');
    });

    expect(result.current.cart).toHaveLength(0);
  });

  // Permite cambiar la cantidad y quita el producto al llegar a cero.
  it('permite actualizar cantidad y remover si la cantidad llega a cero', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const productoPrueba = {
      id: '2',
      codigo: 'FM-102',
      nombre: 'Pizza Margarita',
      precio: 10000,
      stock: 5,
    };

    act(() => {
      result.current.addToCart(productoPrueba, 2);
    });

    expect(result.current.cart[0].cantidad).toBe(2);

    // Aumenta una unidad.
    act(() => {
      result.current.updateQuantity('2', 1);
    });
    expect(result.current.cart[0].cantidad).toBe(3);

    // Resta una unidad.
    act(() => {
      result.current.updateQuantity('2', -1);
    });
    expect(result.current.cart[0].cantidad).toBe(2);

    // Al restar la última unidad, quita el producto.
    act(() => {
      result.current.updateQuantity('2', -1);
    });
    expect(result.current.cart[0].cantidad).toBe(1);

    act(() => {
      result.current.updateQuantity('2', -1);
    });
    expect(result.current.cart).toHaveLength(0);
  });

  // El cupón FORK20 descuenta el 20 %.
  it('aplica cupón de descuento porcentual FORK20 correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const productoPrueba = {
      id: '2',
      codigo: 'FM-102',
      nombre: 'Pizza Margarita',
      precio: 10000,
      stock: 5,
    };

    act(() => {
      result.current.addToCart(productoPrueba, 1);
    });

    expect(result.current.subtotal).toBe(10000);

    act(() => {
      const res = result.current.applyCoupon('FORK20');
      expect(res.success).toBe(true);
    });

    expect(result.current.discount).toBe(2000); // 20% de 10000
    expect(result.current.total).toBe(8000);
  });

  // Vaciar el carrito elimina sus productos y reinicia el subtotal.
  it('vacía el carrito al llamar a clearCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: '1', precio: 5000, stock: 10, nombre: 'Plato' }, 1);
    });
    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });
});
