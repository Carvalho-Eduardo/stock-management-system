
package com.stockflow.backend.repository;

import com.stockflow.backend.model.MovimentacaoEstoque;
import com.stockflow.backend.model.TipoMovimentacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository
        extends JpaRepository<MovimentacaoEstoque, Long> {

    // Lista todas as movimentações da mais recente para a mais antiga.
    List<MovimentacaoEstoque> findAllByOrderByDataHoraDesc();

    // Lista o histórico de movimentações de um produto.
    List<MovimentacaoEstoque> findByProdutoIdOrderByDataHoraDesc(Long produtoId);

    // Lista movimentações filtradas pelo tipo.
    List<MovimentacaoEstoque> findByTipoOrderByDataHoraDesc(TipoMovimentacao tipo);

    // Verifica se um produto possui movimentações registradas.
    boolean existsByProdutoId(Long produtoId);
}
