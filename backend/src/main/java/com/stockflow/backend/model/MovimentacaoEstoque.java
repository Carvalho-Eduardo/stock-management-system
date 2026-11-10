
package com.stockflow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes_estoque")
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Produto relacionado à movimentação.
    @NotNull(message = "O produto é obrigatório.")
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    // Usuário responsável pela movimentação.
    // Opcional para preservar os registros históricos antigos.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Tipo da movimentação: ENTRADA ou SAIDA.
    @NotNull(message = "O tipo da movimentação é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimentacao tipo;

    @NotNull(message = "A quantidade é obrigatória.")
    @Positive(message = "A quantidade deve ser maior que zero.")
    @Column(nullable = false)
    private Integer quantidade;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer estoqueAnterior;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer estoquePosterior;

    @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres.")
    @Column(length = 500)
    private String observacao;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataHora;

    public MovimentacaoEstoque() {
    }

    @PrePersist
    protected void registrarDataHora() {
        if (this.dataHora == null) {
            this.dataHora = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public TipoMovimentacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimentacao tipo) {
        this.tipo = tipo;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Integer getEstoqueAnterior() {
        return estoqueAnterior;
    }

    public void setEstoqueAnterior(Integer estoqueAnterior) {
        this.estoqueAnterior = estoqueAnterior;
    }

    public Integer getEstoquePosterior() {
        return estoquePosterior;
    }

    public void setEstoquePosterior(Integer estoquePosterior) {
        this.estoquePosterior = estoquePosterior;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}
