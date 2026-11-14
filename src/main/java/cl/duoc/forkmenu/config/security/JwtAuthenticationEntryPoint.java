package cl.duoc.forkmenu.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Maneja peticiones no autenticadas (HTTP 401) respondiendo con formato JSON estandar.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("success", false);
        cuerpo.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        cuerpo.put("error", "Unauthorized");
        cuerpo.put("mensaje", "Acceso no autorizado. Debes iniciar sesion para continuar.");
        cuerpo.put("ruta", request.getRequestURI());
        cuerpo.put("timestamp", LocalDateTime.now().toString());

        response.getOutputStream().println(objectMapper.writeValueAsString(cuerpo));
    }
}
