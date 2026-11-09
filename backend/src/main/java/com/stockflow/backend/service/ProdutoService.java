
package com.stockflow.backend.service;

import com.stockflow.backend.model.Produto;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
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

    // Cadastra um novo produto.
    public Produto cadastrarProduto(Produto produto) {

        if (produtoRepository.existsBySku(produto.getSku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um produto cadastrado com este SKU."
            );
        }

        return produtoRepository.save(produto);
    }

    // Atualiza um produto existente.
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

        produtoExistente.setNome(dadosAtualizados.getNome());
        produtoExistente.setDescricao(dadosAtualizados.getDescricao());
        produtoExistente.setSku(dadosAtualizados.getSku());
        produtoExistente.setPreco(dadosAtualizados.getPreco());
        produtoExistente.setQuantidadeEstoque(
                dadosAtualizados.getQuantidadeEstoque()
        );
        produtoExistente.setEstoqueMinimo(
                dadosAtualizados.getEstoqueMinimo()
        );

        return produtoRepository.save(produtoExistente);
    }

    // Exclui um produto pelo ID.
    public void excluirProduto(Long id) {

        Produto produto = buscarProdutoPorId(id);

        produtoRepository.delete(produto);
    }
}
