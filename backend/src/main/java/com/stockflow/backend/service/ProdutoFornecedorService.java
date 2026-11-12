
package com.stockflow.backend.service;

import com.stockflow.backend.dto.ProdutoFornecedorRequest;
import com.stockflow.backend.dto.ProdutoFornecedorResponse;
import com.stockflow.backend.model.Fornecedor;
import com.stockflow.backend.model.Produto;
import com.stockflow.backend.model.ProdutoFornecedor;
import com.stockflow.backend.repository.FornecedorRepository;
import com.stockflow.backend.repository.ProdutoFornecedorRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoFornecedorService {

    private final ProdutoFornecedorRepository vinculoRepository;
    private final ProdutoRepository produtoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final AuditoriaService auditoriaService;

    public ProdutoFornecedorService(
            ProdutoFornecedorRepository vinculoRepository,
            ProdutoRepository produtoRepository,
            FornecedorRepository fornecedorRepository,
            AuditoriaService auditoriaService
    ) {
        this.vinculoRepository = vinculoRepository;
        this.produtoRepository = produtoRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public ProdutoFornecedorResponse cadastrar(
            ProdutoFornecedorRequest request
    ) {

        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Produto não encontrado."
                ));

        Fornecedor fornecedor = fornecedorRepository.findById(
                request.getFornecedorId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Fornecedor não encontrado."
        ));

        boolean vinculoExiste =
                vinculoRepository.existsByProdutoIdAndFornecedorId(
                        produto.getId(),
                        fornecedor.getId()
                );

        if (vinculoExiste) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este produto já está vinculado a este fornecedor."
            );
        }

        ProdutoFornecedor vinculo = new ProdutoFornecedor();

        vinculo.setProduto(produto);
        vinculo.setFornecedor(fornecedor);

        ProdutoFornecedor salvo = vinculoRepository.save(vinculo);

        auditoriaService.registrar(
                "VINCULO",
                "PRODUTOS_FORNECEDORES",
                salvo.getId(),
                "Produto " + produto.getNome()
                        + " vinculado ao fornecedor "
                        + fornecedor.getNome() + "."
        );

        return new ProdutoFornecedorResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<ProdutoFornecedorResponse> listarTodos() {
        return vinculoRepository.findAll()
                .stream()
                .map(ProdutoFornecedorResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProdutoFornecedorResponse> buscarPorProduto(
            Long produtoId
    ) {

        if (!produtoRepository.existsById(produtoId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produto não encontrado."
            );
        }

        return vinculoRepository.findByProdutoId(produtoId)
                .stream()
                .map(ProdutoFornecedorResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProdutoFornecedorResponse> buscarPorFornecedor(
            Long fornecedorId
    ) {

        if (!fornecedorRepository.existsById(fornecedorId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Fornecedor não encontrado."
            );
        }

        return vinculoRepository.findByFornecedorId(fornecedorId)
                .stream()
                .map(ProdutoFornecedorResponse::new)
                .toList();
    }

    @Transactional
    public void remover(Long id) {

        ProdutoFornecedor vinculo = vinculoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Vínculo entre produto e fornecedor não encontrado."
                ));

        String nomeProduto = vinculo.getProduto().getNome();
        String nomeFornecedor = vinculo.getFornecedor().getNome();

        vinculoRepository.delete(vinculo);

        auditoriaService.registrar(
                "DESVINCULO",
                "PRODUTOS_FORNECEDORES",
                id,
                "Produto " + nomeProduto
                        + " desvinculado do fornecedor "
                        + nomeFornecedor + "."
        );
    }
}
