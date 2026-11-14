package cl.duoc.forkmenu.common.exception;

/**
 * Excepcion para errores de reglas de negocio (ej: stock insuficiente, correo duplicado).
 */
public class NegocioException extends RuntimeException {

    public NegocioException(String mensaje) {
        super(mensaje);
    }
}
