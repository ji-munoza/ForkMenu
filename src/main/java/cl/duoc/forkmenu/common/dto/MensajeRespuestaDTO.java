package cl.duoc.forkmenu.common.dto;

import java.time.LocalDateTime;

/**
 * Estructura estandar para respuestas informativas o de error.
 */
public class MensajeRespuestaDTO {

    private boolean success;
    private String mensaje;
    private LocalDateTime timestamp;

    public MensajeRespuestaDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public MensajeRespuestaDTO(boolean success, String mensaje) {
        this.success = success;
        this.mensaje = mensaje;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
