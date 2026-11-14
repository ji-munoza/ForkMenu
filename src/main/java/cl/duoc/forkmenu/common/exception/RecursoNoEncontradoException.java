package cl.duoc.forkmenu.common.exception;

/**
 * Excepcion lanzada cuando una entidad solicitada no existe en la base de datos.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
