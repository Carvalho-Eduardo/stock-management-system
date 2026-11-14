import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import api from "../../services/api";

const dataBR = (v) => (v ? new Date(v).toLocaleString("pt-BR") : "—");

const campo =
  "mt-2 w-full rounded-xl border border-white/[0.09] bg-[#101014] px-3.5 py-3 text-sm text-[#F4F4F5] outline-none placeholder:text-[#52525B] focus:border-[#A9BFFF]/60";

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("TODOS");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");

  const [form, setForm] = useState({
    tipo: "ENTRADA",
    produtoId: "",
    quantidade: 1,
    observacao: "",
  });

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const [m, p] = await Promise.all([
        api.get("/movimentacoes"),
        api.get("/produtos"),
      ]);

      setMovimentacoes(Array.isArray(m.data) ? m.data : m.data?.content || []);
      setProdutos(Array.isArray(p.data) ? p.data : p.data?.content || []);
    } catch (e) {
      setErro(
        e.response?.data?.mensagens?.join(" ") ||
          e.response?.data?.message ||
          "Não foi possível carregar as movimentações.",
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
      movimentacoes.filter(
        (m) =>
          (tipoFiltro === "TODOS" || m.tipo === tipoFiltro) &&
          `${m.produtoNome || ""} ${m.produtoSku || ""} ${
            m.usuarioNome || ""
          } ${m.observacao || ""}`
            .toLowerCase()
            .includes(busca.toLowerCase()),
      ),
    [movimentacoes, busca, tipoFiltro],
  );

  async function salvar(e) {
    e.preventDefault();
    setAviso("");

    if (!form.produtoId || Number(form.quantidade) <= 0) {
      return setAviso(
        "Selecione um produto e informe uma quantidade maior que zero.",
      );
    }

    try {
      setSalvando(true);

      await api.post(
        `/movimentacoes/${form.tipo === "ENTRADA" ? "entrada" : "saida"}`,
        {
          produtoId: Number(form.produtoId),
          quantidade: Number(form.quantidade),
          observacao: form.observacao.trim() || null,
        },
      );

      setModal(false);

      setForm({
        tipo: "ENTRADA",
        produtoId: "",
        quantidade: 1,
        observacao: "",
      });

      await carregar();
    } catch (err) {
      setAviso(
        err.response?.data?.mensagens?.join(" ") ||
          err.response?.data?.message ||
          "Não foi possível registrar a movimentação.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const entradas = movimentacoes.filter((m) => m.tipo === "ENTRADA").length;
  const saidas = movimentacoes.filter((m) => m.tipo === "SAIDA").length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
            Estoque / Controle
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
            Movimentações
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Registre entradas e saídas e acompanhe o histórico do estoque.
          </p>
        </div>

        <button
          onClick={() => {
            setAviso("");
            setModal(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-sm font-semibold text-[#101D2D] hover:bg-[#BED0FF] sm:w-auto"
        >
          <Plus size={17} />
          Nova movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            t: "Total de movimentações",
            v: movimentacoes.length,
            icon: ArrowLeftRight,
          },
          {
            t: "Entradas",
            v: entradas,
            icon: ArrowDownToLine,
          },
          {
            t: "Saídas",
            v: saidas,
            icon: ArrowUpFromLine,
          },
        ].map((x) => (
          <div
            key={x.t}
            className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#19191D] p-4 sm:p-5"
          >
            <div>
              <p className="text-sm text-[#A1A1AA]">{x.t}</p>
              <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {x.v}
              </p>
            </div>

            <x.icon size={22} className="text-[#A9BFFF]" />
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#F4F4F5]">
              Histórico de movimentações
            </h2>
            <p className="mt-1 text-xs text-[#71717A]">
              {filtradas.length} registro(s) encontrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_150px_44px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar produto, SKU ou responsável"
                className={`${campo} mt-0`}
              />
            </div>

            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className={`${campo} mt-0`}
            >
              <option value="TODOS">Todos os tipos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SAIDA">Saídas</option>
            </select>

            <button
              onClick={carregar}
              className="flex items-center justify-center rounded-xl border border-white/[0.09] px-3 py-3 text-sm text-[#D4D4D8] hover:bg-white/[0.05]"
              title="Atualizar histórico"
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
            Nenhuma movimentação encontrada.
          </p>
        ) : (
          <>
            <div className="grid gap-3 p-3 md:hidden">
              {filtradas.map((m) => (
                <article
                  key={m.id}
                  className="rounded-xl border border-white/[0.07] bg-[#101014]/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#F4F4F5]">
                        {m.produtoNome}
                      </p>
                      <p className="mt-1 text-xs text-[#71717A]">
                        {m.produtoSku || "Sem SKU"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                        m.tipo === "ENTRADA"
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-red-400/20 bg-red-400/10 text-red-300"
                      }`}
                    >
                      {m.tipo === "ENTRADA" ? (
                        <ArrowDownToLine size={13} />
                      ) : (
                        <ArrowUpFromLine size={13} />
                      )}
                      {m.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3">
                    <div>
                      <p className="text-[11px] text-[#71717A]">Quantidade</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {m.quantidade}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#71717A]">Estoque após</p>
                      <p className="mt-1 text-sm font-medium text-[#D4D4D8]">
                        {m.estoquePosterior}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#71717A]">
                        Estoque anterior
                      </p>
                      <p className="mt-1 text-sm text-[#A1A1AA]">
                        {m.estoqueAnterior}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#71717A]">Responsável</p>
                      <p className="mt-1 truncate text-sm text-[#A1A1AA]">
                        {m.usuarioNome || "—"}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-[11px] text-[#71717A]">Data e hora</p>
                      <p className="mt-1 text-xs text-[#A1A1AA]">
                        {dataBR(m.dataHora)}
                      </p>
                    </div>

                    {m.observacao && (
                      <div className="col-span-2">
                        <p className="text-[11px] text-[#71717A]">Observação</p>
                        <p className="mt-1 break-words text-xs text-[#A1A1AA]">
                          {m.observacao}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#101014]/70 text-xs uppercase tracking-wider text-[#71717A]">
                  <tr>
                    {[
                      "Tipo",
                      "Produto",
                      "Quantidade",
                      "Estoque anterior",
                      "Estoque atual",
                      "Responsável",
                      "Data e hora",
                      "Observação",
                    ].map((t) => (
                      <th key={t} className="px-5 py-4 font-medium">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtradas.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t border-white/[0.05] hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                            m.tipo === "ENTRADA"
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-red-400/20 bg-red-400/10 text-red-300"
                          }`}
                        >
                          {m.tipo === "ENTRADA" ? (
                            <ArrowDownToLine size={13} />
                          ) : (
                            <ArrowUpFromLine size={13} />
                          )}
                          {m.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-[#F4F4F5]">
                          {m.produtoNome}
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          {m.produtoSku || "Sem SKU"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-white">
                        {m.quantidade}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A1A1AA]">
                        {m.estoqueAnterior}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A1A1AA]">
                        {m.estoquePosterior}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#A1A1AA]">
                        {m.usuarioNome || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#A1A1AA]">
                        {dataBR(m.dataHora)}
                      </td>

                      <td className="max-w-[220px] px-5 py-4 text-xs text-[#71717A]">
                        {m.observacao || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-4">
          <form
            onSubmit={salvar}
            className="my-auto max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#19191D] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] p-4 sm:p-5">
              <div>
                <h2 className="font-semibold text-white">Nova movimentação</h2>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  O estoque será atualizado ao confirmar.
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

            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label className="text-sm text-[#D4D4D8]">Tipo *</label>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, tipo: "ENTRADA" })}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm ${
                      form.tipo === "ENTRADA"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[#A1A1AA]"
                    }`}
                  >
                    <ArrowDownToLine size={17} />
                    Entrada
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, tipo: "SAIDA" })}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm ${
                      form.tipo === "SAIDA"
                        ? "border-red-400/40 bg-red-400/10 text-red-300"
                        : "border-white/10 text-[#A1A1AA]"
                    }`}
                  >
                    <ArrowUpFromLine size={17} />
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#D4D4D8]">Produto *</label>

                <select
                  required
                  value={form.produtoId}
                  onChange={(e) =>
                    setForm({ ...form, produtoId: e.target.value })
                  }
                  className={campo}
                >
                  <option value="">Selecione um produto</option>

                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} {p.sku ? `(${p.sku})` : ""} · estoque:{" "}
                      {p.quantidadeEstoque ?? 0}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-[#D4D4D8]">Quantidade *</label>

                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm({ ...form, quantidade: e.target.value })
                  }
                  className={campo}
                />
              </div>

              <div>
                <label className="text-sm text-[#D4D4D8]">Observação</label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.observacao}
                  onChange={(e) =>
                    setForm({ ...form, observacao: e.target.value })
                  }
                  className={campo}
                  placeholder="Motivo ou informação adicional..."
                />
              </div>

              {aviso && (
                <p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-300">
                  {aviso}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-4 sm:flex-row sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[#D4D4D8]"
              >
                Cancelar
              </button>

              <button
                disabled={salvando}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-2.5 text-sm font-semibold text-[#101D2D] disabled:opacity-60"
              >
                {salvando && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
