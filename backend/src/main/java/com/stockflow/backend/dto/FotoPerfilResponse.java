
package com.stockflow.backend.dto;

public class FotoPerfilResponse {

    private final byte[] conteudo;
    private final String tipo;

    public FotoPerfilResponse(byte[] conteudo, String tipo) {
        this.conteudo = conteudo;
        this.tipo = tipo;
    }

    public byte[] getConteudo() {
        return conteudo;
    }

    public String getTipo() {
        return tipo;
    }
}
