import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Building2,
  RefreshCw,
  ShoppingCart,
  Package,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const moeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dataHora = (valor) =>
  valor ? new Date(valor).toLocaleString("pt-BR") : "—";

function CartaoIndicador({ titulo, valor, detalhe, Icone, cor }) {
  void Icone;

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#A1A1AA]">{titulo}</p>
          <p className="mt-3 text-3xl font-semibold text-[#F4F4F5]">{valor}</p>
          <p className="mt-2 text-xs text-[#71717A]">{detalhe}</p>
        </div>

        <span
          className="rounded-xl p-3"
          style={{ color: cor, backgroundColor: `${cor}18` }}
        >
          <Icone size={21} />
        </span>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/dashboard");
      setDados(resposta.data);
    } catch (error) {
      setErro(
        error.response?.data?.mensagens?.join(" ") ||
          error.response?.data?.message ||
          "Não foi possível carregar os dados do dashboard.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-[#A1A1AA]">
        <RefreshCw className="mr-2 animate-spin" size={18} />
        Carregando dashboard...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-sm text-red-300">
        {erro}
        <button onClick={carregar} className="ml-4 underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  const indicadores = [
    {
      titulo: "Produtos cadastrados",
      valor: dados?.totalProdutos ?? 0,
      detalhe: "Itens registrados no sistema",
      Icone: Package,
      cor: "#A9BFFF",
    },
    {
      titulo: "Fornecedores",
      valor: dados?.totalFornecedores ?? 0,
      detalhe: "Parceiros cadastrados",
      Icone: Building2,
      cor: "#A6DDE5",
    },
    {
      titulo: "Valor em estoque",
      valor: moeda(dados?.valorTotalEstoque),
      detalhe: "Valor estimado atual",
      Icone: Boxes,
      cor: "#D7CDA6",
    },
    {
      titulo: "Compras pendentes",
      valor: dados?.comprasPendentes ?? 0,
      detalhe: "Aguardando recebimento",
      Icone: ShoppingCart,
      cor: "#D7CDA6",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
            Painel de controle
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
            Visão geral do estoque
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Indicadores atualizados com os dados do sistema.
          </p>
        </div>

        <button
          onClick={carregar}
          className="flex items-center gap-2 rounded-xl border border-white/[0.09] px-4 py-2.5 text-sm text-[#D4D4D8] hover:bg-white/[0.05]"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map((item) => (
          <CartaoIndicador key={item.titulo} {...item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#F4F4F5]">
                Movimentações de estoque
              </h2>
              <p className="mt-1 text-xs text-[#71717A]">Totais registrados</p>
            </div>
            <Link
              to="/movimentacoes"
              className="text-xs text-[#A9BFFF] hover:underline"
            >
              Ver histórico
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#101014] p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <ArrowDownToLine size={17} />
                <span className="text-sm">Entradas</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {dados?.totalEntradas ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-[#101014] p-4">
              <div className="flex items-center gap-2 text-red-300">
                <ArrowUpFromLine size={17} />
                <span className="text-sm">Saídas</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {dados?.totalSaidas ?? 0}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-300" size={18} />
            <h2 className="font-semibold text-[#F4F4F5]">
              Produtos com estoque baixo
            </h2>
          </div>

          <p className="mt-1 text-xs text-[#71717A]">
            {dados?.totalProdutosEstoqueBaixo ?? 0} produto(s) precisam de
            atenção
          </p>

          <div className="mt-4 space-y-2">
            {(dados?.produtosEstoqueBaixo || []).length ? (
              dados.produtosEstoqueBaixo.slice(0, 5).map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#101014] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#F4F4F5]">
                      {produto.nome}
                    </p>
                    <p className="mt-1 text-xs text-[#71717A]">
                      {produto.sku || "Sem SKU"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-amber-300">
                    {produto.quantidadeEstoque} / mín. {produto.estoqueMinimo}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-[#101014] p-4 text-sm text-[#71717A]">
                Nenhum produto com estoque baixo.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
          <div>
            <h2 className="font-semibold text-[#F4F4F5]">
              Últimas movimentações
            </h2>
            <p className="mt-1 text-xs text-[#71717A]">
              Registros mais recentes do estoque
            </p>
          </div>

          <Link
            to="/movimentacoes"
            className="text-xs text-[#A9BFFF] hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {(dados?.movimentacoesRecentes || []).length ? (
          <div className="divide-y divide-white/[0.05]">
            {dados.movimentacoesRecentes.map((mov) => (
              <div
                key={mov.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`rounded-lg p-2 ${
                      mov.tipo === "ENTRADA"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-red-400/10 text-red-300"
                    }`}
                  >
                    {mov.tipo === "ENTRADA" ? (
                      <ArrowDownToLine size={17} />
                    ) : (
                      <ArrowUpFromLine size={17} />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#F4F4F5]">
                      {mov.produtoNome}
                    </p>
                    <p className="mt-1 text-xs text-[#71717A]">
                      {mov.produtoSku || "Sem SKU"} ·{" "}
                      {mov.usuarioNome || "Usuário não identificado"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-[#F4F4F5]">
                    {mov.tipo === "ENTRADA" ? "+" : "−"}
                    {mov.quantidade}
                  </p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs text-[#71717A]">
                    <Clock3 size={12} />
                    {dataHora(mov.dataHora)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-[#71717A]">
            Nenhuma movimentação registrada.
          </p>
        )}
      </section>
    </div>
  );
}
