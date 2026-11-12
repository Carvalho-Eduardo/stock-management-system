
package com.stockflow.backend.service;

import com.stockflow.backend.dto.FornecedorRequest;
import com.stockflow.backend.dto.FornecedorResponse;
import com.stockflow.backend.model.Fornecedor;
import com.stockflow.backend.repository.CompraRepository;
import com.stockflow.backend.repository.FornecedorRepository;
import com.stockflow.backend.repository.ProdutoFornecedorRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final CompraRepository compraRepository;
    private final ProdutoFornecedorRepository produtoFornecedorRepository;
    private final AuditoriaService auditoriaService;

    public FornecedorService(
            FornecedorRepository fornecedorRepository,
            CompraRepository compraRepository,
            ProdutoFornecedorRepository produtoFornecedorRepository,
            AuditoriaService auditoriaService
    ) {
        this.fornecedorRepository = fornecedorRepository;
        this.compraRepository = compraRepository;
        this.produtoFornecedorRepository = produtoFornecedorRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public FornecedorResponse cadastrar(FornecedorRequest request) {

        String cnpj = normalizarCnpj(request.getCnpj());

        if (cnpj != null && fornecedorRepository.existsByCnpj(cnpj)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um fornecedor cadastrado com este CNPJ."
            );
        }

        Fornecedor fornecedor = new Fornecedor();

        atualizarDados(fornecedor, request, cnpj);

        Fornecedor fornecedorSalvo = fornecedorRepository.save(fornecedor);

        auditoriaService.registrar(
                "CADASTRO",
                "FORNECEDORES",
                fornecedorSalvo.getId(),
                "Fornecedor " + fornecedorSalvo.getNome() + " cadastrado."
        );

        return new FornecedorResponse(fornecedorSalvo);
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> listarTodos() {

        return fornecedorRepository.findAll()
                .stream()
                .map(FornecedorResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FornecedorResponse> buscar(String termo) {

        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }

        String pesquisa = termo.trim();

        return fornecedorRepository
                .findByNomeContainingIgnoreCaseOrCnpjContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        pesquisa,
                        pesquisa,
                        pesquisa
                )
                .stream()
                .map(FornecedorResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public FornecedorResponse buscarPorId(Long id) {

        Fornecedor fornecedor = encontrarFornecedor(id);

        return new FornecedorResponse(fornecedor);
    }

    @Transactional
    public FornecedorResponse atualizar(Long id, FornecedorRequest request) {

        Fornecedor fornecedor = encontrarFornecedor(id);

        String cnpj = normalizarCnpj(request.getCnpj());

        if (
                cnpj != null &&
                fornecedorRepository.existsByCnpjAndIdNot(cnpj, id)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este CNPJ já está cadastrado em outro fornecedor."
            );
        }

        String nomeAnterior = fornecedor.getNome();

        atualizarDados(fornecedor, request, cnpj);

        Fornecedor fornecedorAtualizado =
                fornecedorRepository.save(fornecedor);

        auditoriaService.registrar(
                "EDICAO",
                "FORNECEDORES",
                fornecedorAtualizado.getId(),
                "Fornecedor alterado de "
                        + nomeAnterior
                        + " para "
                        + fornecedorAtualizado.getNome()
                        + "."
        );

        return new FornecedorResponse(fornecedorAtualizado);
    }

    @Transactional
    public void excluir(Long id) {

        Fornecedor fornecedor = encontrarFornecedor(id);

        if (compraRepository.existsByFornecedorId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este fornecedor porque existem compras vinculadas a ele."
            );
        }

        if (produtoFornecedorRepository.existsByFornecedorId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este fornecedor porque existem produtos vinculados a ele."
            );
        }

        String nomeFornecedor = fornecedor.getNome();

        fornecedorRepository.delete(fornecedor);

        auditoriaService.registrar(
                "EXCLUSAO",
                "FORNECEDORES",
                id,
                "Fornecedor " + nomeFornecedor + " excluído."
        );
    }

    private Fornecedor encontrarFornecedor(Long id) {

        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Fornecedor não encontrado."
                ));
    }

    private void atualizarDados(
            Fornecedor fornecedor,
            FornecedorRequest request,
            String cnpj
    ) {

        fornecedor.setNome(request.getNome().trim());
        fornecedor.setCnpj(cnpj);
        fornecedor.setEmail(normalizarTexto(request.getEmail()));
        fornecedor.setTelefone(normalizarTexto(request.getTelefone()));
        fornecedor.setEndereco(normalizarTexto(request.getEndereco()));
    }

    private String normalizarCnpj(String cnpj) {

        if (cnpj == null || cnpj.isBlank()) {
            return null;
        }

        return cnpj.trim();
    }

    private String normalizarTexto(String texto) {

        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}
