
package com.stockflow.backend.service;

import com.stockflow.backend.model.Categoria;
import com.stockflow.backend.model.Produto;

import com.stockflow.backend.repository.CategoriaRepository;
import com.stockflow.backend.repository.ItemCompraRepository;
import com.stockflow.backend.repository.MovimentacaoEstoqueRepository;
import com.stockflow.backend.repository.ProdutoFornecedorRepository;
import com.stockflow.backend.repository.ProdutoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoRepository;
    private final ItemCompraRepository itemCompraRepository;
    private final ProdutoFornecedorRepository produtoFornecedorRepository;
    private final AuditoriaService auditoriaService;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository,
            MovimentacaoEstoqueRepository movimentacaoRepository,
            ItemCompraRepository itemCompraRepository,
            ProdutoFornecedorRepository produtoFornecedorRepository,
            AuditoriaService auditoriaService
    ) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.itemCompraRepository = itemCompraRepository;
        this.produtoFornecedorRepository = produtoFornecedorRepository;
        this.auditoriaService = auditoriaService;
    }

    @Transactional(readOnly = true)
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Produto buscarProdutoPorId(Long id) {

        return produtoRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Produto não encontrado com ID: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public List<Produto> buscarProdutos(String termo) {

        if (termo == null || termo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe um nome ou SKU para realizar a busca."
            );
        }

        String pesquisa = termo.trim();

        return produtoRepository
                .findByNomeContainingIgnoreCaseOrSkuContainingIgnoreCase(
                        pesquisa,
                        pesquisa
                );
    }

    private Categoria buscarCategoria(Long categoriaId) {

        if (categoriaId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A categoria do produto é obrigatória."
            );
        }

        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria não encontrada com ID: " + categoriaId
                        )
                );
    }

    @Transactional
    public Produto cadastrarProduto(Produto produto) {

        if (produto.getQuantidadeEstoque() == null
                || produto.getQuantidadeEstoque() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A quantidade em estoque deve ser informada e não pode ser negativa."
            );
        }

        if (produtoRepository.existsBySku(produto.getSku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Já existe um produto cadastrado com este SKU."
            );
        }

        Long categoriaId = produto.getCategoria() == null
                ? null
                : produto.getCategoria().getId();

        Categoria categoria = buscarCategoria(categoriaId);

        produto.setCategoria(categoria);

        Produto produtoSalvo = produtoRepository.save(produto);

        auditoriaService.registrar(
                "CADASTRO",
                "PRODUTOS",
                produtoSalvo.getId(),
                "Produto " + produtoSalvo.getNome()
                        + " (SKU: " + produtoSalvo.getSku()
                        + ") cadastrado."
        );

        return produtoSalvo;
    }

    @Transactional
    public Produto atualizarProduto(Long id, Produto dadosAtualizados) {

        Produto produtoExistente = buscarProdutoPorId(id);

        boolean skuEmUso = produtoRepository.existsBySkuAndIdNot(
                dadosAtualizados.getSku(),
                id
        );

        if (skuEmUso) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Outro produto já utiliza este SKU."
            );
        }

        Long categoriaId = dadosAtualizados.getCategoria() == null
                ? null
                : dadosAtualizados.getCategoria().getId();

        Categoria categoria = buscarCategoria(categoriaId);

        String nomeAnterior = produtoExistente.getNome();
        String skuAnterior = produtoExistente.getSku();

        produtoExistente.setNome(dadosAtualizados.getNome());
        produtoExistente.setDescricao(dadosAtualizados.getDescricao());
        produtoExistente.setSku(dadosAtualizados.getSku());
        produtoExistente.setPreco(dadosAtualizados.getPreco());

        // O estoque existente é preservado.
        // Somente as movimentações podem alterá-lo.

        produtoExistente.setEstoqueMinimo(
                dadosAtualizados.getEstoqueMinimo()
        );

        produtoExistente.setCategoria(categoria);

        Produto produtoAtualizado = produtoRepository.save(produtoExistente);

        auditoriaService.registrar(
                "EDICAO",
                "PRODUTOS",
                produtoAtualizado.getId(),
                "Produto alterado: "
                        + nomeAnterior + " (SKU: " + skuAnterior + ")"
                        + " para "
                        + produtoAtualizado.getNome()
                        + " (SKU: " + produtoAtualizado.getSku() + ")."
        );

        return produtoAtualizado;
    }

    @Transactional
    public void excluirProduto(Long id) {

        Produto produto = buscarProdutoPorId(id);

        if (movimentacaoRepository.existsByProdutoId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este produto porque existem movimentações de estoque registradas."
            );
        }

        if (itemCompraRepository.existsByProdutoId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este produto porque ele está vinculado ao histórico de compras."
            );
        }

        if (produtoFornecedorRepository.existsByProdutoId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este produto porque existem fornecedores vinculados a ele."
            );
        }

        String nomeProduto = produto.getNome();
        String skuProduto = produto.getSku();

        produtoRepository.delete(produto);

        auditoriaService.registrar(
                "EXCLUSAO",
                "PRODUTOS",
                id,
                "Produto " + nomeProduto
                        + " (SKU: " + skuProduto + ") excluído."
        );
    }
}
