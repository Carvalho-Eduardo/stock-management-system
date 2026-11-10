
package com.stockflow.backend.dto;

public class LoginResponse {

    private String token;
    private String tipoToken;
    private long expiresIn;
    private UsuarioResponse usuario;

    public LoginResponse(
            String token,
            long expiresIn,
            UsuarioResponse usuario
    ) {
        this.token = token;
        this.tipoToken = "Bearer";
        this.expiresIn = expiresIn;
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public String getTipoToken() {
        return tipoToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public UsuarioResponse getUsuario() {
        return usuario;
    }
}
