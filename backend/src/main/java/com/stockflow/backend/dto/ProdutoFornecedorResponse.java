
package com.stockflow.backend.dto;

import com.stockflow.backend.model.ProdutoFornecedor;

public class ProdutoFornecedorResponse {

    private Long id;

    private Long produtoId;
    private String produtoNome;
    private String produtoSku;

    private Long fornecedorId;
    private String fornecedorNome;
    private String fornecedorCnpj;

    public ProdutoFornecedorResponse(ProdutoFornecedor vinculo) {
        this.id = vinculo.getId();

        this.produtoId = vinculo.getProduto().getId();
        this.produtoNome = vinculo.getProduto().getNome();
        this.produtoSku = vinculo.getProduto().getSku();

        this.fornecedorId = vinculo.getFornecedor().getId();
        this.fornecedorNome = vinculo.getFornecedor().getNome();
        this.fornecedorCnpj = vinculo.getFornecedor().getCnpj();
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

    public Long getFornecedorId() {
        return fornecedorId;
    }

    public String getFornecedorNome() {
        return fornecedorNome;
    }

    public String getFornecedorCnpj() {
        return fornecedorCnpj;
    }
}
