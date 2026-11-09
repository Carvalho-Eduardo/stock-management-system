
package com.stockflow.backend.service;

import com.stockflow.backend.model.Categoria;
import com.stockflow.backend.repository.CategoriaRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(
            CategoriaRepository categoriaRepository,
            ProdutoRepository produtoRepository) {

        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    // Lista todas as categorias cadastradas.
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // Busca uma categoria pelo ID.
    public Categoria buscarCategoriaPorId(Long id) {

        return categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria não encontrada com ID: " + id
                        )
                );
    }

    // Cadastra uma nova categoria.
    public Categoria cadastrarCategoria(Categoria categoria) {

        String nome = categoria.getNome().trim();

        if (categoriaRepository.existsByNomeIgnoreCase(nome)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma categoria com este nome."
            );
        }

        categoria.setNome(nome);

        return categoriaRepository.save(categoria);
    }

    // Atualiza uma categoria existente.
    public Categoria atualizarCategoria(
            Long id,
            Categoria dadosAtualizados) {

        Categoria categoriaExistente = buscarCategoriaPorId(id);

        String nome = dadosAtualizados.getNome().trim();

        boolean nomeEmUso = categoriaRepository
                .existsByNomeIgnoreCaseAndIdNot(nome, id);

        if (nomeEmUso) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Outra categoria já utiliza este nome."
            );
        }

        categoriaExistente.setNome(nome);
        categoriaExistente.setDescricao(
                dadosAtualizados.getDescricao()
        );

        return categoriaRepository.save(categoriaExistente);
    }

    // Exclui uma categoria somente se ela não possuir produtos.
    public void excluirCategoria(Long id) {

        Categoria categoria = buscarCategoriaPorId(id);

        boolean possuiProdutos =
                produtoRepository.existsByCategoriaId(id);

        if (possuiProdutos) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir uma categoria que possui produtos associados."
            );
        }

        categoriaRepository.delete(categoria);
    }
}
