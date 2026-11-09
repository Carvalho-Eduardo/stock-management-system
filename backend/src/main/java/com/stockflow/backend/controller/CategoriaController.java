
package com.stockflow.backend.controller;

import com.stockflow.backend.model.Categoria;
import com.stockflow.backend.service.CategoriaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // Lista todas as categorias.
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {

        return ResponseEntity.ok(
                categoriaService.listarCategorias()
        );
    }

    // Busca uma categoria pelo ID.
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarCategoria(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                categoriaService.buscarCategoriaPorId(id)
        );
    }

    // Cadastra uma nova categoria.
    @PostMapping
    public ResponseEntity<Categoria> cadastrarCategoria(
            @Valid @RequestBody Categoria categoria) {

        Categoria categoriaSalva =
                categoriaService.cadastrarCategoria(categoria);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoriaSalva);
    }

    // Atualiza uma categoria existente.
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody Categoria categoria) {

        Categoria categoriaAtualizada =
                categoriaService.atualizarCategoria(id, categoria);

        return ResponseEntity.ok(categoriaAtualizada);
    }

    // Exclui uma categoria.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCategoria(
            @PathVariable Long id) {

        categoriaService.excluirCategoria(id);

        return ResponseEntity.noContent().build();
    }
}
