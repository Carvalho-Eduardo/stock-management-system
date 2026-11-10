
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.CompraRequest;
import com.stockflow.backend.dto.CompraResponse;
import com.stockflow.backend.service.CompraService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @PostMapping
    public ResponseEntity<CompraResponse> cadastrar(
            @Valid @RequestBody CompraRequest request
    ) {
        CompraResponse compra = compraService.cadastrar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(compra);
    }

    @GetMapping
    public ResponseEntity<List<CompraResponse>> listarTodas() {
        return ResponseEntity.ok(compraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.buscarPorId(id));
    }

    @PostMapping("/{id}/receber")
    public ResponseEntity<CompraResponse> receber(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.receber(id));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<CompraResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(compraService.cancelar(id));
    }
}
