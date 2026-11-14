package cl.duoc.forkmenu.catalogo.service.impl;

import cl.duoc.forkmenu.catalogo.model.Categoria;
import cl.duoc.forkmenu.catalogo.repository.CategoriaRepository;
import cl.duoc.forkmenu.catalogo.service.CategoriaService;
import cl.duoc.forkmenu.common.exception.NegocioException;
import cl.duoc.forkmenu.common.exception.RecursoNoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Categoria obtenerPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Categoria obtenerPorNombre(String nombre) {
        return categoriaRepository.findByNombreIgnoreCase(nombre)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada: " + nombre));
    }

    @Override
    public Categoria guardar(Categoria categoria) {
        if (categoria.getId() == null && categoriaRepository.existsByNombreIgnoreCase(categoria.getNombre())) {
            throw new NegocioException("Ya existe una categoria con el nombre: " + categoria.getNombre());
        }
        return categoriaRepository.save(categoria);
    }
}
