package cl.duoc.forkmenu.usuarios.repository;

import cl.duoc.forkmenu.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    Optional<Usuario> findByRun(String run);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByRun(String run);
}
