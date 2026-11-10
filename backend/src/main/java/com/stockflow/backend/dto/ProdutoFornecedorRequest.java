
package com.stockflow.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProdutoFornecedorRequest {

    @NotNull(message = "O ID do produto é obrigatório.")
    @Positive(message = "O ID do produto deve ser positivo.")
    private Long produtoId;

    @NotNull(message = "O ID do fornecedor é obrigatório.")
    @Positive(message = "O ID do fornecedor deve ser positivo.")
    private Long fornecedorId;

    public ProdutoFornecedorRequest() {
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Long getFornecedorId() {
        return fornecedorId;
    }

    public void setFornecedorId(Long fornecedorId) {
        this.fornecedorId = fornecedorId;
    }
}
