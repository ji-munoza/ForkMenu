package cl.duoc.forkmenu.catalogo.service;

import cl.duoc.forkmenu.catalogo.model.Categoria;
import java.util.List;

public interface CategoriaService {

    List<Categoria> listarTodas();

    Categoria obtenerPorId(Long id);

    Categoria obtenerPorNombre(String nombre);

    Categoria guardar(Categoria categoria);
}
