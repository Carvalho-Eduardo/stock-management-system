
package com.stockflow.backend.repository;

import com.stockflow.backend.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    boolean existsByCnpj(String cnpj);

    boolean existsByCnpjAndIdNot(String cnpj, Long id);

    List<Fornecedor> findByNomeContainingIgnoreCaseOrCnpjContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nome,
            String cnpj,
            String email
    );
}
