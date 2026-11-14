package cl.duoc.forkmenu.usuarios.controller;

import cl.duoc.forkmenu.common.dto.MensajeRespuestaDTO;
import cl.duoc.forkmenu.usuarios.dto.ActualizarRolDTO;
import cl.duoc.forkmenu.usuarios.dto.UsuarioResponseDTO;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Usuarios", description = "Endpoints de gestion administrativa de usuarios y roles (Solo Administrador)")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Listar todos los usuarios del sistema")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        List<UsuarioResponseDTO> lista = usuarioService.listarTodos().stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Obtener un usuario por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
    }

    @Operation(summary = "Crear o actualizar un usuario desde el panel de administracion")
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearOActualizar(@RequestBody Usuario usuario) {
        Usuario guardado = usuarioService.agregarOActualizar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponseDTO(guardado));
    }

    @Operation(summary = "Actualizar el rol de un usuario existente")
    @PatchMapping("/{id}/rol")
    public ResponseEntity<UsuarioResponseDTO> actualizarRol(@PathVariable Long id, @Valid @RequestBody ActualizarRolDTO dto) {
        Usuario actualizado = usuarioService.actualizarRol(id, dto.getRol());
        return ResponseEntity.ok(new UsuarioResponseDTO(actualizado));
    }

    @Operation(summary = "Eliminar un usuario por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<MensajeRespuestaDTO> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok(new MensajeRespuestaDTO(true, "Usuario eliminado exitosamente con ID: " + id));
    }

    @Operation(summary = "Eliminar un usuario por su RUN o correo electronico")
    @DeleteMapping("/identificador/{identificador}")
    public ResponseEntity<MensajeRespuestaDTO> eliminarPorIdentificador(@PathVariable String identificador) {
        usuarioService.eliminarPorIdentificador(identificador);
        return ResponseEntity.ok(new MensajeRespuestaDTO(true, "Usuario eliminado exitosamente: " + identificador));
    }
}
