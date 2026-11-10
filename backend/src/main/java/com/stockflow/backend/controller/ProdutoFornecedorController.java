
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.ProdutoFornecedorRequest;
import com.stockflow.backend.dto.ProdutoFornecedorResponse;
import com.stockflow.backend.service.ProdutoFornecedorService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos-fornecedores")
public class ProdutoFornecedorController {

    private final ProdutoFornecedorService vinculoService;

    public ProdutoFornecedorController(
            ProdutoFornecedorService vinculoService
    ) {
        this.vinculoService = vinculoService;
    }

    @PostMapping
    public ResponseEntity<ProdutoFornecedorResponse> cadastrar(
            @Valid @RequestBody ProdutoFornecedorRequest request
    ) {
        ProdutoFornecedorResponse vinculo =
                vinculoService.cadastrar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(vinculo);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoFornecedorResponse>> listarTodos() {
        return ResponseEntity.ok(vinculoService.listarTodos());
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<ProdutoFornecedorResponse>> buscarPorProduto(
            @PathVariable Long produtoId
    ) {
        return ResponseEntity.ok(
                vinculoService.buscarPorProduto(produtoId)
        );
    }

    @GetMapping("/fornecedor/{fornecedorId}")
    public ResponseEntity<List<ProdutoFornecedorResponse>> buscarPorFornecedor(
            @PathVariable Long fornecedorId
    ) {
        return ResponseEntity.ok(
                vinculoService.buscarPorFornecedor(fornecedorId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        vinculoService.remover(id);

        return ResponseEntity.noContent().build();
    }
}
