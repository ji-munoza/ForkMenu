package cl.duoc.forkmenu.catalogo.service;

import cl.duoc.forkmenu.catalogo.model.Producto;
import java.util.List;

public interface ProductoService {

    List<Producto> listarTodos(String categoria, String busqueda);

    Producto obtenerPorId(Long id);

    Producto obtenerPorCodigo(String codigo);

    Producto crear(Producto producto, String categoriaNombre);

    Producto actualizar(Long id, Producto producto, String categoriaNombre);

    Producto actualizarStock(Long id, Integer nuevoStock);

    void descontarStock(Long productoId, Integer cantidad);

    void eliminar(Long id);
}
