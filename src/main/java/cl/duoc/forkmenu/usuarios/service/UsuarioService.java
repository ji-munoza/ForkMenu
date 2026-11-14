package cl.duoc.forkmenu.usuarios.service;

import cl.duoc.forkmenu.usuarios.model.Usuario;
import java.util.List;

public interface UsuarioService {

    List<Usuario> listarTodos();

    Usuario obtenerPorId(Long id);

    Usuario obtenerPorCorreo(String correo);

    Usuario registrar(Usuario usuario);

    Usuario actualizarRol(Long id, String nuevoRol);

    Usuario agregarOActualizar(Usuario usuario);

    void eliminar(Long id);

    void eliminarPorIdentificador(String identificador);
}
