
package com.stockflow.backend.repository;

import com.stockflow.backend.model.ProdutoFornecedor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoFornecedorRepository
        extends JpaRepository<ProdutoFornecedor, Long> {

    boolean existsByProdutoIdAndFornecedorId(
            Long produtoId,
            Long fornecedorId
    );

    List<ProdutoFornecedor> findByProdutoId(Long produtoId);

    List<ProdutoFornecedor> findByFornecedorId(Long fornecedorId);
}
