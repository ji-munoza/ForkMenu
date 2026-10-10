import React, { createContext, useContext, useState, useEffect } from 'react';
import { productosIniciales } from '../utils/dataInicial';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem('productosForkMenu');
      if (guardados) return JSON.parse(guardados);
      localStorage.setItem('productosForkMenu', JSON.stringify(productosIniciales));
      return productosIniciales;
    } catch {
      return productosIniciales;
    }
  });

  useEffect(() => {
    localStorage.setItem('productosForkMenu', JSON.stringify(productos));
  }, [productos]);

  const updateStock = (id, nuevoStock) => {
    const stockNum = Math.max(0, parseInt(nuevoStock, 10) || 0);
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: stockNum } : p))
    );
  };

  const saveProduct = (datos) => {
    const existe = productos.find((p) => p.codigo === datos.codigo || p.id === datos.id);
    if (existe) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === existe.id
            ? {
                ...p,
                ...datos,
                precio: Number(datos.precio),
                stock: Number(datos.stock),
                stockCritico: Number(datos.stockCritico || 0),
              }
            : p
        )
      );
      return { success: true, message: 'Producto actualizado exitosamente.' };
    }

    const nuevo = {
      id: datos.id || String(Date.now()),
      codigo: datos.codigo,
      nombre: datos.nombre,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico || 0),
      categoria: datos.categoria || 'otros',
      descripcion: datos.descripcion || 'Producto agregado desde el panel de administración.',
      imagen: datos.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    };

    setProductos((prev) => [...prev, nuevo]);
    return { success: true, message: 'Producto creado exitosamente.' };
  };

  const deductStock = (items) => {
    setProductos((prev) =>
      prev.map((prod) => {
        const itemEnCarrito = items.find((i) => i.id === prod.id);
        if (itemEnCarrito) {
          const nuevoStock = Math.max(0, prod.stock - itemEnCarrito.cantidad);
          return { ...prod, stock: nuevoStock };
        }
        return prod;
      })
    );
  };

  const getProductById = (id) => {
    return productos.find((p) => String(p.id) === String(id));
  };

  return (
    <ProductContext.Provider
      value={{
        productos,
        updateStock,
        saveProduct,
        deductStock,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de ProductProvider');
  }
  return context;
}
