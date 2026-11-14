import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  Check,
  CheckCircle2,
  CirclePlus,
  FolderOpen,
  Layers3,
  LoaderCircle,
  Pencil,
  Package,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";

// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function obterLista(resposta) {
  const dados = resposta?.data;

  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.content)) return dados.content;
  if (Array.isArray(dados?.data)) return dados.data;

  return [];
}

function mensagemErro(erro, acao = "realizar esta operação") {
  const status = erro?.response?.status;
  const mensagem = erro?.response?.data?.message;

  if (status === 400) return mensagem || "Verifique os dados informados.";
  if (status === 401) return "Sua sessão expirou. Faça login novamente.";
  if (status === 403)
    return "Você não possui permissão para executar esta ação.";
  if (status === 404) return "Categoria não encontrada.";
  if (status === 409) {
    return (
      mensagem || "Não foi possível concluir a operação devido a um conflito."
    );
  }
  if (!erro?.response) return "Não foi possível conectar ao servidor.";

  return mensagem || `Não foi possível ${acao}.`;
}

function contarProdutos(produtos, categoriaId) {
  return produtos.filter((produto) => {
    const idCategoria =
      produto.categoria?.id ?? produto.categoriaId ?? produto.idCategoria;

    return String(idCategoria) === String(categoriaId);
  }).length;
}

// ======================================================
// COMPONENTE DE INDICADOR
// ======================================================

