package cl.duoc.forkmenu.boletas.repository;

import cl.duoc.forkmenu.boletas.model.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {

    Optional<Boleta> findByCodigo(String codigo);

    List<Boleta> findAllByOrderByFechaDesc();

    List<Boleta> findByEstadoOrderByFechaDesc(String estado);

    @Query("SELECT b FROM Boleta b WHERE b.usuario IS NOT NULL AND LOWER(b.usuario.correo) = LOWER(:correo) ORDER BY b.fecha DESC")
    List<Boleta> findByUsuarioCorreoIgnoreCaseOrderByFechaDesc(@Param("correo") String correo);

    List<Boleta> findByClienteIgnoreCaseOrderByFechaDesc(String cliente);
}
