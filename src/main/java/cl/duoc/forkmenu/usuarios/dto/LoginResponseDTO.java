package cl.duoc.forkmenu.usuarios.dto;

public class LoginResponseDTO {

    private boolean success = true;
    private String token;
    private String tipo = "Bearer";
    private UsuarioResponseDTO usuario;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, UsuarioResponseDTO usuario) {
        this.success = true;
        this.token = token;
        this.tipo = "Bearer";
        this.usuario = usuario;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public UsuarioResponseDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioResponseDTO usuario) {
        this.usuario = usuario;
    }
}
