
package com.stockflow.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CompraRequest {

    @NotNull(message = "O fornecedor é obrigatório.")
    @Positive(message = "O ID do fornecedor deve ser positivo.")
    private Long fornecedorId;

    @NotEmpty(message = "A compra deve possuir pelo menos um produto.")
    @Valid
    private List<ItemCompraRequest> itens;

    @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres.")
    private String observacao;

    public CompraRequest() {
    }

    public Long getFornecedorId() {
        return fornecedorId;
    }

    public void setFornecedorId(Long fornecedorId) {
        this.fornecedorId = fornecedorId;
    }

    public List<ItemCompraRequest> getItens() {
        return itens;
    }

    public void setItens(List<ItemCompraRequest> itens) {
        this.itens = itens;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
