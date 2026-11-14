package cl.duoc.forkmenu.usuarios.service.impl;

import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.common.exception.RecursoNoEncontradoException;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import cl.duoc.forkmenu.usuarios.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo.trim())
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con correo: " + correo));
    }

    @Override
    public Usuario registrar(Usuario usuario) {
        String emailNorm = usuario.getCorreo().trim().toLowerCase();
        if (usuarioRepository.existsByCorreoIgnoreCase(emailNorm)) {
            throw new NegocioException("Este correo electronico ya se encuentra registrado.");
        }
        if (usuario.getRun() != null && !usuario.getRun().isBlank() && usuarioRepository.existsByRun(usuario.getRun())) {
            throw new NegocioException("Ya existe un usuario registrado con este RUN.");
        }

        usuario.setCorreo(emailNorm);
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("cliente");
        }
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizarRol(Long id, String nuevoRol) {
        Usuario usuario = obtenerPorId(id);
        String rolLimpio = nuevoRol != null ? nuevoRol.trim().toLowerCase() : "cliente";
        if (!rolLimpio.equals("admin") && !rolLimpio.equals("vendedor") && !rolLimpio.equals("cliente")) {
            throw new NegocioException("El rol '" + nuevoRol + "' no es valido. Roles permitidos: admin, vendedor, cliente.");
        }
        usuario.setRol(rolLimpio);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario agregarOActualizar(Usuario datos) {
        String emailNorm = datos.getCorreo().trim().toLowerCase();
        Optional<Usuario> existentePorEmail = usuarioRepository.findByCorreoIgnoreCase(emailNorm);
        Optional<Usuario> existentePorRun = (datos.getRun() != null && !datos.getRun().isBlank()) 
                ? usuarioRepository.findByRun(datos.getRun().trim()) 
                : Optional.empty();

        Usuario usuarioAGuardar = existentePorEmail.or(() -> existentePorRun).orElse(new Usuario());

        usuarioAGuardar.setRun(datos.getRun() != null ? datos.getRun().trim() : usuarioAGuardar.getRun());
        usuarioAGuardar.setNombre(datos.getNombre() != null ? datos.getNombre().trim() : usuarioAGuardar.getNombre());
        usuarioAGuardar.setApellidos(datos.getApellidos() != null ? datos.getApellidos().trim() : usuarioAGuardar.getApellidos());
        usuarioAGuardar.setCorreo(emailNorm);
        usuarioAGuardar.setRol(datos.getRol() != null ? datos.getRol().trim().toLowerCase() : "cliente");
        usuarioAGuardar.setRegion(datos.getRegion());
        usuarioAGuardar.setComuna(datos.getComuna());
        usuarioAGuardar.setDireccion(datos.getDireccion());

        if (datos.getContrasena() != null && !datos.getContrasena().isBlank()) {
            usuarioAGuardar.setContrasena(passwordEncoder.encode(datos.getContrasena()));
        } else if (usuarioAGuardar.getId() == null) {
            usuarioAGuardar.setContrasena(passwordEncoder.encode("1234"));
        }

        return usuarioRepository.save(usuarioAGuardar);
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuarioRepository.delete(usuario);
    }

    @Override
    public void eliminarPorIdentificador(String identificador) {
        String limpio = identificador.trim();
        Optional<Usuario> usuario = usuarioRepository.findByCorreoIgnoreCase(limpio)
                .or(() -> usuarioRepository.findByRun(limpio));

        if (usuario.isEmpty()) {
            throw new RecursoNoEncontradoException("No se encontro ningun usuario con el identificador: " + identificador);
        }

        usuarioRepository.delete(usuario.get());
    }
}
