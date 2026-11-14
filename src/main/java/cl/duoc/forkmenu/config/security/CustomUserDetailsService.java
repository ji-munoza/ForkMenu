package cl.duoc.forkmenu.config.security;

import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servicio para cargar el usuario desde la base de datos y mapear sus roles a Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        String rol = usuario.getRol() != null ? usuario.getRol().toUpperCase() : "CLIENTE";
        SimpleGrantedAuthority autoridad = new SimpleGrantedAuthority("ROLE_" + rol);

        return new User(
                usuario.getCorreo(),
                usuario.getContrasena(),
                Collections.singletonList(autoridad)
        );
    }
}
