
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.MovimentacaoEstoqueRequest;
import com.stockflow.backend.dto.MovimentacaoEstoqueResponse;
import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.TipoMovimentacao;
import com.stockflow.backend.service.MovimentacaoEstoqueService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Define as rotas REST para controle de movimentações.
@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoEstoqueController {

    private final MovimentacaoEstoqueService movimentacaoService;

    public MovimentacaoEstoqueController(
            MovimentacaoEstoqueService movimentacaoService) {

        this.movimentacaoService = movimentacaoService;
    }

    // Registra uma entrada de produtos no estoque.
    @PostMapping("/entrada")
    public ResponseEntity<MovimentacaoEstoqueResponse> registrarEntrada(
            @Valid @RequestBody MovimentacaoEstoqueRequest request) {

        MovimentacaoEstoque movimentacao =
                movimentacaoService.registrarEntrada(
                        request.getProdutoId(),
                        request.getQuantidade(),
                        request.getObservacao()
                );

        MovimentacaoEstoqueResponse response =
                new MovimentacaoEstoqueResponse(movimentacao);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Registra uma saída de produtos do estoque.
    @PostMapping("/saida")
    public ResponseEntity<MovimentacaoEstoqueResponse> registrarSaida(
            @Valid @RequestBody MovimentacaoEstoqueRequest request) {

        MovimentacaoEstoque movimentacao =
                movimentacaoService.registrarSaida(
                        request.getProdutoId(),
                        request.getQuantidade(),
                        request.getObservacao()
                );

        MovimentacaoEstoqueResponse response =
                new MovimentacaoEstoqueResponse(movimentacao);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Lista todas as movimentações, da mais recente para a mais antiga.
    @GetMapping
    public ResponseEntity<List<MovimentacaoEstoqueResponse>> listarMovimentacoes() {

        List<MovimentacaoEstoqueResponse> movimentacoes =
                movimentacaoService.listarMovimentacoes()
                        .stream()
                        .map(MovimentacaoEstoqueResponse::new)
                        .toList();

        return ResponseEntity.ok(movimentacoes);
    }

    // Consulta o histórico de movimentações de um produto.
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<MovimentacaoEstoqueResponse>>
            listarMovimentacoesPorProduto(
                    @PathVariable Long produtoId) {

        List<MovimentacaoEstoqueResponse> movimentacoes =
                movimentacaoService.listarMovimentacoesPorProduto(produtoId)
                        .stream()
                        .map(MovimentacaoEstoqueResponse::new)
                        .toList();

        return ResponseEntity.ok(movimentacoes);
    }

    // Filtra o histórico pelo tipo de movimentação.
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<MovimentacaoEstoqueResponse>>
            listarMovimentacoesPorTipo(
                    @PathVariable TipoMovimentacao tipo) {

        List<MovimentacaoEstoqueResponse> movimentacoes =
                movimentacaoService.listarMovimentacoesPorTipo(tipo)
                        .stream()
                        .map(MovimentacaoEstoqueResponse::new)
                        .toList();

        return ResponseEntity.ok(movimentacoes);
    }
}
