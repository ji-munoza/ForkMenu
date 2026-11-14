package cl.duoc.forkmenu.boletas.service;

import cl.duoc.forkmenu.boletas.dto.CrearBoletaDTO;
import cl.duoc.forkmenu.boletas.model.Boleta;

import java.util.List;

public interface BoletaService {

    List<Boleta> listarTodas(String estado);

    Boleta obtenerPorCodigo(String codigo);

    Boleta obtenerPorId(Long id);

    List<Boleta> listarPorUsuario(String correoOCliente);

    Boleta emitirBoleta(CrearBoletaDTO dto, String correoUsuarioAutenticado);

    Boleta actualizarEstado(String codigo, String nuevoEstado);
}
