
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.FornecedorRequest;
import com.stockflow.backend.dto.FornecedorResponse;
import com.stockflow.backend.service.FornecedorService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }

    @PostMapping
    public ResponseEntity<FornecedorResponse> cadastrar(
            @Valid @RequestBody FornecedorRequest request
    ) {
        FornecedorResponse fornecedor = fornecedorService.cadastrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(fornecedor);
    }

    @GetMapping
    public ResponseEntity<List<FornecedorResponse>> listarTodos() {

        return ResponseEntity.ok(fornecedorService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<FornecedorResponse>> buscar(
            @RequestParam String termo
    ) {
        return ResponseEntity.ok(fornecedorService.buscar(termo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorResponse> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(fornecedorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FornecedorRequest request
    ) {
        FornecedorResponse fornecedor = fornecedorService.atualizar(id, request);

        return ResponseEntity.ok(fornecedor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        fornecedorService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