function Indicador({ titulo, valor, detalhe, icone: Icone, cor }) {
  void Icone;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#19191D] p-5 transition-all duration-200 hover:border-white/[0.12]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#A1A1AA]">{titulo}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {valor}
          </p>
          <p className="mt-2 text-xs text-[#71717A]">{detalhe}</p>
        </div>

        <div className={`rounded-xl p-3 ${cor}`}>
          <Icone size={21} />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// COMPONENTE DE NOTIFICAÇÃO
// ======================================================

function Notificacao({ notificacao, fechar }) {
  if (!notificacao) return null;

  const sucesso = notificacao.tipo === "sucesso";

  return (
    <div
      className={`fixed right-5 top-5 z-[100] flex max-w-[calc(100%-40px)] items-start gap-3 rounded-xl border p-4 shadow-2xl sm:max-w-md ${
        sucesso
          ? "border-emerald-500/20 bg-[#14251F]"
          : "border-red-500/20 bg-[#281719]"
      }`}
    >
      {sucesso ? (
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={19} />
      ) : (
        <AlertCircle className="mt-0.5 shrink-0 text-red-400" size={19} />
      )}

      <p className="flex-1 text-sm leading-5 text-white">
        {notificacao.mensagem}
      </p>

      <button
        type="button"
        onClick={fechar}
        className="text-[#A1A1AA] transition hover:text-white"
        aria-label="Fechar notificação"
      >
        <X size={17} />
      </button>
    </div>
  );
}

// ======================================================
// MODAL DE CADASTRO E EDIÇÃO
// ======================================================

function ModalCategoria({ aberto, categoria, salvar, fechar, salvando }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  const editando = Boolean(categoria);

  useEffect(() => {
    if (aberto) {
      setNome(categoria?.nome || "");
      setDescricao(categoria?.descricao || "");
      setErro("");
    }
  }, [aberto, categoria]);

  if (!aberto) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    const nomeNormalizado = nome.trim();
    const descricaoNormalizada = descricao.trim();

    if (!nomeNormalizado) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }

    if (nomeNormalizado.length > 100) {
      setErro("O nome deve possuir no máximo 100 caracteres.");
      return;
    }

    if (descricaoNormalizada.length > 300) {
      setErro("A descrição deve possuir no máximo 300 caracteres.");
      return;
    }

    setErro("");

    const sucesso = await salvar({
      nome: nomeNormalizado,
      descricao: descricaoNormalizada || null,
    });

    if (!sucesso) return;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !salvando) fechar();
      }}
    >
      <div className="my-auto w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#19191D] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {editando ? "Editar categoria" : "Nova categoria"}
            </h2>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              {editando
                ? "Atualize as informações da categoria."
                : "Preencha as informações para cadastrar."}
            </p>
          </div>

          <button
            type="button"
            onClick={fechar}
            disabled={salvando}
            className="rounded-lg p-2 text-[#A1A1AA] transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#E4E4E7]">
              Nome da categoria <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                setErro("");
              }}
              maxLength={100}
              placeholder="Ex.: Eletrônicos"
              disabled={salvando}
              autoFocus
              className="w-full rounded-xl border border-white/[0.08] bg-[#101014] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/50 disabled:opacity-50"
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-xs text-[#71717A]">{nome.length}/100</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#E4E4E7]">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(event) => {
                setDescricao(event.target.value);
                setErro("");
              }}
              maxLength={300}
              rows={4}
              placeholder="Descreva brevemente esta categoria..."
              disabled={salvando}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#101014] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/50 disabled:opacity-50"
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-xs text-[#71717A]">
                {descricao.length}/300
              </span>
            </div>
          </div>

          {erro && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3">
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{erro}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={fechar}
              disabled={salvando}
              className="rounded-xl border border-white/[0.09] px-5 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101827] transition hover:bg-[#C1D0FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Check size={17} />
              )}

              {salvando
                ? "Salvando..."
                : editando
                  ? "Salvar alterações"
                  : "Cadastrar categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// MODAL DE EXCLUSÃO
// ======================================================

function ModalExclusao({ categoria, fechar, confirmar, excluindo }) {
  if (!categoria) return null;

  const possuiProdutos = categoria.quantidadeProdutos > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#19191D] p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle size={23} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Excluir categoria
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
          Tem certeza de que deseja excluir a categoria{" "}
          <span className="font-medium text-white">{categoria.nome}</span>? Esta
          ação não poderá ser desfeita.
        </p>

        {possuiProdutos && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3">
            <p className="text-sm text-amber-300">
              Esta categoria possui {categoria.quantidadeProdutos} produto(s)
              vinculado(s). Remova ou altere os vínculos antes de excluir.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={fechar}
            disabled={excluindo}
            className="rounded-xl border border-white/[0.09] px-5 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={confirmar}
            disabled={excluindo || possuiProdutos}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {excluindo && <LoaderCircle size={17} className="animate-spin" />}
            Excluir categoria
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// PÁGINA DE CATEGORIAS
// ======================================================

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEdicao, setCategoriaEdicao] = useState(null);
  const [categoriaExclusao, setCategoriaExclusao] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  async function carregarDados() {
    setCarregando(true);
    setErroCarregamento("");

    try {
      const [respostaCategorias, respostaProdutos] = await Promise.all([
        api.get("/categorias"),
        api.get("/produtos"),
      ]);

      const listaCategorias = obterLista(respostaCategorias);
      const listaProdutos = obterLista(respostaProdutos);

      setProdutos(listaProdutos);

      setCategorias(
        listaCategorias.map((categoria) => ({
          ...categoria,
          quantidadeProdutos: contarProdutos(listaProdutos, categoria.id),
        })),
      );
    } catch (erro) {
      setErroCarregamento(mensagemErro(erro, "carregar as categorias"));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return categorias;

    return categorias.filter((categoria) => {
      return (
        String(categoria.nome || "")
          .toLowerCase()
          .includes(termo) ||
        String(categoria.descricao || "")
          .toLowerCase()
          .includes(termo)
      );
    });
  }, [categorias, busca]);

  const totalProdutos = produtos.length;
  const categoriasEmUso = categorias.filter(
    (categoria) => categoria.quantidadeProdutos > 0,
  ).length;
  const categoriasSemProdutos = categorias.length - categoriasEmUso;

  function exibirNotificacao(tipo, mensagem) {
    setNotificacao({ tipo, mensagem });
  }

  function abrirCadastro() {
    setCategoriaEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(categoria) {
    setCategoriaEdicao(categoria);
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
    setCategoriaEdicao(null);
  }

  async function salvarCategoria(dados) {
    setSalvando(true);

    try {
      if (categoriaEdicao) {
        await api.put(`/categorias/${categoriaEdicao.id}`, dados);
        exibirNotificacao("sucesso", "Categoria atualizada com sucesso.");
      } else {
        await api.post("/categorias", dados);
        exibirNotificacao("sucesso", "Categoria cadastrada com sucesso.");
      }

      setModalAberto(false);
      setCategoriaEdicao(null);
      await carregarDados();

      return true;
    } catch (erro) {
      exibirNotificacao(
        "erro",
        mensagemErro(
          erro,
          categoriaEdicao ? "atualizar a categoria" : "cadastrar a categoria",
        ),
      );
      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!categoriaExclusao || excluindo) return;

    if (categoriaExclusao.quantidadeProdutos > 0) {
      exibirNotificacao(
        "erro",
        "Não é possível excluir uma categoria que possui produtos vinculados.",
      );
      return;
    }

    setExcluindo(true);

    try {
      await api.delete(`/categorias/${categoriaExclusao.id}`);
      setCategoriaExclusao(null);
      exibirNotificacao("sucesso", "Categoria excluída com sucesso.");
      await carregarDados();
    } catch (erro) {
      exibirNotificacao("erro", mensagemErro(erro, "excluir a categoria"));
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6 pb-8">
      <Notificacao
        notificacao={notificacao}
        fechar={() => setNotificacao(null)}
      />

      {/* CABEÇALHO */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <Layers3 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                Categorias
              </h1>
              <p className="mt-0.5 text-sm text-[#71717A]">
                Organize os produtos do seu estoque
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-sm font-semibold text-[#101827] transition hover:bg-[#C1D0FF] sm:w-auto"
        >
          <CirclePlus size={18} />
          Nova categoria
        </button>
      </div>

      {/* INDICADORES */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Indicador
          titulo="Total de categorias"
          valor={categorias.length}
          detalhe="Categorias cadastradas"
          icone={Tag}
          cor="bg-[#A9BFFF]/10 text-[#A9BFFF]"
        />

        <Indicador
          titulo="Em utilização"
          valor={categoriasEmUso}
          detalhe="Com produtos vinculados"
          icone={Boxes}
          cor="bg-emerald-500/10 text-emerald-400"
        />

        <Indicador
          titulo="Sem produtos"
          valor={categoriasSemProdutos}
          detalhe={`${totalProdutos} produtos no estoque`}
          icone={FolderOpen}
          cor="bg-[#D7CDA6]/10 text-[#D7CDA6]"
        />
      </div>

      {/* LISTAGEM */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#19191D]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Todas as categorias</h2>
            <p className="mt-1 text-sm text-[#71717A]">
              Gerencie as categorias cadastradas
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            />
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar categoria..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#101014] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/50"
            />
          </div>
        </div>

        {carregando ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
            <LoaderCircle size={28} className="animate-spin text-[#A9BFFF]" />
            <p className="text-sm text-[#A1A1AA]">Carregando categorias...</p>
          </div>
        ) : erroCarregamento ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <AlertCircle size={28} className="text-red-400" />
            <p className="mt-3 text-sm text-red-300">{erroCarregamento}</p>
            <button
              type="button"
              onClick={carregarDados}
              className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.1] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.05]"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-[#71717A]">
              {busca ? <Search size={25} /> : <FolderOpen size={25} />}
            </div>

            <h3 className="mt-4 font-medium text-white">
              {busca
                ? "Nenhuma categoria encontrada"
                : "Nenhuma categoria cadastrada"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#71717A]">
              {busca
                ? "Tente pesquisar utilizando outro nome ou descrição."
                : "Comece cadastrando sua primeira categoria."}
            </p>

            {!busca && (
              <button
                type="button"
                onClick={abrirCadastro}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-2.5 text-sm font-semibold text-[#101827] transition hover:bg-[#C1D0FF]"
              >
                <CirclePlus size={17} />
                Cadastrar categoria
              </button>
            )}
          </div>
        ) : (
          <>
            {/* TABELA DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#101014]/70">
                  <tr className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Produtos</th>
                    <th className="px-6 py-4">Situação</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {categoriasFiltradas.map((categoria) => {
                    const possuiProdutos = categoria.quantidadeProdutos > 0;

                    return (
                      <tr
                        key={categoria.id}
                        className="transition hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
                              <Tag size={18} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white">
                                {categoria.nome}
                              </p>
                              <p className="mt-1 text-xs text-[#71717A]">
                                ID #{categoria.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-[260px] px-6 py-4">
                          <p className="truncate text-sm text-[#A1A1AA]">
                            {categoria.descricao || "Sem descrição"}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-[#D4D4D8]">
                            <Package size={14} />
                            {categoria.quantidadeProdutos}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                              possuiProdutos
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-[#D7CDA6]/10 text-[#D7CDA6]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                possuiProdutos
                                  ? "bg-emerald-400"
                                  : "bg-[#D7CDA6]"
                              }`}
                            />
                            {possuiProdutos ? "Em utilização" : "Sem produtos"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => abrirEdicao(categoria)}
                              title="Editar categoria"
                              className="rounded-lg p-2 text-[#A1A1AA] transition hover:bg-[#A9BFFF]/10 hover:text-[#A9BFFF]"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setCategoriaExclusao(categoria)}
                              title={
                                possuiProdutos
                                  ? "Categoria possui produtos vinculados"
                                  : "Excluir categoria"
                              }
                              className="rounded-lg p-2 text-[#A1A1AA] transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CARDS MOBILE */}

            <div className="divide-y divide-white/[0.05] md:hidden">
              {categoriasFiltradas.map((categoria) => {
                const possuiProdutos = categoria.quantidadeProdutos > 0;

                return (
                  <div key={categoria.id} className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
                          <Tag size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {categoria.nome}
                          </p>
                          <p className="mt-1 text-xs text-[#71717A]">
                            ID #{categoria.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(categoria)}
                          className="rounded-lg p-2 text-[#A1A1AA] hover:bg-[#A9BFFF]/10 hover:text-[#A9BFFF]"
                          aria-label="Editar categoria"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoriaExclusao(categoria)}
                          className="rounded-lg p-2 text-[#A1A1AA] hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Excluir categoria"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm leading-5 text-[#A1A1AA]">
                      {categoria.descricao || "Sem descrição cadastrada."}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <Package size={15} />
                        {categoria.quantidadeProdutos} produtos
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          possuiProdutos
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-[#D7CDA6]/10 text-[#D7CDA6]"
                        }`}
                      >
                        {possuiProdutos ? "Em utilização" : "Sem produtos"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RODAPÉ DA LISTAGEM */}

            <div className="border-t border-white/[0.07] px-5 py-4">
              <p className="text-xs text-[#71717A]">
                Exibindo{" "}
                <span className="font-medium text-[#D4D4D8]">
                  {categoriasFiltradas.length}
                </span>{" "}
                de{" "}
                <span className="font-medium text-[#D4D4D8]">
                  {categorias.length}
                </span>{" "}
                categorias
              </p>
            </div>
          </>
        )}
      </div>

      {/* MODAIS */}

      <ModalCategoria
        aberto={modalAberto}
        categoria={categoriaEdicao}
        salvar={salvarCategoria}
        fechar={fecharModal}
        salvando={salvando}
      />

      <ModalExclusao
        categoria={categoriaExclusao}
        fechar={() => {
          if (!excluindo) setCategoriaExclusao(null);
        }}
        confirmar={confirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}

export default Categorias;
