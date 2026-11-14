package cl.duoc.forkmenu.boletas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CrearBoletaDTO {

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String cliente;

    private String clienteCorreo;

    @NotBlank(message = "La modalidad de entrega es obligatoria (retirar, delivery o mesa)")
    private String modalidad;

    private String detalleModalidad;

    private Integer descuento = 0;

    @NotEmpty(message = "La orden debe incluir al menos un producto")
    @Valid
    private List<ItemPedidoDTO> items;

    public CrearBoletaDTO() {
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getClienteCorreo() {
        return clienteCorreo;
    }

    public void setClienteCorreo(String clienteCorreo) {
        this.clienteCorreo = clienteCorreo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getDetalleModalidad() {
        return detalleModalidad;
    }

    public void setDetalleModalidad(String detalleModalidad) {
        this.detalleModalidad = detalleModalidad;
    }

    public Integer getDescuento() {
        return descuento;
    }

    public void setDescuento(Integer descuento) {
        this.descuento = descuento;
    }

    public List<ItemPedidoDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemPedidoDTO> items) {
        this.items = items;
    }
}
