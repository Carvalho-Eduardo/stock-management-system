
package com.stockflow.backend.dto;

import com.stockflow.backend.model.Produto;

import java.math.BigDecimal;

public class ProdutoEstoqueBaixoResponse {

    private Long id;
    private String nome;
    private String sku;
    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private BigDecimal preco;

    public ProdutoEstoqueBaixoResponse(Produto produto) {
        this.id = produto.getId();
        this.nome = produto.getNome();
        this.sku = produto.getSku();
        this.quantidadeEstoque = produto.getQuantidadeEstoque();
        this.estoqueMinimo = produto.getEstoqueMinimo();
        this.preco = produto.getPreco();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getSku() {
        return sku;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public BigDecimal getPreco() {
        return preco;
    }
}
