package cl.duoc.forkmenu.catalogo;

import cl.duoc.forkmenu.catalogo.dto.ActualizarStockDTO;
import cl.duoc.forkmenu.catalogo.dto.ProductoRequestDTO;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductoControllerTest {

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
    void listarProductos_SinAutenticacion_Retorna200() throws Exception {
        mockMvc.perform(get("/v1/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void crearProducto_SinToken_Retorna401() throws Exception {
        ProductoRequestDTO dto = new ProductoRequestDTO();
        dto.setCodigo("FM-999");
        dto.setNombre("Producto Test");
        dto.setPrecio(5000);
        dto.setStock(10);

        mockMvc.perform(post("/v1/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearProducto_ConTokenAdmin_Retorna201() throws Exception {
        String tokenAdmin = obtenerToken("admin@forkmenu.cl", "admin123");

        ProductoRequestDTO dto = new ProductoRequestDTO();
        dto.setCodigo("FM-801");
        dto.setNombre("Hamburguesa Vegana");
        dto.setPrecio(7500);
        dto.setStock(20);
        dto.setStockCritico(5);
        dto.setCategoria("hamburguesas");
        dto.setDescripcion("Deliciosa hamburguesa a base de plantas");

        mockMvc.perform(post("/v1/productos")
                        .header("Authorization", "Bearer " + tokenAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigo").value("FM-801"))
                .andExpect(jsonPath("$.nombre").value("Hamburguesa Vegana"));
    }

    @Test
    void actualizarStock_ConTokenVendedor_Retorna200() throws Exception {
        String tokenVendedor = obtenerToken("vendedor@forkmenu.cl", "vendedor123");

        ActualizarStockDTO dto = new ActualizarStockDTO(35);

        mockMvc.perform(patch("/v1/productos/1/stock")
                        .header("Authorization", "Bearer " + tokenVendedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stock").value(35));
    }
}
