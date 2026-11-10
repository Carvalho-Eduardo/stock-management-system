
package com.stockflow.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private long totalProdutos;
    private long totalFornecedores;
    private long totalProdutosEstoqueBaixo;
    private BigDecimal valorTotalEstoque;
    private long comprasPendentes;
    private long totalEntradas;
    private long totalSaidas;

    private List<ProdutoEstoqueBaixoResponse> produtosEstoqueBaixo;
    private List<MovimentacaoRecenteResponse> movimentacoesRecentes;

    public DashboardResponse(
            long totalProdutos,
            long totalFornecedores,
            long totalProdutosEstoqueBaixo,
            BigDecimal valorTotalEstoque,
            long comprasPendentes,
            long totalEntradas,
            long totalSaidas,
            List<ProdutoEstoqueBaixoResponse> produtosEstoqueBaixo,
            List<MovimentacaoRecenteResponse> movimentacoesRecentes
    ) {
        this.totalProdutos = totalProdutos;
        this.totalFornecedores = totalFornecedores;
        this.totalProdutosEstoqueBaixo = totalProdutosEstoqueBaixo;
        this.valorTotalEstoque = valorTotalEstoque;
        this.comprasPendentes = comprasPendentes;
        this.totalEntradas = totalEntradas;
        this.totalSaidas = totalSaidas;
        this.produtosEstoqueBaixo = produtosEstoqueBaixo;
        this.movimentacoesRecentes = movimentacoesRecentes;
    }

    public long getTotalProdutos() {
        return totalProdutos;
    }

    public long getTotalFornecedores() {
        return totalFornecedores;
    }

    public long getTotalProdutosEstoqueBaixo() {
        return totalProdutosEstoqueBaixo;
    }

    public BigDecimal getValorTotalEstoque() {
        return valorTotalEstoque;
    }

    public long getComprasPendentes() {
        return comprasPendentes;
    }

    public long getTotalEntradas() {
        return totalEntradas;
    }

    public long getTotalSaidas() {
        return totalSaidas;
    }

    public List<ProdutoEstoqueBaixoResponse> getProdutosEstoqueBaixo() {
        return produtosEstoqueBaixo;
    }

    public List<MovimentacaoRecenteResponse> getMovimentacoesRecentes() {
        return movimentacoesRecentes;
    }
}
