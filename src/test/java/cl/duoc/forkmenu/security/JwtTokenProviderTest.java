package cl.duoc.forkmenu.security;

import cl.duoc.forkmenu.config.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        long expiration = 3600000; // 1 hora
        tokenProvider = new JwtTokenProvider(secret, expiration);
    }

    @Test
    void generarToken_Y_ObtenerDatos_FuncionaCorrectamente() {
        String token = tokenProvider.generarToken("admin@forkmenu.cl", "admin", "11.111.111-1", "Admin General");

        assertNotNull(token);
        assertTrue(tokenProvider.validarToken(token));
        assertEquals("admin@forkmenu.cl", tokenProvider.obtenerCorreoDelToken(token));
        assertEquals("admin", tokenProvider.obtenerRolDelToken(token));
    }

    @Test
    void validarToken_ConTokenInvalido_RetornaFalse() {
        assertFalse(tokenProvider.validarToken("token.totalmente.invalido"));
        assertFalse(tokenProvider.validarToken(""));
        assertFalse(tokenProvider.validarToken(null));
    }
}
