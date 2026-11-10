
package com.stockflow.backend.repository;

import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.TipoMovimentacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository
        extends JpaRepository<MovimentacaoEstoque, Long> {

    List<MovimentacaoEstoque> findAllByOrderByDataHoraDesc();

    List<MovimentacaoEstoque> findByProdutoIdOrderByDataHoraDesc(Long produtoId);

    List<MovimentacaoEstoque> findByTipoOrderByDataHoraDesc(TipoMovimentacao tipo);

    boolean existsByProdutoId(Long produtoId);

    long countByTipo(TipoMovimentacao tipo);

    List<MovimentacaoEstoque> findTop10ByOrderByDataHoraDesc();
}
