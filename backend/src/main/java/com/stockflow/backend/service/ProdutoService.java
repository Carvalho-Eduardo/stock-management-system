
package com.stockflow.backend.service;

import com.stockflow.backend.model.Categoria;
import com.stockflow.backend.model.Produto;

import com.stockflow.backend.repository.CategoriaRepository;
import com.stockflow.backend.repository.MovimentacaoEstoqueRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository,
            MovimentacaoEstoqueRepository movimentacaoRepository) {

        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    // Lista todos os produtos cadastrados.
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    // Busca um produto pelo ID.
    public Produto buscarProdutoPorId(Long id) {

        return produtoRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Produto não encontrado com ID: " + id
                        )
                );
    }

    // Busca produtos pelo nome ou SKU.
    public List<Produto> buscarProdutos(String termo) {

        if (termo == null || termo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe um nome ou SKU para realizar a busca."
            );
        }

        return produtoRepository
                .findByNomeContainingIgnoreCaseOrSkuContainingIgnoreCase(
                        termo.trim(),
                        termo.trim()
                );
    }

    // Verifica se a categoria informada existe.
    private Categoria buscarCategoria(Long categoriaId) {

        if (categoriaId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A categoria do produto é obrigatória."
            );
        }

        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria não encontrada com ID: " + categoriaId
                        )
                );
    }

    // Cadastra um novo produto.
    public Produto cadastrarProduto(Produto produto) {

        if (produtoRepository.existsBySku(produto.getSku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um produto cadastrado com este SKU."
            );
        }

        Long categoriaId = produto.getCategoria() == null
                ? null
                : produto.getCategoria().getId();

        Categoria categoria = buscarCategoria(categoriaId);

        produto.setCategoria(categoria);

        return produtoRepository.save(produto);
    }

    // Atualiza os dados de um produto existente.
    // A quantidade em estoque não pode ser alterada diretamente.
    public Produto atualizarProduto(Long id, Produto dadosAtualizados) {

        Produto produtoExistente = buscarProdutoPorId(id);

        boolean skuEmUso = produtoRepository.existsBySkuAndIdNot(
                dadosAtualizados.getSku(),
                id
        );

        if (skuEmUso) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Outro produto já utiliza este SKU."
            );
        }

        Long categoriaId = dadosAtualizados.getCategoria() == null
                ? null
                : dadosAtualizados.getCategoria().getId();

        Categoria categoria = buscarCategoria(categoriaId);

        produtoExistente.setNome(dadosAtualizados.getNome());
        produtoExistente.setDescricao(dadosAtualizados.getDescricao());
        produtoExistente.setSku(dadosAtualizados.getSku());
        produtoExistente.setPreco(dadosAtualizados.getPreco());

        // Não alteramos a quantidadeEstoque.
        // O estoque será atualizado somente pelas movimentações.

        produtoExistente.setEstoqueMinimo(
                dadosAtualizados.getEstoqueMinimo()
        );

        produtoExistente.setCategoria(categoria);

        return produtoRepository.save(produtoExistente);
    }

    // Exclui um produto somente se não possuir movimentações.
    public void excluirProduto(Long id) {

        Produto produto = buscarProdutoPorId(id);

        boolean possuiMovimentacoes =
                movimentacaoRepository.existsByProdutoId(id);

        if (possuiMovimentacoes) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este produto porque existem movimentações de estoque registradas."
            );
        }

        produtoRepository.delete(produto);
    }
}
