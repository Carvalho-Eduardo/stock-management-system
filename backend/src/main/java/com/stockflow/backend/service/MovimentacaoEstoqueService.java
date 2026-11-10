
package com.stockflow.backend.service;

import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.Produto;
import com.stockflow.backend.model.TipoMovimentacao;

import com.stockflow.backend.repository.MovimentacaoEstoqueRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;

    public MovimentacaoEstoqueService(
            MovimentacaoEstoqueRepository movimentacaoRepository,
            ProdutoRepository produtoRepository) {

        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    // Registra uma entrada de produtos no estoque.
    @Transactional
    public MovimentacaoEstoque registrarEntrada(
            Long produtoId,
            Integer quantidade,
            String observacao) {

        return registrarMovimentacao(
                produtoId,
                quantidade,
                observacao,
                TipoMovimentacao.ENTRADA
        );
    }

    // Registra uma saída de produtos do estoque.
    @Transactional
    public MovimentacaoEstoque registrarSaida(
            Long produtoId,
            Integer quantidade,
            String observacao) {

        return registrarMovimentacao(
                produtoId,
                quantidade,
                observacao,
                TipoMovimentacao.SAIDA
        );
    }

    // Centraliza as regras de entrada e saída.
    private MovimentacaoEstoque registrarMovimentacao(
            Long produtoId,
            Integer quantidade,
            String observacao,
            TipoMovimentacao tipo) {

        if (produtoId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O ID do produto é obrigatório."
            );
        }

        if (quantidade == null || quantidade <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A quantidade deve ser maior que zero."
            );
        }

        if (observacao != null && observacao.length() > 500) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A observação deve ter no máximo 500 caracteres."
            );
        }

        // Busca o produto com bloqueio durante a transação.
        Produto produto = produtoRepository.buscarPorIdComBloqueio(produtoId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Produto não encontrado com ID: " + produtoId
                        )
                );

        Integer estoqueAnterior = produto.getQuantidadeEstoque();

        if (estoqueAnterior == null || estoqueAnterior < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "O estoque atual do produto está inválido."
            );
        }

        Integer estoquePosterior;

        if (tipo == TipoMovimentacao.ENTRADA) {

            try {
                estoquePosterior = Math.addExact(
                        estoqueAnterior,
                        quantidade
                );
            } catch (ArithmeticException erro) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "A quantidade resultante ultrapassa o limite permitido."
                );
            }

        } else {

            if (quantidade > estoqueAnterior) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Estoque insuficiente. Quantidade disponível: "
                                + estoqueAnterior
                );
            }

            estoquePosterior = estoqueAnterior - quantidade;
        }

        // Atualiza o estoque do produto.
        produto.setQuantidadeEstoque(estoquePosterior);
        produtoRepository.save(produto);

        // Cria o registro histórico da movimentação.
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();

        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setEstoqueAnterior(estoqueAnterior);
        movimentacao.setEstoquePosterior(estoquePosterior);

        movimentacao.setObservacao(
                observacao == null || observacao.isBlank()
                        ? null
                        : observacao.trim()
        );

        // A atualização do produto e o histórico são salvos
        // dentro da mesma transação.
        return movimentacaoRepository.save(movimentacao);
    }

    // Lista todo o histórico de movimentações.
    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoes() {

        return movimentacaoRepository
                .findAllByOrderByDataHoraDesc();
    }

    // Lista o histórico de um produto específico.
    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoesPorProduto(
            Long produtoId) {

        if (produtoId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O ID do produto é obrigatório."
            );
        }

        if (!produtoRepository.existsById(produtoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produto não encontrado com ID: " + produtoId
            );
        }

        return movimentacaoRepository
                .findByProdutoIdOrderByDataHoraDesc(produtoId);
    }

    // Lista movimentações filtradas pelo tipo.
    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoesPorTipo(
            TipoMovimentacao tipo) {

        if (tipo == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe um tipo de movimentação válido."
            );
        }

        return movimentacaoRepository
                .findByTipoOrderByDataHoraDesc(tipo);
    }
}
