
package com.stockflow.backend.service;

import com.stockflow.backend.model.Produto;
import com.stockflow.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    // Recebe o Repository através da injeção de dependência.
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // Lista todos os produtos cadastrados.
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    // Busca um produto pelo seu ID.
    public Produto buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Produto não encontrado com ID: " + id)
                );
    }

    // Cadastra um novo produto.
    public Produto cadastrarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    // Atualiza os dados de um produto existente.
    public Produto atualizarProduto(Long id, Produto dadosAtualizados) {

        Produto produtoExistente = buscarProdutoPorId(id);

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

    // Exclui um produto pelo seu ID.
    public void excluirProduto(Long id) {

        Produto produto = buscarProdutoPorId(id);

        produtoRepository.delete(produto);
    }
}
