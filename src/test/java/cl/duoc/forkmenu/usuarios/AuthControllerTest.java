package cl.duoc.forkmenu.usuarios;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_ConCredencialesCorrectas_RetornaTokenYDatos() throws Exception {
        Map<String, String> credenciales = new HashMap<>();
        credenciales.put("correo", "admin@forkmenu.cl");
        credenciales.put("contrasena", "admin123");

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciales)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.usuario.correo").value("admin@forkmenu.cl"))
                .andExpect(jsonPath("$.usuario.rol").value("admin"));
    }

    @Test
    void login_ConCredencialesIncorrectas_Retorna401() throws Exception {
        Map<String, String> credenciales = new HashMap<>();
        credenciales.put("correo", "admin@forkmenu.cl");
        credenciales.put("contrasena", "claveErronea");

        mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciales)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void accesoUsuarios_SinToken_Retorna401() throws Exception {
        mockMvc.perform(get("/v1/usuarios"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void accesoUsuarios_ConTokenCliente_Retorna403() throws Exception {
        // 1. Inicia sesion como cliente
        Map<String, String> credenciales = new HashMap<>();
        credenciales.put("correo", "juan.perez@duoc.cl");
        credenciales.put("contrasena", "cliente123");

        MvcResult loginResult = mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciales)))
                .andExpect(status().isOk())
                .andReturn();

        String respuestaJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(respuestaJson).get("token").asText();

        // 2. Intenta acceder al panel de usuarios exclusivo de admin
        mockMvc.perform(get("/v1/usuarios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void accesoUsuarios_ConTokenAdmin_Retorna200() throws Exception {
        // 1. Inicia sesion como admin
        Map<String, String> credenciales = new HashMap<>();
        credenciales.put("correo", "admin@forkmenu.cl");
        credenciales.put("contrasena", "admin123");

        MvcResult loginResult = mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciales)))
                .andExpect(status().isOk())
                .andReturn();

        String respuestaJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(respuestaJson).get("token").asText();

        // 2. Accede exitosamente al panel de administracion
        mockMvc.perform(get("/v1/usuarios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
