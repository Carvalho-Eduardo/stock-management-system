
package com.stockflow.backend.controller;

import com.stockflow.backend.model.Produto;
import com.stockflow.backend.service.ProdutoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Lista todos os produtos.
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(produtoService.listarProdutos());
    }

    // Busca um produto pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable Long id) {
        return ResponseEntity.ok(
                produtoService.buscarProdutoPorId(id)
        );
    }

    // Cadastra um novo produto.
    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(
            @RequestBody Produto produto) {

        Produto produtoSalvo = produtoService.cadastrarProduto(produto);

        return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
    }

    // Atualiza um produto existente.
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(
            @PathVariable Long id,
            @RequestBody Produto produto) {

        Produto produtoAtualizado =
                produtoService.atualizarProduto(id, produto);

        return ResponseEntity.ok(produtoAtualizado);
    }

    // Exclui um produto.
    @DeleteMapping("/{id}") 
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        produtoService.excluirProduto(id);

        return ResponseEntity.noContent().build();
    }
}
