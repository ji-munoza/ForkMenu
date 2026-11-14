package cl.duoc.forkmenu.catalogo.service.impl;

import cl.duoc.forkmenu.catalogo.model.Categoria;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.repository.CategoriaRepository;
import cl.duoc.forkmenu.catalogo.repository.ProductoRepository;
import cl.duoc.forkmenu.catalogo.service.ProductoService;
import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.common.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarTodos(String categoria, String busqueda) {
        String cat = (categoria != null && !categoria.isBlank()) ? categoria.trim() : "todas";
        String q = (busqueda != null) ? busqueda.trim() : "";
        return productoRepository.buscarPorFiltros(cat, q);
    }

    @Override
    @Transactional(readOnly = true)
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Producto obtenerPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con codigo: " + codigo));
    }

    @Override
    public Producto crear(Producto producto, String categoriaNombre) {
        if (productoRepository.existsByCodigo(producto.getCodigo())) {
            throw new NegocioException("Ya existe un producto registrado con el codigo: " + producto.getCodigo());
        }

        Categoria categoria = resolverCategoria(categoriaNombre);
        producto.setCategoria(categoria);

        if (producto.getStock() == null || producto.getStock() < 0) {
            producto.setStock(0);
        }
        if (producto.getStockCritico() == null || producto.getStockCritico() < 0) {
            producto.setStockCritico(0);
        }

        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizar(Long id, Producto datos, String categoriaNombre) {
        Producto existente = obtenerPorId(id);

        if (!existente.getCodigo().equalsIgnoreCase(datos.getCodigo()) && productoRepository.existsByCodigo(datos.getCodigo())) {
            throw new NegocioException("El codigo " + datos.getCodigo() + " ya esta asignado a otro producto.");
        }

        existente.setCodigo(datos.getCodigo());
        existente.setNombre(datos.getNombre());
        existente.setPrecio(datos.getPrecio());
        existente.setStock(datos.getStock());
        existente.setStockCritico(datos.getStockCritico());
        existente.setDescripcion(datos.getDescripcion());
        if (datos.getImagen() != null && !datos.getImagen().isBlank()) {
            existente.setImagen(datos.getImagen());
        }

        if (categoriaNombre != null && !categoriaNombre.isBlank()) {
            Categoria categoria = resolverCategoria(categoriaNombre);
            existente.setCategoria(categoria);
        }

        return productoRepository.save(existente);
    }

    @Override
    public Producto actualizarStock(Long id, Integer nuevoStock) {
        if (nuevoStock == null || nuevoStock < 0) {
            throw new NegocioException("El stock no puede ser un valor negativo.");
        }
        Producto producto = obtenerPorId(id);
        producto.setStock(nuevoStock);
        return productoRepository.save(producto);
    }

    @Override
    public void descontarStock(Long productoId, Integer cantidad) {
        Producto producto = obtenerPorId(productoId);
        if (producto.getStock() < cantidad) {
            throw new NegocioException("Stock insuficiente para '" + producto.getNombre() + "'. Disponibles: " + producto.getStock() + ", solicitados: " + cantidad);
        }
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        productoRepository.delete(producto);
    }

    private Categoria resolverCategoria(String nombre) {
        String nombreFinal = (nombre != null && !nombre.isBlank()) ? nombre.trim().toLowerCase() : "otros";
        return categoriaRepository.findByNombreIgnoreCase(nombreFinal)
                .orElseGet(() -> categoriaRepository.save(new Categoria(nombreFinal, "Categoria creada automaticamente")));
    }
}
