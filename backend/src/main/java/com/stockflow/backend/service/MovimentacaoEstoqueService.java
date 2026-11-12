
package com.stockflow.backend.service;

import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.Produto;
import com.stockflow.backend.model.TipoMovimentacao;
import com.stockflow.backend.model.Usuario;

import com.stockflow.backend.repository.MovimentacaoEstoqueRepository;
import com.stockflow.backend.repository.ProdutoRepository;
import com.stockflow.backend.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaService auditoriaService;

    public MovimentacaoEstoqueService(
            MovimentacaoEstoqueRepository movimentacaoRepository,
            ProdutoRepository produtoRepository,
            UsuarioRepository usuarioRepository,
            AuditoriaService auditoriaService
    ) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public MovimentacaoEstoque registrarEntrada(
            Long produtoId,
            Integer quantidade,
            String observacao
    ) {
        return registrarMovimentacao(
                produtoId,
                quantidade,
                observacao,
                TipoMovimentacao.ENTRADA
        );
    }

    @Transactional
    public MovimentacaoEstoque registrarSaida(
            Long produtoId,
            Integer quantidade,
            String observacao
    ) {
        return registrarMovimentacao(
                produtoId,
                quantidade,
                observacao,
                TipoMovimentacao.SAIDA
        );
    }

    private MovimentacaoEstoque registrarMovimentacao(
            Long produtoId,
            Integer quantidade,
            String observacao,
            TipoMovimentacao tipo
    ) {

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

        Usuario usuario = obterUsuarioAutenticado();

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

        produto.setQuantidadeEstoque(estoquePosterior);
        produtoRepository.save(produto);

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();

        movimentacao.setProduto(produto);
        movimentacao.setUsuario(usuario);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setEstoqueAnterior(estoqueAnterior);
        movimentacao.setEstoquePosterior(estoquePosterior);

        movimentacao.setObservacao(
                observacao == null || observacao.isBlank()
                        ? null
                        : observacao.trim()
        );

        MovimentacaoEstoque movimentacaoSalva =
                movimentacaoRepository.save(movimentacao);

        auditoriaService.registrar(
                tipo == TipoMovimentacao.ENTRADA ? "ENTRADA" : "SAIDA",
                "ESTOQUE",
                movimentacaoSalva.getId(),
                tipo == TipoMovimentacao.ENTRADA
                        ? "Entrada de " + quantidade
                                + " unidade(s) do produto "
                                + produto.getNome()
                                + ". Estoque: "
                                + estoqueAnterior
                                + " → "
                                + estoquePosterior
                        : "Saída de " + quantidade
                                + " unidade(s) do produto "
                                + produto.getNome()
                                + ". Estoque: "
                                + estoqueAnterior
                                + " → "
                                + estoquePosterior
        );

        return movimentacaoSalva;
    }

    private Usuario obterUsuarioAutenticado() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado."
            );
        }

        String email = authentication.getName();

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Não foi possível identificar o usuário autenticado."
            );
        }

        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Usuário autenticado não encontrado."
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoes() {
        return movimentacaoRepository.findAllByOrderByDataHoraDesc();
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoesPorProduto(
            Long produtoId
    ) {

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

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoque> listarMovimentacoesPorTipo(
            TipoMovimentacao tipo
    ) {

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
