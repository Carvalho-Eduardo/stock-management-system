
package com.stockflow.backend.repository;

import com.stockflow.backend.model.Produto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Verifica se já existe um produto com determinado SKU.
    boolean existsBySku(String sku);

    // Verifica se outro produto utiliza o mesmo SKU.
    boolean existsBySkuAndIdNot(String sku, Long id);

    // Busca produtos pelo nome ou SKU.
    List<Produto> findByNomeContainingIgnoreCaseOrSkuContainingIgnoreCase(
            String nome,
            String sku
    );

    // Verifica se uma categoria possui produtos associados.
    boolean existsByCategoriaId(Long categoriaId);
}
