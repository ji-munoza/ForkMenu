package cl.duoc.forkmenu.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ActualizarRolDTO {

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "^(?i)(admin|vendedor|cliente)$", message = "El rol debe ser admin, vendedor o cliente")
    private String rol;

    public ActualizarRolDTO() {
    }

    public ActualizarRolDTO(String rol) {
        this.rol = rol;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
