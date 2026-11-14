package cl.duoc.forkmenu.boletas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ActualizarEstadoDTO {

    @NotBlank(message = "El nuevo estado es obligatorio")
    @Pattern(
            regexp = "^(En preparación|Listo para retiro|En camino|Entregado|Cancelado)$",
            message = "Estado invalido. Opciones permitidas: En preparación, Listo para retiro, En camino, Entregado, Cancelado"
    )
    private String estado;

    public ActualizarEstadoDTO() {
    }

    public ActualizarEstadoDTO(String estado) {
        this.estado = estado;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
