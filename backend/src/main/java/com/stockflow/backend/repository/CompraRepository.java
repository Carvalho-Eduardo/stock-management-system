
package com.stockflow.backend.repository;

import com.stockflow.backend.model.Compra;
import com.stockflow.backend.model.StatusCompra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    List<Compra> findAllByOrderByDataCadastroDesc();

    long countByStatus(StatusCompra status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Compra c WHERE c.id = :id")
    Optional<Compra> buscarPorIdComBloqueio(@Param("id") Long id);
}
