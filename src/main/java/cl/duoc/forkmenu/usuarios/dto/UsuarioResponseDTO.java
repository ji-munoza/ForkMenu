package cl.duoc.forkmenu.usuarios.dto;

import cl.duoc.forkmenu.usuarios.model.Usuario;

public class UsuarioResponseDTO {

    private Long id;
    private String run;
    private String nombre;
    private String apellidos;
    private String correo;
    private String rol;
    private String region;
    private String comuna;
    private String direccion;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(Usuario usuario) {
        if (usuario != null) {
            this.id = usuario.getId();
            this.run = usuario.getRun();
            this.nombre = usuario.getNombre();
            this.apellidos = usuario.getApellidos();
            this.correo = usuario.getCorreo();
            this.rol = usuario.getRol();
            this.region = usuario.getRegion();
            this.comuna = usuario.getComuna();
            this.direccion = usuario.getDireccion();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRun() {
        return run;
    }

    public void setRun(String run) {
        this.run = run;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
