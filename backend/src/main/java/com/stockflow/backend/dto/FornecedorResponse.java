
package com.stockflow.backend.dto;

import com.stockflow.backend.model.Fornecedor;

public class FornecedorResponse {

    private Long id;
    private String nome;
    private String cnpj;
    private String email;
    private String telefone;
    private String endereco;

    public FornecedorResponse(Fornecedor fornecedor) {
        this.id = fornecedor.getId();
        this.nome = fornecedor.getNome();
        this.cnpj = fornecedor.getCnpj();
        this.email = fornecedor.getEmail();
        this.telefone = fornecedor.getTelefone();
        this.endereco = fornecedor.getEndereco();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEndereco() {
        return endereco;
    }
}
    