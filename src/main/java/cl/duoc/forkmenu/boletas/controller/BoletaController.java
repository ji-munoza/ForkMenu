package cl.duoc.forkmenu.boletas.controller;

import cl.duoc.forkmenu.boletas.dto.ActualizarEstadoDTO;
import cl.duoc.forkmenu.boletas.dto.CrearBoletaDTO;
import cl.duoc.forkmenu.boletas.model.Boleta;
import cl.duoc.forkmenu.boletas.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Boletas y Pedidos", description = "Endpoints de compra, emision de boletas y seguimiento de pedidos")
@RestController
@RequestMapping("/v1/boletas")
public class BoletaController {

    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @Operation(summary = "Emitir una nueva boleta de compra (descuenta stock en tiempo real)")
    @PostMapping
    public ResponseEntity<Boleta> emitirBoleta(
            @Valid @RequestBody CrearBoletaDTO dto,
            Authentication authentication) {
        String correoAuth = (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName()))
                ? authentication.getName()
                : null;

        Boleta boleta = boletaService.emitirBoleta(dto, correoAuth);
        return ResponseEntity.status(HttpStatus.CREATED).body(boleta);
    }

    @Operation(summary = "Listar todas las boletas con filtro opcional de estado (Admin y Vendedor)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @GetMapping
    public ResponseEntity<List<Boleta>> listarBoletas(
            @RequestParam(required = false, defaultValue = "todos") String estado) {
        return ResponseEntity.ok(boletaService.listarTodas(estado));
    }

    @Operation(summary = "Consultar el estado y detalle de un pedido por su codigo FM-XXXX (Publico)")
    @GetMapping("/{codigo}")
    public ResponseEntity<Boleta> obtenerPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(boletaService.obtenerPorCodigo(codigo));
    }

    @Operation(summary = "Obtener el historial de pedidos del usuario autenticado")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/mis-boletas")
    public ResponseEntity<List<Boleta>> misBoletas(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(boletaService.listarPorUsuario(authentication.getName()));
    }

    @Operation(summary = "Actualizar el estado del pedido en cocina o despacho (Admin y Vendedor)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @PatchMapping("/{codigo}/estado")
    public ResponseEntity<Boleta> actualizarEstado(
            @PathVariable String codigo,
            @Valid @RequestBody ActualizarEstadoDTO dto) {
        Boleta boleta = boletaService.actualizarEstado(codigo, dto.getEstado());
        return ResponseEntity.ok(boleta);
    }
}
