import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productosIniciales } from '../utils/dataInicial';
import { productoService } from '../services/productoService';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Estado local de productos, inicializado desde localStorage o datos iniciales de respaldo.
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = localStorage.getItem('productosForkMenu');
      if (guardados) return JSON.parse(guardados);
      return productosIniciales;
    } catch {
      return productosIniciales;
    }
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Sincroniza la lista de productos consultando al backend Spring Boot.
  const cargarProductos = useCallback(async (categoria = 'todas', busqueda = '') => {
    setCargando(true);
    setError(null);
    try {
      const datos = await productoService.listar(categoria, busqueda);
      if (Array.isArray(datos) && datos.length > 0) {
        setProductos(datos);
        localStorage.setItem('productosForkMenu', JSON.stringify(datos));
      }
    } catch (err) {
      // Si el servidor backend no responde, se conserva el estado previo sin romper la interfaz.
      console.warn('No fue posible sincronizar con el backend de ForkMenu. Operando con caché local.', err.message);
      setError(err.message || 'Error de conexión con el catálogo');
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial al montar el proveedor en la aplicación.
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Respaldo automático en localStorage cuando cambia la lista.
  useEffect(() => {
    if (productos && productos.length > 0) {
      localStorage.setItem('productosForkMenu', JSON.stringify(productos));
    }
  }, [productos]);

  // Actualiza el stock de un producto tanto en el backend como en el estado local.
  async function actualizarStock(id, nuevoStock) {
    const stockNum = Math.max(0, parseInt(nuevoStock, 10) || 0);

    try {
      await productoService.actualizarStock(id, stockNum);
    } catch (err) {
      console.warn('No se pudo actualizar el stock en el backend, aplicando cambio en memoria local:', err.message);
    }

    setProductos((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, stock: stockNum } : p))
    );
  }

  // Agrega un producto nuevo o actualiza uno existente en el backend y el estado.
  async function guardarProducto(datos) {
    const existe = productos.find((p) => p.codigo === datos.codigo || String(p.id) === String(datos.id));

    try {
      if (existe) {
        const idActualizar = existe.id || datos.id;
        const productoActualizado = await productoService.actualizar(idActualizar, datos);

        setProductos((prev) =>
          prev.map((p) => (String(p.id) === String(idActualizar) ? { ...p, ...productoActualizado } : p))
        );
        return { success: true, message: 'Producto actualizado exitosamente en el servidor.' };
      }

      const nuevoCreado = await productoService.crear(datos);
      setProductos((prev) => [...prev, nuevoCreado]);
      return { success: true, message: 'Producto registrado exitosamente en el catálogo.' };
    } catch (err) {
      console.warn('Operación en backend falló o sin conexión, aplicando en almacenamiento local:', err.message);

      // Mecanismo de respaldo local si el backend no está disponible
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
        return { success: true, message: 'Producto actualizado exitosamente (modo local).' };
      }

      const nuevoLocal = {
        id: datos.id || String(Date.now()),
        codigo: datos.codigo,
        nombre: datos.nombre,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        stockCritico: Number(datos.stockCritico || 0),
        categoria: datos.categoria || 'otros',
        descripcion: datos.descripcion || 'Producto agregado desde el panel de administración.',
        imagen:
          datos.imagen ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      };

      setProductos((prev) => [...prev, nuevoLocal]);
      return { success: true, message: 'Producto creado exitosamente (modo local).' };
    }
  }

  // Elimina un producto del backend y del estado local.
  async function eliminarProducto(id) {
    try {
      await productoService.eliminar(id);
    } catch (err) {
      console.warn('No se pudo eliminar en el backend, aplicando cambio en local:', err.message);
    }
    setProductos((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }

  // Descuenta del inventario los platos comprados en una boleta.
  function descontarStock(items) {
    setProductos((prev) =>
      prev.map((prod) => {
        const itemEnCarrito = items.find((i) => String(i.id) === String(prod.id) || i.codigo === prod.codigo);
        if (itemEnCarrito) {
          const nuevoStock = Math.max(0, prod.stock - itemEnCarrito.cantidad);
          return { ...prod, stock: nuevoStock };
        }
        return prod;
      })
    );
  }

  // Busca un producto por su identificador.
  function obtenerProductoPorId(id) {
    return productos.find((p) => String(p.id) === String(id) || p.codigo === String(id));
  }

  return (
    <ProductContext.Provider
      value={{
        // Nombres en español usados por la aplicación
        productos,
        cargando,
        error,
        cargarProductos,
        actualizarStock,
        guardarProducto,
        eliminarProducto,
        descontarStock,
        obtenerProductoPorId,

        // Compatibilidad con nombres alternativos en inglés
        loading: cargando,
        reloadProducts: cargarProductos,
        updateStock: actualizarStock,
        saveProduct: guardarProducto,
        deleteProduct: eliminarProducto,
        deductStock: descontarStock,
        getProductById: obtenerProductoPorId,
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
