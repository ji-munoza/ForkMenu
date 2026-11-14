package cl.duoc.forkmenu.common.exception;

import cl.duoc.forkmenu.common.dto.MensajeRespuestaDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de excepciones global para estandarizar las respuestas de error en la API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<MensajeRespuestaDTO> manejarRecursoNoEncontrado(RecursoNoEncontradoException ex) {
        MensajeRespuestaDTO respuesta = new MensajeRespuestaDTO(false, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<MensajeRespuestaDTO> manejarNegocio(NegocioException ex) {
        MensajeRespuestaDTO respuesta = new MensajeRespuestaDTO(false, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidaciones(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errores.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", false);
        respuesta.put("mensaje", "Existen errores en los datos enviados.");
        respuesta.put("errores", errores);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MensajeRespuestaDTO> manejarGeneral(Exception ex) {
        MensajeRespuestaDTO respuesta = new MensajeRespuestaDTO(false, "Ocurrio un error inesperado en el servidor: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
