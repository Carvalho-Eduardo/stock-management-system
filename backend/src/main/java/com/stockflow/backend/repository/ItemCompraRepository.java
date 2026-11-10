package com.stockflow.backend.repository;

import com.stockflow.backend.model.ItemCompra;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCompraRepository extends JpaRepository<ItemCompra, Long> {

    boolean existsByProdutoId(Long produtoId);

}
