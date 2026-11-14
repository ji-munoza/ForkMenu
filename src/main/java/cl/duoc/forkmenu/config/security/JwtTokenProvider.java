package cl.duoc.forkmenu.config.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Componente para la generacion, firma y validacion de tokens JWT.
 */
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;

    public JwtTokenProvider(
            @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String secret,
            @Value("${jwt.expiration:86400000}") long expiration) {
        // Asegura que la clave tenga al menos 256 bits para HMAC-SHA
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = expiration;
    }

    /**
     * Genera un token JWT con correo, rol, run y nombre como claims.
     */
    public String generarToken(String correo, String rol, String run, String nombre) {
        Date ahora = new Date();
        Date fechaExpiracion = new Date(ahora.getTime() + expiration);

        return Jwts.builder()
                .subject(correo)
                .claim("rol", rol)
                .claim("run", run != null ? run : "")
                .claim("nombre", nombre != null ? nombre : "")
                .issuedAt(ahora)
                .expiration(fechaExpiracion)
                .signWith(key)
                .compact();
    }

    /**
     * Obtiene el correo (subject) contenido en el token.
     */
    public String obtenerCorreoDelToken(String token) {
        return obtenerClaims(token).getSubject();
    }

    /**
     * Obtiene el rol contenido en los claims del token.
     */
    public String obtenerRolDelToken(String token) {
        Object rol = obtenerClaims(token).get("rol");
        return rol != null ? rol.toString() : "cliente";
    }

    /**
     * Valida que el token tenga una firma correcta y no haya expirado.
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
