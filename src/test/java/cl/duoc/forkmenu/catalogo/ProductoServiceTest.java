package cl.duoc.forkmenu.catalogo;

import cl.duoc.forkmenu.catalogo.model.Categoria;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.repository.CategoriaRepository;
import cl.duoc.forkmenu.catalogo.repository.ProductoRepository;
import cl.duoc.forkmenu.catalogo.service.ProductoService;
import cl.duoc.forkmenu.catalogo.service.impl.ProductoServiceImpl;
import cl.duoc.forkmenu.common.exception.NegocioException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    private ProductoService productoService;

    @BeforeEach
    void setUp() {
        productoService = new ProductoServiceImpl(productoRepository, categoriaRepository);
    }

    @Test
    void crearProducto_ConCodigoDuplicado_LanzaNegocioException() {
        Producto nuevo = new Producto();
        nuevo.setCodigo("FM-101");
        nuevo.setNombre("Hamburguesa");

        when(productoRepository.existsByCodigo("FM-101")).thenReturn(true);

        assertThrows(NegocioException.class, () -> productoService.crear(nuevo, "hamburguesas"));
        verify(productoRepository, never()).save(any());
    }

    @Test
    void actualizarStock_ConValorNegativo_LanzaNegocioException() {
        assertThrows(NegocioException.class, () -> productoService.actualizarStock(1L, -5));
        verify(productoRepository, never()).save(any());
    }

    @Test
    void descontarStock_ConStockInsuficiente_LanzaNegocioException() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Pizza");
        producto.setStock(3);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        assertThrows(NegocioException.class, () -> productoService.descontarStock(1L, 5));
        assertEquals(3, producto.getStock(), "El stock no debio cambiar al fallar la validacion");
    }

    @Test
    void descontarStock_ConStockSuficiente_DescuentaCorrectamente() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Pizza");
        producto.setStock(10);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        productoService.descontarStock(1L, 4);

        assertEquals(6, producto.getStock());
        verify(productoRepository, times(1)).save(producto);
    }
}
