package cl.duoc.forkmenu.catalogo.repository;

import cl.duoc.forkmenu.catalogo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    @Query("SELECT p FROM Producto p WHERE LOWER(p.categoria.nombre) = LOWER(:categoriaNombre)")
    List<Producto> findByCategoriaNombreIgnoreCase(@Param("categoriaNombre") String categoriaNombre);

    @Query("SELECT p FROM Producto p WHERE " +
           "(:categoria = 'todas' OR LOWER(p.categoria.nombre) = LOWER(:categoria)) AND " +
           "(:busqueda IS NULL OR :busqueda = '' OR " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Producto> buscarPorFiltros(@Param("categoria") String categoria, @Param("busqueda") String busqueda);
}
