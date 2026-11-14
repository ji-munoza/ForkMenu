package cl.duoc.forkmenu.catalogo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ActualizarStockDTO {

    @NotNull(message = "El nuevo valor de stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser un valor negativo")
    private Integer stock;

    public ActualizarStockDTO() {
    }

    public ActualizarStockDTO(Integer stock) {
        this.stock = stock;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
