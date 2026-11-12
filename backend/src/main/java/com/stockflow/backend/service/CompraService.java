
package com.stockflow.backend.service;

import com.stockflow.backend.dto.CompraRequest;
import com.stockflow.backend.dto.CompraResponse;
import com.stockflow.backend.dto.ItemCompraRequest;
import com.stockflow.backend.model.Compra;
import com.stockflow.backend.model.Fornecedor;
import com.stockflow.backend.model.ItemCompra;
import com.stockflow.backend.model.Produto;
import com.stockflow.backend.model.StatusCompra;
import com.stockflow.backend.repository.CompraRepository;
import com.stockflow.backend.repository.FornecedorRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final AuditoriaService auditoriaService;

    public CompraService(
            CompraRepository compraRepository,
            FornecedorRepository fornecedorRepository,
            ProdutoRepository produtoRepository,
            MovimentacaoEstoqueService movimentacaoEstoqueService,
            AuditoriaService auditoriaService
    ) {
        this.compraRepository = compraRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.produtoRepository = produtoRepository;
        this.movimentacaoEstoqueService = movimentacaoEstoqueService;
        this.auditoriaService = auditoriaService;
    }

    @Transactional
    public CompraResponse cadastrar(CompraRequest request) {

        Fornecedor fornecedor = fornecedorRepository.findById(request.getFornecedorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Fornecedor não encontrado."
                ));

        Compra compra = new Compra();
        compra.setFornecedor(fornecedor);
        compra.setStatus(StatusCompra.PENDENTE);
        compra.setObservacao(normalizarTexto(request.getObservacao()));
        compra.setItens(new ArrayList<>());

        Set<Long> produtosAdicionados = new HashSet<>();
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemCompraRequest itemRequest : request.getItens()) {

            if (!produtosAdicionados.add(itemRequest.getProdutoId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Não é permitido adicionar o mesmo produto mais de uma vez na compra."
                );
            }

            Produto produto = produtoRepository.findById(itemRequest.getProdutoId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Produto não encontrado: " + itemRequest.getProdutoId()
                    ));

            BigDecimal subtotal = itemRequest.getPrecoUnitario()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantidade()));

            ItemCompra item = new ItemCompra();
            item.setCompra(compra);
            item.setProduto(produto);
            item.setQuantidade(itemRequest.getQuantidade());
            item.setPrecoUnitario(itemRequest.getPrecoUnitario());
            item.setSubtotal(subtotal);

            compra.getItens().add(item);

            valorTotal = valorTotal.add(subtotal);
        }

        compra.setValorTotal(valorTotal);

        Compra compraSalva = compraRepository.save(compra);

        auditoriaService.registrar(
                "CADASTRO",
                "COMPRAS",
                compraSalva.getId(),
                "Compra #" + compraSalva.getId()
                        + " cadastrada para o fornecedor "
                        + fornecedor.getNome()
                        + ". Valor total: R$ "
                        + valorTotal.toPlainString()
        );

        return new CompraResponse(compraSalva);
    }

    @Transactional(readOnly = true)
    public List<CompraResponse> listarTodas() {
        return compraRepository.findAllByOrderByDataCadastroDesc()
                .stream()
                .map(CompraResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompraResponse buscarPorId(Long id) {
        Compra compra = encontrarCompra(id);
        return new CompraResponse(compra);
    }

    @Transactional
    public CompraResponse receber(Long id) {

        Compra compra = compraRepository.buscarPorIdComBloqueio(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Compra não encontrada."
                ));

        if (compra.getStatus() != StatusCompra.PENDENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Somente compras pendentes podem ser recebidas."
            );
        }

        for (ItemCompra item : compra.getItens()) {

            String observacao = "Recebimento da compra #" + compra.getId()
                    + " - Fornecedor: " + compra.getFornecedor().getNome();

            movimentacaoEstoqueService.registrarEntrada(
                    item.getProduto().getId(),
                    item.getQuantidade(),
                    observacao
            );
        }

        compra.setStatus(StatusCompra.RECEBIDA);
        compra.setDataRecebimento(LocalDateTime.now());

        Compra compraAtualizada = compraRepository.save(compra);

        auditoriaService.registrar(
                "RECEBIMENTO",
                "COMPRAS",
                compraAtualizada.getId(),
                "Compra #" + compraAtualizada.getId()
                        + " recebida. Fornecedor: "
                        + compra.getFornecedor().getNome()
                        + ". Estoque atualizado para os "
                        + compra.getItens().size()
                        + " item(ns) da compra."
        );

        return new CompraResponse(compraAtualizada);
    }

    @Transactional
    public CompraResponse cancelar(Long id) {

        Compra compra = encontrarCompra(id);

        if (compra.getStatus() != StatusCompra.PENDENTE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Somente compras pendentes podem ser canceladas."
            );
        }

        compra.setStatus(StatusCompra.CANCELADA);

        Compra compraAtualizada = compraRepository.save(compra);

        auditoriaService.registrar(
                "CANCELAMENTO",
                "COMPRAS",
                compraAtualizada.getId(),
                "Compra #" + compraAtualizada.getId()
                        + " cancelada. Fornecedor: "
                        + compra.getFornecedor().getNome()
        );

        return new CompraResponse(compraAtualizada);
    }

    private Compra encontrarCompra(Long id) {
        return compraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Compra não encontrada."
                ));
    }

    private String normalizarTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}
