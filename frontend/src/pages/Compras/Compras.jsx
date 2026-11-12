import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CirclePlus,
  Eye,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

const moeda = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dataBR = (v) => (v ? new Date(v).toLocaleString("pt-BR") : "—");

const statusLabel = {
  PENDENTE: "Pendente",
  RECEBIDA: "Recebida",
  CANCELADA: "Cancelada",
};

const statusClass = {
  PENDENTE: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  RECEBIDA: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  CANCELADA: "border-red-400/20 bg-red-400/10 text-red-300",
};

const campo =
  "mt-2 w-full rounded-xl border border-white/[0.09] bg-[#101014] px-3.5 py-3 text-sm text-[#F4F4F5] outline-none placeholder:text-[#52525B] focus:border-[#A9BFFF]/60 disabled:opacity-50";

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modal, setModal] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [acaoId, setAcaoId] = useState(null);
  const [aviso, setAviso] = useState("");

  const [form, setForm] = useState({
    fornecedorId: "",
    observacao: "",
    itens: [{ produtoId: "", quantidade: 1, precoUnitario: "" }],
  });

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const [c, f, p] = await Promise.all([
        api.get("/compras"),
        api.get("/fornecedores"),
        api.get("/produtos"),
      ]);

      setCompras(Array.isArray(c.data) ? c.data : c.data?.content || []);

      setFornecedores(Array.isArray(f.data) ? f.data : f.data?.content || []);

      setProdutos(Array.isArray(p.data) ? p.data : p.data?.content || []);
    } catch (e) {
      setErro(
        e.response?.data?.mensagens?.join(" ") ||
          e.response?.data?.message ||
          "Não foi possível carregar os dados de compras.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtradas = useMemo(
    () =>
      compras.filter(
        (c) =>
          (filtro === "TODOS" || c.status === filtro) &&
          `${c.id} ${c.fornecedorNome || ""}`
            .toLowerCase()
            .includes(busca.toLowerCase()),
      ),
    [compras, filtro, busca],
  );

  function abrirNova() {
    setForm({
      fornecedorId: "",
      observacao: "",
      itens: [{ produtoId: "", quantidade: 1, precoUnitario: "" }],
    });

    setAviso("");
    setModal(true);
  }

  function atualizarItem(index, chave, valor) {
    setForm((anterior) => ({
      ...anterior,
      itens: anterior.itens.map((item, i) =>
        i === index ? { ...item, [chave]: valor } : item,
      ),
    }));
  }

  function adicionarItem() {
    setForm((anterior) => ({
      ...anterior,
      itens: [
        ...anterior.itens,
        { produtoId: "", quantidade: 1, precoUnitario: "" },
      ],
    }));
  }

  function removerItem(index) {
    setForm((anterior) => ({
      ...anterior,
      itens: anterior.itens.filter((_, i) => i !== index),
    }));
  }

  const totalPrevisto = form.itens.reduce(
    (s, i) => s + Number(i.quantidade || 0) * Number(i.precoUnitario || 0),
    0,
  );

  async function salvar(e) {
    e.preventDefault();
    setAviso("");

    if (!form.fornecedorId) {
      return setAviso("Selecione um fornecedor.");
    }

    if (
      !form.itens.length ||
      form.itens.some(
        (i) =>
          !i.produtoId ||
          Number(i.quantidade) <= 0 ||
          Number(i.precoUnitario) <= 0,
      )
    ) {
      return setAviso(
        "Preencha produto, quantidade e preço unitário de todos os itens.",
      );
    }

    if (
      new Set(form.itens.map((i) => i.produtoId)).size !== form.itens.length
    ) {
      return setAviso(
        "Não adicione o mesmo produto mais de uma vez. Ajuste a quantidade no item existente.",
      );
    }

    try {
      setSalvando(true);

      await api.post("/compras", {
        fornecedorId: Number(form.fornecedorId),
        observacao: form.observacao.trim() || null,
        itens: form.itens.map((i) => ({
          produtoId: Number(i.produtoId),
          quantidade: Number(i.quantidade),
          precoUnitario: Number(i.precoUnitario),
        })),
      });

      setModal(false);
      await carregar();
    } catch (err) {
      setAviso(
        err.response?.data?.mensagens?.join(" ") ||
          err.response?.data?.message ||
          "Não foi possível cadastrar a compra.",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function executar(id, acao) {
    const pergunta =
      acao === "receber"
        ? "Confirmar o recebimento? O estoque dos produtos será atualizado."
        : "Cancelar esta compra?";

    if (!window.confirm(pergunta)) return;

    try {
      setAcaoId(id);

      await api.post(`/compras/${id}/${acao}`);
      await carregar();

      if (detalhe?.id === id) {
        const r = await api.get(`/compras/${id}`);
        setDetalhe(r.data);
      }
    } catch (e) {
      window.alert(
        e.response?.data?.mensagens?.join(" ") ||
          e.response?.data?.message ||
          "Não foi possível concluir a operação.",
      );
    } finally {
      setAcaoId(null);
    }
  }

  async function abrirDetalhe(compra) {
    try {
      const r = await api.get(`/compras/${compra.id}`);
      setDetalhe(r.data);
    } catch {
      setDetalhe(compra);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
            Estoque / Suprimentos
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
            Compras
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Registre pedidos e acompanhe o recebimento de produtos.
          </p>
        </div>

        <button
          onClick={abrirNova}
          className="flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-sm font-semibold text-[#101D2D] hover:bg-[#BED0FF]"
        >
          <Plus size={17} />
          Nova compra
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { t: "Total de compras", v: compras.length },
          {
            t: "Pendentes",
            v: compras.filter((c) => c.status === "PENDENTE").length,
          },
          {
            t: "Recebidas",
            v: compras.filter((c) => c.status === "RECEBIDA").length,
          },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5"
          >
            <p className="text-sm text-[#A1A1AA]">{x.t}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{x.v}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#F4F4F5]">
              Histórico de compras
            </h2>
            <p className="mt-1 text-xs text-[#71717A]">
              {filtradas.length} registro(s)
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por fornecedor ou ID"
                className={`${campo} mt-0 pl-9 sm:w-64`}
              />
            </div>

            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className={`${campo} mt-0 sm:w-40`}
            >
              <option value="TODOS">Todos os status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="RECEBIDA">Recebidas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>

            <button
              onClick={carregar}
              className="rounded-xl border border-white/[0.09] px-3 py-2 text-sm text-[#D4D4D8] hover:bg-white/[0.05]"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {carregando ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-[#A1A1AA]">
            <LoaderCircle className="mr-2 animate-spin" />
            Carregando...
          </div>
        ) : erro ? (
          <p className="p-6 text-sm text-red-300">{erro}</p>
        ) : filtradas.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#71717A]">
            Nenhuma compra encontrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#101014]/70 text-xs uppercase tracking-wider text-[#71717A]">
                <tr>
                  {[
                    "Compra",
                    "Fornecedor",
                    "Data",
                    "Itens",
                    "Valor total",
                    "Status",
                    "Ações",
                  ].map((t) => (
                    <th key={t} className="px-5 py-4 font-medium">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtradas.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-white/[0.05] hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 text-sm text-white">#{c.id}</td>
                    <td className="px-5 py-4 text-sm text-[#D4D4D8]">
                      {c.fornecedorNome}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#A1A1AA]">
                      {dataBR(c.dataCadastro)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#D4D4D8]">
                      {c.itens?.length || 0}
                    </td>
                    <td className="px-5 py-4 text-sm text-white">
                      {moeda(c.valorTotal)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          statusClass[c.status] || ""
                        }`}
                      >
                        {statusLabel[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          title="Detalhes"
                          onClick={() => abrirDetalhe(c)}
                          className="rounded-lg border border-white/10 p-2 text-[#A9BFFF] hover:bg-white/5"
                        >
                          <Eye size={15} />
                        </button>

                        {c.status === "PENDENTE" && (
                          <>
                            <button
                              title="Receber compra"
                              disabled={acaoId === c.id}
                              onClick={() => executar(c.id, "receber")}
                              className="rounded-lg border border-emerald-400/20 p-2 text-emerald-300 hover:bg-emerald-400/10"
                            >
                              <Check size={15} />
                            </button>

                            <button
                              title="Cancelar compra"
                              disabled={acaoId === c.id}
                              onClick={() => executar(c.id, "cancelar")}
                              className="rounded-lg border border-red-400/20 p-2 text-red-300 hover:bg-red-400/10"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={salvar}
            className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#19191D] shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.07] bg-[#19191D] px-6 py-5">
              <div>
                <h2 className="font-semibold text-white">Nova compra</h2>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  A compra ficará pendente até o recebimento.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModal(false)}
                className="text-[#A1A1AA] hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="text-sm text-[#D4D4D8]">Fornecedor *</label>
                <select
                  required
                  value={form.fornecedorId}
                  onChange={(e) =>
                    setForm({ ...form, fornecedorId: e.target.value })
                  }
                  className={campo}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">
                    Produtos da compra
                  </h3>
                  <button
                    type="button"
                    onClick={adicionarItem}
                    className="flex items-center gap-1 text-xs text-[#A9BFFF]"
                  >
                    <CirclePlus size={15} />
                    Adicionar produto
                  </button>
                </div>

                {form.itens.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-xl border border-white/[0.07] bg-[#101014]/60 p-4 sm:grid-cols-[1fr_100px_130px_36px]"
                  >
                    <div>
                      <label className="text-xs text-[#A1A1AA]">
                        Produto *
                      </label>
                      <select
                        required
                        value={item.produtoId}
                        onChange={(e) =>
                          atualizarItem(index, "produtoId", e.target.value)
                        }
                        className={campo}
                      >
                        <option value="">Selecione</option>
                        {produtos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome} {p.sku ? `(${p.sku})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-[#A1A1AA]">
                        Quantidade *
                      </label>
                      <input
                        required
                        min="1"
                        type="number"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarItem(index, "quantidade", e.target.value)
                        }
                        className={campo}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#A1A1AA]">
                        Preço unitário *
                      </label>
                      <input
                        required
                        min="0.01"
                        step="0.01"
                        type="number"
                        value={item.precoUnitario}
                        onChange={(e) =>
                          atualizarItem(index, "precoUnitario", e.target.value)
                        }
                        className={campo}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={form.itens.length === 1}
                      onClick={() => removerItem(index)}
                      className="mt-6 rounded-lg p-2 text-red-300 hover:bg-red-400/10 disabled:opacity-30"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm text-[#D4D4D8]">Observação</label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={form.observacao}
                  onChange={(e) =>
                    setForm({ ...form, observacao: e.target.value })
                  }
                  className={campo}
                  placeholder="Informações adicionais da compra..."
                />
              </div>

              <div className="flex justify-between rounded-xl bg-[#101014] p-4">
                <span className="text-sm text-[#A1A1AA]">Total estimado</span>
                <strong className="text-lg text-white">
                  {moeda(totalPrevisto)}
                </strong>
              </div>

              {aviso && (
                <p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">
                  {aviso}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-white/[0.07] px-6 py-5">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[#D4D4D8]"
              >
                Cancelar
              </button>

              <button
                disabled={salvando}
                className="flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-2.5 text-sm font-semibold text-[#101D2D] disabled:opacity-60"
              >
                {salvando && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Salvar compra
              </button>
            </div>
          </form>
        </div>
      )}

      {detalhe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#19191D] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="font-semibold text-white">
                  Compra #{detalhe.id}
                </h2>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  {detalhe.fornecedorNome}
                </p>
              </div>

              <button
                onClick={() => setDetalhe(null)}
                className="text-[#A1A1AA] hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {(detalhe.itens || []).map((i) => (
                <div
                  key={i.id || i.produtoId}
                  className="flex justify-between gap-3 rounded-xl bg-[#101014] p-3"
                >
                  <div>
                    <p className="text-sm text-white">{i.produtoNome}</p>
                    <p className="mt-1 text-xs text-[#71717A]">
                      {i.quantidade} × {moeda(i.precoUnitario)}
                    </p>
                  </div>
                  <span className="text-sm text-[#D4D4D8]">
                    {moeda(i.subtotal)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between border-t border-white/[0.07] pt-4">
                <span className="text-sm text-[#A1A1AA]">Total</span>
                <strong className="text-white">
                  {moeda(detalhe.valorTotal)}
                </strong>
              </div>

              <p className="text-xs text-[#71717A]">
                Cadastro: {dataBR(detalhe.dataCadastro)} · Recebimento:{" "}
                {dataBR(detalhe.dataRecebimento)}
              </p>

              {detalhe.observacao && (
                <p className="text-sm text-[#A1A1AA]">{detalhe.observacao}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
