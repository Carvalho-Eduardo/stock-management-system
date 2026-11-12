
package com.stockflow.backend.service;

import com.stockflow.backend.model.Categoria;
import com.stockflow.backend.repository.CategoriaRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;
    private final AuditoriaService auditoriaService;

    public CategoriaService(
            CategoriaRepository categoriaRepository,
            ProdutoRepository produtoRepository,
            AuditoriaService auditoriaService
    ) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Categoria buscarCategoriaPorId(Long id) {

        return categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria não encontrada com ID: " + id
                        )
                );
    }

    @Transactional
    public Categoria cadastrarCategoria(Categoria categoria) {

        String nome = categoria.getNome().trim();

        if (categoriaRepository.existsByNomeIgnoreCase(nome)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe uma categoria com este nome."
            );
        }

        categoria.setNome(nome);

        Categoria categoriaSalva = categoriaRepository.save(categoria);

        auditoriaService.registrar(
                "CADASTRO",
                "CATEGORIAS",
                categoriaSalva.getId(),
                "Categoria " + categoriaSalva.getNome() + " cadastrada."
        );

        return categoriaSalva;
    }

    @Transactional
    public Categoria atualizarCategoria(
            Long id,
            Categoria dadosAtualizados
    ) {

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

        String nomeAnterior = categoriaExistente.getNome();

        categoriaExistente.setNome(nome);
        categoriaExistente.setDescricao(
                dadosAtualizados.getDescricao()
        );

        Categoria categoriaAtualizada =
                categoriaRepository.save(categoriaExistente);

        auditoriaService.registrar(
                "EDICAO",
                "CATEGORIAS",
                categoriaAtualizada.getId(),
                "Categoria alterada de "
                        + nomeAnterior
                        + " para "
                        + categoriaAtualizada.getNome()
                        + "."
        );

        return categoriaAtualizada;
    }

    @Transactional
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

        String nomeCategoria = categoria.getNome();

        categoriaRepository.delete(categoria);

        auditoriaService.registrar(
                "EXCLUSAO",
                "CATEGORIAS",
                id,
                "Categoria " + nomeCategoria + " excluída."
        );
    }
}
