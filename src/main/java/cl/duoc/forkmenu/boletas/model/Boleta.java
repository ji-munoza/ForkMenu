package cl.duoc.forkmenu.boletas.model;

import cl.duoc.forkmenu.usuarios.model.Usuario;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa la boleta o pedido emitido.
 */
@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 120)
    private String cliente;

    @Column(length = 120)
    private String clienteCorreo;

    @Column(nullable = false, length = 40)
    private String modalidad;

    @Column(length = 255)
    private String detalleModalidad;

    @Column(nullable = false)
    private Integer subtotal = 0;

    @Column(nullable = false)
    private Integer descuento = 0;

    @Column(nullable = false)
    private Integer total = 0;

    @Column(nullable = false, length = 50)
    private String estado = "En preparación";

    @JsonFormat(pattern = "dd/MM/yyyy, HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fecha;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoleta> items = new ArrayList<>();

    public Boleta() {
        this.fecha = LocalDateTime.now();
    }

    public Boleta(String codigo, Usuario usuario, String cliente, String clienteCorreo, String modalidad, String detalleModalidad, Integer subtotal, Integer descuento, Integer total, String estado) {
        this.codigo = codigo;
        this.usuario = usuario;
        this.cliente = cliente;
        this.clienteCorreo = clienteCorreo;
        this.modalidad = modalidad;
        this.detalleModalidad = detalleModalidad;
        this.subtotal = subtotal != null ? subtotal : 0;
        this.descuento = descuento != null ? descuento : 0;
        this.total = total != null ? total : 0;
        this.estado = estado != null ? estado : "En preparación";
        this.fecha = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public Integer getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Integer subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getDescuento() {
        return descuento;
    }

    public void setDescuento(Integer descuento) {
        this.descuento = descuento;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<DetalleBoleta> getItems() {
        return items;
    }

    public void setItems(List<DetalleBoleta> items) {
        this.items = items;
    }

    public void agregarDetalle(DetalleBoleta detalle) {
        items.add(detalle);
        detalle.setBoleta(this);
    }
}
