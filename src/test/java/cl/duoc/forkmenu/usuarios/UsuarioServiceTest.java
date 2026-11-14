package cl.duoc.forkmenu.usuarios;

import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import cl.duoc.forkmenu.usuarios.service.UsuarioService;
import cl.duoc.forkmenu.usuarios.service.impl.UsuarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioServiceImpl(usuarioRepository, passwordEncoder);
    }

    @Test
    void registrarUsuario_ConCorreoDuplicado_LanzaNegocioException() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("test@duoc.cl");
        usuario.setRun("11.111.111-1");
        usuario.setContrasena("1234");

        when(usuarioRepository.existsByCorreoIgnoreCase("test@duoc.cl")).thenReturn(true);

        assertThrows(NegocioException.class, () -> usuarioService.registrar(usuario));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_Exitoso_EncriptaContrasenaYAsignaRolCliente() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("nuevo@duoc.cl");
        usuario.setRun("22.222.222-2");
        usuario.setContrasena("miClaveSegura");

        when(usuarioRepository.existsByCorreoIgnoreCase("nuevo@duoc.cl")).thenReturn(false);
        when(usuarioRepository.existsByRun("22.222.222-2")).thenReturn(false);
        when(passwordEncoder.encode("miClaveSegura")).thenReturn("HASH_BCRYPT");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario guardado = usuarioService.registrar(usuario);

        assertNotNull(guardado);
        assertEquals("HASH_BCRYPT", guardado.getContrasena());
        assertEquals("cliente", guardado.getRol());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    void actualizarRol_ConRolValido_ActualizaRol() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setRol("cliente");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario actualizado = usuarioService.actualizarRol(1L, "admin");

        assertEquals("admin", actualizado.getRol());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    void actualizarRol_ConRolInvalido_LanzaNegocioException() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        assertThrows(NegocioException.class, () -> usuarioService.actualizarRol(1L, "superusuario"));
        verify(usuarioRepository, never()).save(any());
    }
}
