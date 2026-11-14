package cl.duoc.forkmenu.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Maneja accesos denegados por falta de rol o permisos (HTTP 403).
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("success", false);
        cuerpo.put("status", HttpServletResponse.SC_FORBIDDEN);
        cuerpo.put("error", "Forbidden");
        cuerpo.put("mensaje", "Acceso denegado. No tienes permisos suficientes para realizar esta accion.");
        cuerpo.put("ruta", request.getRequestURI());
        cuerpo.put("timestamp", LocalDateTime.now().toString());

        response.getOutputStream().println(objectMapper.writeValueAsString(cuerpo));
    }
}
