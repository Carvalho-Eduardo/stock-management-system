
package com.stockflow.backend.dto;

import com.stockflow.backend.model.Compra;
import com.stockflow.backend.model.ItemCompra;
import com.stockflow.backend.model.StatusCompra;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CompraResponse {

    private Long id;
    private Long fornecedorId;
    private String fornecedorNome;
    private List<ItemResponse> itens;
    private BigDecimal valorTotal;
    private StatusCompra status;
    private String observacao;
    private LocalDateTime dataCadastro;
    private LocalDateTime dataRecebimento;

    public CompraResponse(Compra compra) {
        this.id = compra.getId();
        this.fornecedorId = compra.getFornecedor().getId();
        this.fornecedorNome = compra.getFornecedor().getNome();
        this.valorTotal = compra.getValorTotal();
        this.status = compra.getStatus();
        this.observacao = compra.getObservacao();
        this.dataCadastro = compra.getDataCadastro();
        this.dataRecebimento = compra.getDataRecebimento();

        this.itens = compra.getItens()
                .stream()
                .map(ItemResponse::new)
                .toList();
    }

    public Long getId() {
        return id;
    }

    public Long getFornecedorId() {
        return fornecedorId;
    }

    public String getFornecedorNome() {
        return fornecedorNome;
    }

    public List<ItemResponse> getItens() {
        return itens;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public StatusCompra getStatus() {
        return status;
    }

    public String getObservacao() {
        return observacao;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public LocalDateTime getDataRecebimento() {
        return dataRecebimento;
    }

    public static class ItemResponse {

        private Long id;
        private Long produtoId;
        private String produtoNome;
        private String produtoSku;
        private Integer quantidade;
        private BigDecimal precoUnitario;
        private BigDecimal subtotal;

        public ItemResponse(ItemCompra item) {
            this.id = item.getId();
            this.produtoId = item.getProduto().getId();
            this.produtoNome = item.getProduto().getNome();
            this.produtoSku = item.getProduto().getSku();
            this.quantidade = item.getQuantidade();
            this.precoUnitario = item.getPrecoUnitario();
            this.subtotal = item.getSubtotal();
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

        public Integer getQuantidade() {
            return quantidade;
        }

        public BigDecimal getPrecoUnitario() {
            return precoUnitario;
        }

        public BigDecimal getSubtotal() {
            return subtotal;
        }
    }
}
