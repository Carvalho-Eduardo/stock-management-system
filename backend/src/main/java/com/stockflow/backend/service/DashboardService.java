
package com.stockflow.backend.service;

import com.stockflow.backend.dto.DashboardResponse;
import com.stockflow.backend.dto.MovimentacaoRecenteResponse;
import com.stockflow.backend.dto.ProdutoEstoqueBaixoResponse;

import com.stockflow.backend.model.StatusCompra;
import com.stockflow.backend.model.TipoMovimentacao;

import com.stockflow.backend.repository.ProdutoRepository;
import com.stockflow.backend.repository.FornecedorRepository;
import com.stockflow.backend.repository.CompraRepository;
import com.stockflow.backend.repository.MovimentacaoEstoqueRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final CompraRepository compraRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;

    public DashboardService(
            ProdutoRepository produtoRepository,
            FornecedorRepository fornecedorRepository,
            CompraRepository compraRepository,
            MovimentacaoEstoqueRepository movimentacaoRepository
    ) {
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.compraRepository = compraRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse buscarDados() {

        long totalProdutos = produtoRepository.count();

        long totalFornecedores = fornecedorRepository.count();

        var produtosBaixoEstoque =
                produtoRepository.buscarProdutosComEstoqueBaixo();

        long totalProdutosEstoqueBaixo = produtosBaixoEstoque.size();

        BigDecimal valorTotalEstoque =
                produtoRepository.calcularValorTotalEstoque();

        long comprasPendentes =
                compraRepository.countByStatus(StatusCompra.PENDENTE);

        long totalEntradas =
                movimentacaoRepository.countByTipo(TipoMovimentacao.ENTRADA);

        long totalSaidas =
                movimentacaoRepository.countByTipo(TipoMovimentacao.SAIDA);

        List<ProdutoEstoqueBaixoResponse> produtosEstoqueBaixo =
                produtosBaixoEstoque.stream()
                        .map(ProdutoEstoqueBaixoResponse::new)
                        .toList();

        List<MovimentacaoRecenteResponse> movimentacoesRecentes =
                movimentacaoRepository.findTop10ByOrderByDataHoraDesc()
                        .stream()
                        .map(MovimentacaoRecenteResponse::new)
                        .toList();

        return new DashboardResponse(
                totalProdutos,
                totalFornecedores,
                totalProdutosEstoqueBaixo,
                valorTotalEstoque,
                comprasPendentes,
                totalEntradas,
                totalSaidas,
                produtosEstoqueBaixo,
                movimentacoesRecentes
        );
    }
}
