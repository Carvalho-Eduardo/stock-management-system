import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  CircleDollarSign,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

import api from "../../services/api";

const formularioInicial = {
  nome: "",
  descricao: "",
  sku: "",
  preco: "",
  quantidadeEstoque: "0",
  estoqueMinimo: "0",
  categoriaId: "",
};

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function obterStatus(produto) {
  const quantidade = Number(produto.quantidadeEstoque || 0);
  const minimo = Number(produto.estoqueMinimo || 0);

  if (quantidade === 0) return "Esgotado";
  if (quantidade <= minimo) return "Baixo";
  return "Normal";
}

function mensagemErro(error) {
  const dados = error?.response?.data;

  if (typeof dados === "string" && dados.trim()) {
    return dados;
  }

  return (
    dados?.message ||
    dados?.detail ||
    dados?.error ||
    "Não foi possível concluir a operação. Tente novamente."
  );
}

function Indicador({ titulo, valor, detalhe, icone: Icone, cor }) {
  void Icone;
  return (
    <article className="rounded-[18px] bg-[#19191D] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#9999A1]">{titulo}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {valor}
          </p>
          <p className="mt-1 text-[10px] text-[#77777F]">{detalhe}</p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${cor}18`, color: cor }}
        >
          <Icone size={19} strokeWidth={1.8} />
        </div>
      </div>
    </article>
  );
}

function ModalProduto({
  aberto,
  produto,
  categorias,
  salvando,
  erro,
  onFechar,
  onSalvar,
}) {
  const [formulario, setFormulario] = useState(formularioInicial);

  const editando = Boolean(produto);

  useEffect(() => {
    if (!aberto) return;

    if (produto) {
      setFormulario({
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        sku: produto.sku || "",
        preco: String(produto.preco ?? ""),
        quantidadeEstoque: String(produto.quantidadeEstoque ?? 0),
        estoqueMinimo: String(produto.estoqueMinimo ?? 0),
        categoriaId: String(produto.categoria?.id ?? ""),
      });
    } else {
      setFormulario({
        ...formularioInicial,
        categoriaId: categorias.length ? String(categorias[0].id) : "",
      });
    }
  }, [aberto, produto, categorias]);

  if (!aberto) return null;

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function enviarFormulario(event) {
    event.preventDefault();

    const dados = {
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      sku: formulario.sku.trim(),
      preco: Number(formulario.preco),
      estoqueMinimo: Number(formulario.estoqueMinimo),
      categoria: {
        id: Number(formulario.categoriaId),
      },
    };

    // A quantidade só é enviada no cadastro.
    // Alterações de estoque são feitas pelas movimentações.
    if (!editando) {
      dados.quantidadeEstoque = Number(formulario.quantidadeEstoque);
    }

    onSalvar(dados);
  }

  const campoClasse =
    "mt-2 w-full rounded-xl border border-white/[0.08] bg-[#101D2D] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-[#666670] focus:border-[#A9BFFF]/60";

  const labelClasse = "text-xs font-medium text-[#C9C9D0]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !salvando) {
          onFechar();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-produto"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#19191D] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9BFFF]">
              Gestão de estoque
            </p>

            <h2
              id="titulo-modal-produto"
              className="mt-1 text-lg font-semibold text-white"
            >
              {editando ? "Editar produto" : "Novo produto"}
            </h2>

            <p className="mt-1 text-xs text-[#88888F]">
              {editando
                ? "Atualize as informações do produto."
                : "Preencha os dados para cadastrar um produto."}
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9999A1] transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        <form onSubmit={enviarFormulario}>
          <div className="grid grid-cols-1 gap-4 px-5 py-6 sm:grid-cols-2 sm:px-7">
            <div className="sm:col-span-2">
              <label className={labelClasse} htmlFor="produto-nome">
                Nome do produto *
              </label>
              <input
                id="produto-nome"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                required
                maxLength={150}
                placeholder="Ex.: Notebook Dell Inspiron"
                className={campoClasse}
              />
            </div>

            <div>
              <label className={labelClasse} htmlFor="produto-sku">
                Código SKU *
              </label>
              <input
                id="produto-sku"
                name="sku"
                value={formulario.sku}
                onChange={atualizarCampo}
                required
                maxLength={50}
                placeholder="Ex.: PRD-001"
                className={campoClasse}
              />
            </div>

            <div>
              <label className={labelClasse} htmlFor="produto-categoria">
                Categoria *
              </label>
              <div className="relative">
                <select
                  id="produto-categoria"
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={atualizarCampo}
                  required
                  className={`${campoClasse} appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-[#88888F]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClasse} htmlFor="produto-descricao">
                Descrição
              </label>
              <textarea
                id="produto-descricao"
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                maxLength={500}
                rows={3}
                placeholder="Descrição opcional do produto..."
                className={`${campoClasse} resize-y`}
              />
            </div>

            <div>
              <label className={labelClasse} htmlFor="produto-preco">
                Preço unitário (R$) *
              </label>
              <input
                id="produto-preco"
                name="preco"
                type="number"
                value={formulario.preco}
                onChange={atualizarCampo}
                min="0.01"
                step="0.01"
                required
                placeholder="0,00"
                className={campoClasse}
              />
            </div>

            <div>
              <label className={labelClasse} htmlFor="produto-minimo">
                Estoque mínimo *
              </label>
              <input
                id="produto-minimo"
                name="estoqueMinimo"
                type="number"
                value={formulario.estoqueMinimo}
                onChange={atualizarCampo}
                min="0"
                step="1"
                required
                placeholder="0"
                className={campoClasse}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClasse} htmlFor="produto-quantidade">
                {editando ? "Quantidade atual em estoque" : "Estoque inicial *"}
              </label>

              <input
                id="produto-quantidade"
                name="quantidadeEstoque"
                type="number"
                value={formulario.quantidadeEstoque}
                onChange={atualizarCampo}
                min="0"
                step="1"
                required={!editando}
                readOnly={editando}
                className={`${campoClasse} ${
                  editando ? "cursor-not-allowed opacity-60" : ""
                }`}
              />

              {editando && (
                <p className="mt-2 text-[10px] leading-5 text-[#9999A1]">
                  A quantidade não pode ser alterada na edição. Utilize o módulo
                  de movimentações para registrar entradas e saídas.
                </p>
              )}
            </div>

            {erro && (
              <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-xs leading-5 text-red-300 sm:col-span-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{erro}</span>
              </div>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.06] bg-[#101D2D]/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="rounded-xl border border-white/[0.08] px-5 py-3 text-xs font-medium text-[#B0B0B7] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando || !categorias.length}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-xs font-semibold text-[#09090D] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {editando ? "Salvar alterações" : "Cadastrar produto"}
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function ModalExclusao({ produto, excluindo, erro, onFechar, onConfirmar }) {
  if (!produto) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md rounded-[22px] border border-white/[0.08] bg-[#19191D] p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
          <Trash2 size={21} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Excluir produto?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
          Você está prestes a excluir{" "}
          <span className="font-semibold text-white">{produto.nome}</span>. Essa
          ação não poderá ser desfeita.
        </p>

        {erro && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-xs leading-5 text-red-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onFechar}
            disabled={excluindo}
            className="rounded-xl border border-white/[0.08] px-4 py-3 text-xs font-medium text-[#B0B0B7] transition hover:bg-white/[0.05]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={excluindo}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-400 px-4 py-3 text-xs font-semibold text-[#190909] transition hover:bg-red-300 disabled:opacity-60"
          >
            {excluindo ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {excluindo ? "Excluindo..." : "Excluir produto"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstoque, setFiltroEstoque] = useState("todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroFormulario, setErroFormulario] = useState("");

  const [produtoExcluindo, setProdutoExcluindo] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState("");

  const [notificacao, setNotificacao] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErroCarregamento("");

    try {
      const [respostaProdutos, respostaCategorias] = await Promise.all([
        api.get("/produtos"),
        api.get("/categorias"),
      ]);

      setProdutos(
        Array.isArray(respostaProdutos.data) ? respostaProdutos.data : [],
      );

      setCategorias(
        Array.isArray(respostaCategorias.data) ? respostaCategorias.data : [],
      );
    } catch (error) {
      setErroCarregamento(
        error.response?.status === 401
          ? "Sua sessão não está autenticada. Entre no sistema para consultar os produtos."
          : error.response?.status === 403
            ? "Seu usuário não possui permissão para consultar esses dados."
            : mensagemErro(error),
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const correspondeBusca =
        !termo ||
        produto.nome?.toLowerCase().includes(termo) ||
        produto.sku?.toLowerCase().includes(termo);

      const correspondeCategoria =
        filtroCategoria === "todas" ||
        String(produto.categoria?.id) === filtroCategoria;

      const status = obterStatus(produto);

      const correspondeEstoque =
        filtroEstoque === "todos" ||
        (filtroEstoque === "baixo" && status === "Baixo") ||
        (filtroEstoque === "esgotado" && status === "Esgotado") ||
        (filtroEstoque === "normal" && status === "Normal");

      return correspondeBusca && correspondeCategoria && correspondeEstoque;
    });
  }, [produtos, busca, filtroCategoria, filtroEstoque]);

  const indicadores = useMemo(() => {
    const estoqueBaixo = produtos.filter(
      (produto) => obterStatus(produto) === "Baixo",
    ).length;

    const estoqueEsgotado = produtos.filter(
      (produto) => obterStatus(produto) === "Esgotado",
    ).length;

    const valorTotal = produtos.reduce(
      (total, produto) =>
        total +
        Number(produto.preco || 0) * Number(produto.quantidadeEstoque || 0),
      0,
    );

    return {
      total: produtos.length,
      estoqueBaixo,
      estoqueEsgotado,
      valorTotal,
    };
  }, [produtos]);

  function abrirCadastro() {
    setProdutoEditando(null);
    setErroFormulario("");
    setModalAberto(true);
  }

  function abrirEdicao(produto) {
    setProdutoEditando(produto);
    setErroFormulario("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setProdutoEditando(null);
    setErroFormulario("");
  }

  async function salvarProduto(dados) {
    setSalvando(true);
    setErroFormulario("");

    try {
      if (produtoEditando) {
        await api.put(`/produtos/${produtoEditando.id}`, dados);
        setNotificacao("Produto atualizado com sucesso.");
      } else {
        await api.post("/produtos", dados);
        setNotificacao("Produto cadastrado com sucesso.");
      }

      setModalAberto(false);
      setProdutoEditando(null);
      await carregarDados();
    } catch (error) {
      setErroFormulario(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirProduto() {
    if (!produtoExcluindo) return;

    setExcluindo(true);
    setErroExclusao("");

    try {
      await api.delete(`/produtos/${produtoExcluindo.id}`);

      setProdutoExcluindo(null);
      setNotificacao("Produto excluído com sucesso.");
      await carregarDados();
    } catch (error) {
      setErroExclusao(
        error.response?.status === 409
          ? "Este produto possui vínculos com outros registros e não pode ser excluído."
          : mensagemErro(error),
      );
    } finally {
      setExcluindo(false);
    }
  }

  useEffect(() => {
    if (!notificacao) return;

    const identificador = window.setTimeout(() => {
      setNotificacao("");
    }, 3500);

    return () => window.clearTimeout(identificador);
  }, [notificacao]);

  const selectClasse =
    "appearance-none rounded-xl border border-white/[0.08] bg-[#101D2D] px-3.5 py-3 pr-9 text-xs text-[#D5D5DC] outline-none transition focus:border-[#A9BFFF]/60";

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9BFFF]">
            Gestão de estoque
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Produtos
          </h1>

          <p className="mt-1 text-xs text-[#9999A1]">
            Gerencie os produtos cadastrados no estoque.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          disabled={!categorias.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-xs font-semibold text-[#09090D] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador
          titulo="Produtos cadastrados"
          valor={indicadores.total.toLocaleString("pt-BR")}
          detalhe="Total de produtos"
          icone={Package}
          cor="#A9BFFF"
        />

        <Indicador
          titulo="Valor em estoque"
          valor={formatarMoeda(indicadores.valorTotal)}
          detalhe="Preço unitário × quantidade"
          icone={CircleDollarSign}
          cor="#D7CDA6"
        />

        <Indicador
          titulo="Estoque baixo"
          valor={indicadores.estoqueBaixo.toLocaleString("pt-BR")}
          detalhe="Produtos no limite mínimo"
          icone={AlertTriangle}
          cor="#D7CDA6"
        />

        <Indicador
          titulo="Produtos esgotados"
          valor={indicadores.estoqueEsgotado.toLocaleString("pt-BR")}
          detalhe="Sem unidades disponíveis"
          icone={Boxes}
          cor="#A6DDE5"
        />
      </section>

      {notificacao && (
        <div className="flex items-center gap-2 rounded-xl border border-[#A9BFFF]/20 bg-[#A9BFFF]/[0.08] px-4 py-3 text-xs text-[#C9D8FF]">
          <CheckCircle2 size={16} />
          {notificacao}
        </div>
      )}

      <section className="overflow-hidden rounded-[20px] bg-[#19191D]">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Lista de produtos
            </h2>
            <p className="mt-1 text-[10px] text-[#88888F]">
              Consulte, pesquise e gerencie os produtos cadastrados.
            </p>
          </div>

          <button
            type="button"
            onClick={carregarDados}
            disabled={carregando}
            title="Atualizar lista"
            className="inline-flex h-9 w-9 items-center justify-center self-end rounded-lg border border-white/[0.08] text-[#9999A1] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw size={15} className={carregando ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_210px_190px]">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77777F]"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Pesquisar por nome ou SKU..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#101D2D] py-3 pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-[#77777F] focus:border-[#A9BFFF]/60"
            />
          </div>

          <div className="relative">
            <Tag
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77777F]"
            />

            <select
              value={filtroCategoria}
              onChange={(event) => setFiltroCategoria(event.target.value)}
              className={`${selectClasse} w-full pl-10`}
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77777F]"
            />

            <select
              value={filtroEstoque}
              onChange={(event) => setFiltroEstoque(event.target.value)}
              className={`${selectClasse} w-full pl-10`}
            >
              <option value="todos">Todos os estoques</option>
              <option value="normal">Estoque normal</option>
              <option value="baixo">Estoque baixo</option>
              <option value="esgotado">Esgotados</option>
            </select>
          </div>
        </div>

        {erroCarregamento ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
              <XCircle size={25} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Não foi possível carregar os produtos
            </h3>

            <p className="mt-2 max-w-md text-xs leading-5 text-[#9999A1]">
              {erroCarregamento}
            </p>

            <button
              type="button"
              onClick={carregarDados}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-xs font-semibold text-[#09090D] transition hover:bg-white"
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        ) : carregando ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle size={28} className="animate-spin text-[#A9BFFF]" />
            <p className="mt-3 text-xs text-[#9999A1]">
              Carregando produtos...
            </p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <Package size={25} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              {produtos.length
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"}
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#9999A1]">
              {produtos.length
                ? "Tente alterar os filtros ou a pesquisa."
                : "Cadastre o primeiro produto para começar a organizar seu estoque."}
            </p>

            {!produtos.length && (
              <button
                type="button"
                onClick={abrirCadastro}
                disabled={!categorias.length}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-xs font-semibold text-[#09090D] transition hover:bg-white disabled:opacity-50"
              >
                <Plus size={15} />
                Cadastrar primeiro produto
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto px-4 pb-2">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-[#29292D] text-[10px] text-[#C1C1C8]">
                    <th className="rounded-l-lg px-4 py-3 font-medium">
                      Produto
                    </th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 font-medium">Preço</th>
                    <th className="px-4 py-3 font-medium">Estoque</th>
                    <th className="px-4 py-3 font-medium">Situação</th>
                    <th className="rounded-r-lg px-4 py-3 text-right font-medium">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {produtosFiltrados.map((produto) => {
                    const status = obterStatus(produto);

                    const estiloStatus = {
                      Normal: "bg-[#A9BFFF]/10 text-[#A9BFFF]",
                      Baixo: "bg-[#D7CDA6]/10 text-[#D7CDA6]",
                      Esgotado: "bg-red-400/10 text-red-300",
                    };

                    return (
                      <tr
                        key={produto.id}
                        className="border-b border-white/[0.06] transition hover:bg-white/[0.02] last:border-0"
                      >
                        <td className="px-4 py-4">
                          <p className="text-xs font-medium text-[#EEEEF1]">
                            {produto.nome}
                          </p>
                          <p className="mt-1 text-[10px] text-[#77777F]">
                            SKU: {produto.sku}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-xs text-[#B7B7BF]">
                          {produto.categoria?.nome || "Sem categoria"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-xs text-[#E4E4E7]">
                          {formatarMoeda(produto.preco)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="text-xs font-medium text-white">
                            {produto.quantidadeEstoque} un.
                          </p>
                          <p className="mt-1 text-[10px] text-[#77777F]">
                            Mínimo: {produto.estoqueMinimo}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1.5 text-[10px] font-medium ${estiloStatus[status]}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              title="Editar produto"
                              aria-label={`Editar ${produto.nome}`}
                              onClick={() => abrirEdicao(produto)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A9BFFF] transition hover:bg-[#A9BFFF]/10"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              title="Excluir produto"
                              aria-label={`Excluir ${produto.nome}`}
                              onClick={() => {
                                setErroExclusao("");
                                setProdutoExcluindo(produto);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9999A1] transition hover:bg-red-400/10 hover:text-red-300"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] text-[#88888F]">
                Exibindo {produtosFiltrados.length} de {produtos.length}{" "}
                produtos
              </p>

              {(busca ||
                filtroCategoria !== "todas" ||
                filtroEstoque !== "todos") && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setFiltroCategoria("todas");
                    setFiltroEstoque("todos");
                  }}
                  className="text-left text-[10px] font-medium text-[#A9BFFF] transition hover:text-white"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {!categorias.length && !carregando && !erroCarregamento && (
        <div className="flex items-start gap-3 rounded-xl border border-[#D7CDA6]/20 bg-[#D7CDA6]/[0.06] p-4">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#D7CDA6]" />
          <div>
            <p className="text-xs font-medium text-[#D7CDA6]">
              Nenhuma categoria cadastrada
            </p>
            <p className="mt-1 text-[10px] leading-5 text-[#9999A1]">
              Cadastre uma categoria antes de adicionar produtos.
            </p>
          </div>
        </div>
      )}

      <ModalProduto
        aberto={modalAberto}
        produto={produtoEditando}
        categorias={categorias}
        salvando={salvando}
        erro={erroFormulario}
        onFechar={fecharModal}
        onSalvar={salvarProduto}
      />

      <ModalExclusao
        produto={produtoExcluindo}
        excluindo={excluindo}
        erro={erroExclusao}
        onFechar={() => {
          if (!excluindo) {
            setProdutoExcluindo(null);
            setErroExclusao("");
          }
        }}
        onConfirmar={excluirProduto}
      />
    </div>
  );
}

export default Produtos;
