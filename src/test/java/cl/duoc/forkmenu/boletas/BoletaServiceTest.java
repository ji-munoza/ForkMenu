package cl.duoc.forkmenu.boletas;

import cl.duoc.forkmenu.boletas.dto.CrearBoletaDTO;
import cl.duoc.forkmenu.boletas.dto.ItemPedidoDTO;
import cl.duoc.forkmenu.boletas.model.Boleta;
import cl.duoc.forkmenu.boletas.repository.BoletaRepository;
import cl.duoc.forkmenu.boletas.service.BoletaService;
import cl.duoc.forkmenu.boletas.service.impl.BoletaServiceImpl;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.repository.ProductoRepository;
import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoletaServiceTest {

    @Mock
    private BoletaRepository boletaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    private BoletaService boletaService;

    @BeforeEach
    void setUp() {
        boletaService = new BoletaServiceImpl(boletaRepository, productoRepository, usuarioRepository);
    }

    @Test
    void emitirBoleta_ConStockSuficiente_CalculaTotalesYDescuentaStock() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Hamburguesa");
        producto.setPrecio(8000);
        producto.setStock(10);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(boletaRepository.save(any(Boleta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CrearBoletaDTO dto = new CrearBoletaDTO();
        dto.setCliente("Cliente Test");
        dto.setModalidad("delivery");
        dto.setDetalleModalidad("Av. Test 123");
        dto.setDescuento(2000);
        dto.setItems(List.of(new ItemPedidoDTO(1L, 2)));

        Boleta resultado = boletaService.emitirBoleta(dto, null);

        assertNotNull(resultado);
        assertTrue(resultado.getCodigo().startsWith("FM-"));
        assertEquals(16000, resultado.getSubtotal());
        assertEquals(2000, resultado.getDescuento());
        assertEquals(14000, resultado.getTotal());
        assertEquals(8, producto.getStock(), "El stock debio reducirse de 10 a 8");
        assertEquals("En preparación", resultado.getEstado());
        verify(productoRepository, times(1)).save(producto);
        verify(boletaRepository, times(1)).save(any(Boleta.class));
    }

    @Test
    void emitirBoleta_ConStockInsuficiente_LanzaNegocioExceptionYSuspendeOperacion() {
        Producto producto = new Producto();
        producto.setId(2L);
        producto.setNombre("Pizza");
        producto.setPrecio(10000);
        producto.setStock(1);

        when(productoRepository.findById(2L)).thenReturn(Optional.of(producto));

        CrearBoletaDTO dto = new CrearBoletaDTO();
        dto.setCliente("Cliente Test");
        dto.setModalidad("mesa");
        dto.setItems(List.of(new ItemPedidoDTO(2L, 5))); // solicita 5 cuando solo hay 1

        assertThrows(NegocioException.class, () -> boletaService.emitirBoleta(dto, null));
        assertEquals(1, producto.getStock(), "El stock no debio modificarse");
        verify(boletaRepository, never()).save(any());
    }

    @Test
    void actualizarEstado_ConEstadoInvalido_LanzaNegocioException() {
        Boleta boleta = new Boleta();
        boleta.setCodigo("FM-1001");
        boleta.setEstado("En preparación");

        when(boletaRepository.findByCodigo("FM-1001")).thenReturn(Optional.of(boleta));

        assertThrows(NegocioException.class, () -> boletaService.actualizarEstado("FM-1001", "EstadoInventado"));
        verify(boletaRepository, never()).save(any());
    }
}
