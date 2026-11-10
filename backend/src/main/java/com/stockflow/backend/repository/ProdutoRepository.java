
package com.stockflow.backend.repository;

import com.stockflow.backend.model.Produto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<Produto> findByNomeContainingIgnoreCaseOrSkuContainingIgnoreCase(
            String nome,
            String sku
    );

    boolean existsByCategoriaId(Long categoriaId);

    // Bloqueia o produto durante a operação de estoque.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Produto p WHERE p.id = :id")
    Optional<Produto> buscarPorIdComBloqueio(@Param("id") Long id);

}
