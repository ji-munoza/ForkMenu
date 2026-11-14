package cl.duoc.forkmenu.boletas;

import cl.duoc.forkmenu.boletas.dto.ActualizarEstadoDTO;
import cl.duoc.forkmenu.boletas.dto.CrearBoletaDTO;
import cl.duoc.forkmenu.boletas.dto.ItemPedidoDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BoletaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String obtenerToken(String correo, String clave) throws Exception {
        Map<String, String> credenciales = new HashMap<>();
        credenciales.put("correo", correo);
        credenciales.put("contrasena", clave);

        MvcResult res = mockMvc.perform(post("/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credenciales)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(res.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    void emitirBoleta_SinAutenticacion_CreaPedidoExitosamente() throws Exception {
        CrearBoletaDTO dto = new CrearBoletaDTO();
        dto.setCliente("Cliente Mesa 2");
        dto.setModalidad("mesa");
        dto.setDetalleModalidad("Mesa #2");
        dto.setDescuento(0);
        dto.setItems(List.of(new ItemPedidoDTO(1L, 1)));

        mockMvc.perform(post("/v1/boletas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigo").isString())
                .andExpect(jsonPath("$.cliente").value("Cliente Mesa 2"))
                .andExpect(jsonPath("$.items").isArray());
    }

    @Test
    void consultarBoletaPorCodigo_Retorna200() throws Exception {
        // FM-1001 viene cargada por DataInitializer
        mockMvc.perform(get("/v1/boletas/FM-1001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("FM-1001"));
    }

    @Test
    void listarBoletas_SinToken_Retorna401() throws Exception {
        mockMvc.perform(get("/v1/boletas"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void listarBoletas_ConTokenVendedor_Retorna200() throws Exception {
        String tokenVendedor = obtenerToken("vendedor@forkmenu.cl", "vendedor123");

        mockMvc.perform(get("/v1/boletas")
                        .header("Authorization", "Bearer " + tokenVendedor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void actualizarEstadoBoleta_ConTokenVendedor_Retorna200() throws Exception {
        String tokenVendedor = obtenerToken("vendedor@forkmenu.cl", "vendedor123");

        ActualizarEstadoDTO dto = new ActualizarEstadoDTO("Listo para retiro");

        mockMvc.perform(patch("/v1/boletas/FM-1001/estado")
                        .header("Authorization", "Bearer " + tokenVendedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("Listo para retiro"));
    }
}
