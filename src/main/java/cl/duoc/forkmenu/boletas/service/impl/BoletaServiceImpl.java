package cl.duoc.forkmenu.boletas.service.impl;

import cl.duoc.forkmenu.boletas.dto.CrearBoletaDTO;
import cl.duoc.forkmenu.boletas.dto.ItemPedidoDTO;
import cl.duoc.forkmenu.boletas.model.Boleta;
import cl.duoc.forkmenu.boletas.model.DetalleBoleta;
import cl.duoc.forkmenu.boletas.repository.BoletaRepository;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.repository.ProductoRepository;
import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.common.exception.RecursoNoEncontradoException;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import cl.duoc.forkmenu.boletas.service.BoletaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class BoletaServiceImpl implements BoletaService {

    private static final List<String> ESTADOS_VALIDOS = Arrays.asList(
            "En preparación",
            "Listo para retiro",
            "En camino",
            "Entregado",
            "Cancelado"
    );

    private final BoletaRepository boletaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final Random random = new Random();

    public BoletaServiceImpl(BoletaRepository boletaRepository, ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.boletaRepository = boletaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Boleta> listarTodas(String estado) {
        if (estado != null && !estado.isBlank() && !estado.equalsIgnoreCase("todos")) {
            return boletaRepository.findByEstadoOrderByFechaDesc(estado.trim());
        }
        return boletaRepository.findAllByOrderByFechaDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Boleta obtenerPorCodigo(String codigo) {
        return boletaRepository.findByCodigo(codigo.trim())
                .orElseThrow(() -> new RecursoNoEncontradoException("Boleta no encontrada con codigo: " + codigo));
    }

    @Override
    @Transactional(readOnly = true)
    public Boleta obtenerPorId(Long id) {
        return boletaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Boleta no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Boleta> listarPorUsuario(String correoOCliente) {
        String query = correoOCliente.trim();
        List<Boleta> porCorreo = boletaRepository.findByUsuarioCorreoIgnoreCaseOrderByFechaDesc(query);
        if (!porCorreo.isEmpty()) {
            return porCorreo;
        }
        return boletaRepository.findByClienteIgnoreCaseOrderByFechaDesc(query);
    }

    @Override
    public Boleta emitirBoleta(CrearBoletaDTO dto, String correoUsuarioAutenticado) {
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new NegocioException("La boleta debe tener al menos un producto.");
        }

        Usuario usuarioAsociado = null;
        if (correoUsuarioAutenticado != null && !correoUsuarioAutenticado.isBlank()) {
            usuarioAsociado = usuarioRepository.findByCorreoIgnoreCase(correoUsuarioAutenticado.trim()).orElse(null);
        } else if (dto.getClienteCorreo() != null && !dto.getClienteCorreo().isBlank()) {
            usuarioAsociado = usuarioRepository.findByCorreoIgnoreCase(dto.getClienteCorreo().trim()).orElse(null);
        }

        String codigoGenerado = generarCodigoUnico();
        int subtotalCalculado = 0;

        Boleta boleta = new Boleta();
        boleta.setCodigo(codigoGenerado);
        boleta.setUsuario(usuarioAsociado);
        boleta.setCliente(dto.getCliente().trim());
        boleta.setClienteCorreo(dto.getClienteCorreo() != null ? dto.getClienteCorreo().trim().toLowerCase() : (usuarioAsociado != null ? usuarioAsociado.getCorreo() : ""));
        boleta.setModalidad(dto.getModalidad().trim());
        boleta.setDetalleModalidad(dto.getDetalleModalidad() != null ? dto.getDetalleModalidad().trim() : dto.getModalidad());
        boleta.setEstado("En preparación");

        // Valida stock de cada producto y descuenta del inventario
        for (ItemPedidoDTO itemDto : dto.getItems()) {
            Producto prod = productoRepository.findById(itemDto.getProductoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Producto con ID " + itemDto.getProductoId() + " no existe."));

            if (prod.getStock() < itemDto.getCantidad()) {
                throw new NegocioException("Stock insuficiente para '" + prod.getNombre() + "'. Disponibles: " + prod.getStock() + ", solicitados: " + itemDto.getCantidad());
            }

            prod.setStock(prod.getStock() - itemDto.getCantidad());
            productoRepository.save(prod);

            DetalleBoleta detalle = new DetalleBoleta(prod, itemDto.getCantidad());
            boleta.agregarDetalle(detalle);

            subtotalCalculado += detalle.getSubtotal();
        }

        int descuento = dto.getDescuento() != null ? Math.max(0, dto.getDescuento()) : 0;
        int totalCalculado = Math.max(0, subtotalCalculado - descuento);

        boleta.setSubtotal(subtotalCalculado);
        boleta.setDescuento(descuento);
        boleta.setTotal(totalCalculado);

        return boletaRepository.save(boleta);
    }

    @Override
    public Boleta actualizarEstado(String codigo, String nuevoEstado) {
        Boleta boleta = obtenerPorCodigo(codigo);
        String estadoLimpio = nuevoEstado.trim();

        if (!ESTADOS_VALIDOS.contains(estadoLimpio)) {
            throw new NegocioException("Estado '" + nuevoEstado + "' no valido. Estados admitidos: " + String.join(", ", ESTADOS_VALIDOS));
        }

        boleta.setEstado(estadoLimpio);
        return boletaRepository.save(boleta);
    }

    private String generarCodigoUnico() {
        String codigo;
        do {
            codigo = "FM-" + (1000 + random.nextInt(9000));
        } while (boletaRepository.findByCodigo(codigo).isPresent());
        return codigo;
    }
}
