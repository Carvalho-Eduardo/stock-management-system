
package com.stockflow.backend.dto;

import com.stockflow.backend.model.Auditoria;

import java.time.LocalDateTime;

public class AuditoriaResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioEmail;
    private String acao;
    private String modulo;
    private Long registroId;
    private String descricao;
    private LocalDateTime dataHora;

    public AuditoriaResponse(Auditoria auditoria) {
        this.id = auditoria.getId();

        if (auditoria.getUsuario() != null) {
            this.usuarioId = auditoria.getUsuario().getId();
            this.usuarioNome = auditoria.getUsuario().getNome();
            this.usuarioEmail = auditoria.getUsuario().getEmail();
        }

        this.acao = auditoria.getAcao();
        this.modulo = auditoria.getModulo();
        this.registroId = auditoria.getRegistroId();
        this.descricao = auditoria.getDescricao();
        this.dataHora = auditoria.getDataHora();
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public String getAcao() {
        return acao;
    }

    public String getModulo() {
        return modulo;
    }

    public Long getRegistroId() {
        return registroId;
    }

    public String getDescricao() {
        return descricao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }
}
