package cl.duoc.forkmenu.usuarios.controller;

import cl.duoc.forkmenu.config.security.JwtTokenProvider;
import cl.duoc.forkmenu.usuarios.dto.LoginRequestDTO;
import cl.duoc.forkmenu.usuarios.dto.LoginResponseDTO;
import cl.duoc.forkmenu.usuarios.dto.RegistroRequestDTO;
import cl.duoc.forkmenu.usuarios.dto.UsuarioResponseDTO;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Autenticación", description = "Endpoints de inicio de sesión, registro y verificación de token")
@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Iniciar sesión y obtener token JWT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        String correoLimpio = dto.getCorreo().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correoLimpio, dto.getContrasena())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Usuario usuario = usuarioService.obtenerPorCorreo(correoLimpio);
        String token = tokenProvider.generarToken(
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.getRun(),
                usuario.getNombreCompleto()
        );

        return ResponseEntity.ok(new LoginResponseDTO(token, new UsuarioResponseDTO(usuario)));
    }

    @Operation(summary = "Registrar un nuevo cliente en el sistema")
    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setRun(dto.getRun().trim());
        usuario.setNombre(dto.getNombre().trim());
        usuario.setApellidos(dto.getApellidos() != null ? dto.getApellidos().trim() : "");
        usuario.setCorreo(dto.getCorreo().trim().toLowerCase());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRol(dto.getRol() != null && !dto.getRol().isBlank() ? dto.getRol().trim().toLowerCase() : "cliente");
        usuario.setRegion(dto.getRegion());
        usuario.setComuna(dto.getComuna());
        usuario.setDireccion(dto.getDireccion());

        Usuario guardado = usuarioService.registrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponseDTO(guardado));
    }

    @Operation(summary = "Obtener datos del usuario actualmente autenticado")
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuarioActual(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioService.obtenerPorCorreo(authentication.getName());
        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
    }
}
