package cl.duoc.forkmenu.catalogo.controller;

import cl.duoc.forkmenu.catalogo.dto.ActualizarStockDTO;
import cl.duoc.forkmenu.catalogo.dto.ProductoRequestDTO;
import cl.duoc.forkmenu.catalogo.model.Categoria;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.service.CategoriaService;
import cl.duoc.forkmenu.catalogo.service.ProductoService;
import cl.duoc.forkmenu.common.dto.MensajeRespuestaDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Catálogo de Productos", description = "Endpoints de consulta, catálogo y control de inventario")
@RestController
@RequestMapping("/v1")
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;

    public ProductoController(ProductoService productoService, CategoriaService categoriaService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
    }

    @Operation(summary = "Listar productos del catálogo con filtros opcionales de categoría y búsqueda")
    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> listarProductos(
            @RequestParam(required = false, defaultValue = "todas") String categoria,
            @RequestParam(required = false, defaultValue = "") String busqueda) {
        return ResponseEntity.ok(productoService.listarTodos(categoria, busqueda));
    }

    @Operation(summary = "Obtener el detalle de un producto por su ID")
    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @Operation(summary = "Listar todas las categorías gastronómicas disponibles")
    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    @Operation(summary = "Crear un nuevo producto en la carta (Solo Administrador)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/productos")
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody ProductoRequestDTO dto) {
        Producto nuevo = new Producto();
        nuevo.setCodigo(dto.getCodigo().trim());
        nuevo.setNombre(dto.getNombre().trim());
        nuevo.setPrecio(dto.getPrecio());
        nuevo.setStock(dto.getStock());
        nuevo.setStockCritico(dto.getStockCritico() != null ? dto.getStockCritico() : 0);
        nuevo.setDescripcion(dto.getDescripcion());
        nuevo.setImagen(dto.getImagen());

        Producto guardado = productoService.crear(nuevo, dto.getCategoria());
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @Operation(summary = "Actualizar los datos de un producto existente (Solo Administrador)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/productos/{id}")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequestDTO dto) {
        Producto datos = new Producto();
        datos.setCodigo(dto.getCodigo().trim());
        datos.setNombre(dto.getNombre().trim());
        datos.setPrecio(dto.getPrecio());
        datos.setStock(dto.getStock());
        datos.setStockCritico(dto.getStockCritico() != null ? dto.getStockCritico() : 0);
        datos.setDescripcion(dto.getDescripcion());
        datos.setImagen(dto.getImagen());

        Producto actualizado = productoService.actualizar(id, datos, dto.getCategoria());
        return ResponseEntity.ok(actualizado);
    }

    @Operation(summary = "Actualizar el stock de un producto (Administrador y Vendedor)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @PatchMapping("/productos/{id}/stock")
    public ResponseEntity<Producto> actualizarStock(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarStockDTO dto) {
        Producto actualizado = productoService.actualizarStock(id, dto.getStock());
        return ResponseEntity.ok(actualizado);
    }

    @Operation(summary = "Eliminar un producto de la carta (Solo Administrador)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<MensajeRespuestaDTO> eliminarProducto(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(new MensajeRespuestaDTO(true, "Producto eliminado exitosamente con ID: " + id));
    }
}
