
package com.stockflow.backend.repository;

import com.stockflow.backend.model.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Verifica se já existe uma categoria com determinado nome.
    boolean existsByNomeIgnoreCase(String nome);

    // Verifica se outra categoria utiliza o mesmo nome.
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);

    // Busca uma categoria pelo nome, ignorando maiúsculas e minúsculas.
    Optional<Categoria> findByNomeIgnoreCase(String nome);
}
