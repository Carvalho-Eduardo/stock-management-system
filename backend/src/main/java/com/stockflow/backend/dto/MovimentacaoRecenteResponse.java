
package com.stockflow.backend.dto;

import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.TipoMovimentacao;
import com.stockflow.backend.model.Usuario;

import java.time.LocalDateTime;

// Representa uma movimentação recente exibida no dashboard.
public class MovimentacaoRecenteResponse {

    private Long id;

    private Long produtoId;

    private String produtoNome;

    private String produtoSku;

    private TipoMovimentacao tipo;

    private Integer quantidade;

    private Integer estoqueAnterior;

    private Integer estoquePosterior;

    private String observacao;

    private LocalDateTime dataHora;

    private Long usuarioId;

    private String usuarioNome;

    public MovimentacaoRecenteResponse(MovimentacaoEstoque movimentacao) {

        this.id = movimentacao.getId();

        this.produtoId = movimentacao.getProduto().getId();

        this.produtoNome = movimentacao.getProduto().getNome();

        this.produtoSku = movimentacao.getProduto().getSku();

        this.tipo = movimentacao.getTipo();

        this.quantidade = movimentacao.getQuantidade();

        this.estoqueAnterior = movimentacao.getEstoqueAnterior();

        this.estoquePosterior = movimentacao.getEstoquePosterior();

        this.observacao = movimentacao.getObservacao();

        this.dataHora = movimentacao.getDataHora();

        // Registros antigos podem não possuir usuário associado.
        Usuario usuario = movimentacao.getUsuario();

        if (usuario != null) {
            this.usuarioId = usuario.getId();
            this.usuarioNome = usuario.getNome();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public String getProdutoNome() {
        return produtoNome;
    }

    public String getProdutoSku() {
        return produtoSku;
    }

    public TipoMovimentacao getTipo() {
        return tipo;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public Integer getEstoqueAnterior() {
        return estoqueAnterior;
    }

    public Integer getEstoquePosterior() {
        return estoquePosterior;
    }

    public String getObservacao() {
        return observacao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }
}
