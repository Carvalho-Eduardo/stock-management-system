import { useState } from "react";

import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Clock3,
  Boxes,
  Warehouse,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const movimentacoes = [
  {
    produto: "Notebook Dell Inspiron",
    codigo: "PRD-001",
    quantidade: "15 un.",
    tipo: "Entrada",
    data: "Hoje, 10:32",
  },
  {
    produto: "Mouse Logitech M170",
    codigo: "PRD-002",
    quantidade: "8 un.",
    tipo: "Saída",
    data: "Hoje, 09:45",
  },
  {
    produto: "Teclado Mecânico Redragon",
    codigo: "PRD-003",
    quantidade: "20 un.",
    tipo: "Entrada",
    data: "Ontem, 16:20",
  },
  {
    produto: "Monitor LG 24 polegadas",
    codigo: "PRD-004",
    quantidade: "3 un.",
    tipo: "Saída",
    data: "Ontem, 14:10",
  },
  {
    produto: "Headset HyperX",
    codigo: "PRD-005",
    quantidade: "10 un.",
    tipo: "Entrada",
    data: "Ontem, 11:25",
  },
];

const dadosGraficos = {
  "7 dias": [
    { data: "Seg", produtos: 120, valor: 4200, movimentacoes: 18 },
    { data: "Ter", produtos: 145, valor: 5100, movimentacoes: 25 },
    { data: "Qua", produtos: 132, valor: 4800, movimentacoes: 21 },
    { data: "Qui", produtos: 170, valor: 6200, movimentacoes: 32 },
    { data: "Sex", produtos: 155, valor: 5700, movimentacoes: 27 },
    { data: "Sáb", produtos: 190, valor: 7100, movimentacoes: 38 },
    { data: "Dom", produtos: 180, valor: 6800, movimentacoes: 34 },
  ],

  "30 dias": [
    { data: "01", produtos: 110, valor: 3800, movimentacoes: 15 },
    { data: "05", produtos: 145, valor: 5100, movimentacoes: 24 },
    { data: "10", produtos: 130, valor: 4700, movimentacoes: 20 },
    { data: "15", produtos: 175, valor: 6400, movimentacoes: 31 },
    { data: "20", produtos: 160, valor: 5900, movimentacoes: 28 },
    { data: "25", produtos: 195, valor: 7300, movimentacoes: 39 },
    { data: "30", produtos: 185, valor: 6900, movimentacoes: 35 },
  ],

  "12 meses": [
    { data: "Jan", produtos: 90, valor: 3200, movimentacoes: 12 },
    { data: "Fev", produtos: 110, valor: 4100, movimentacoes: 17 },
    { data: "Mar", produtos: 125, valor: 4600, movimentacoes: 20 },
    { data: "Abr", produtos: 140, valor: 5200, movimentacoes: 23 },
    { data: "Mai", produtos: 135, valor: 4900, movimentacoes: 21 },
    { data: "Jun", produtos: 155, valor: 5800, movimentacoes: 27 },
    { data: "Jul", produtos: 170, valor: 6300, movimentacoes: 30 },
    { data: "Ago", produtos: 160, valor: 6000, movimentacoes: 28 },
    { data: "Set", produtos: 185, valor: 6900, movimentacoes: 34 },
    { data: "Out", produtos: 195, valor: 7300, movimentacoes: 38 },
    { data: "Nov", produtos: 180, valor: 6800, movimentacoes: 34 },
    { data: "Dez", produtos: 210, valor: 7900, movimentacoes: 42 },
  ],
};

const indicadores = [
  {
    titulo: "Produtos cadastrados",
    valor: "1.284",
    detalhe: "Total de produtos",
    campo: "produtos",
    cor: "#A9BFFF",
  },
  {
    titulo: "Valor em estoque",
    valor: "R$ 48.520",
    detalhe: "Valor estimado",
    campo: "valor",
    cor: "#D7CDA6",
  },
  {
    titulo: "Movimentações",
    valor: "254",
    detalhe: "Entradas e saídas",
    campo: "movimentacoes",
    cor: "#A6DDE5",
  },
];

function TooltipPersonalizado({ active, payload, label, campo, cor }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const valor = payload[0].value;

  return (
    <div className="rounded-xl border border-white/10 bg-[#101D2D] px-4 py-3 shadow-xl">
      <p className="text-[11px] text-[#A1A1AA]">{label}</p>

      <p className="mt-1 text-sm font-semibold" style={{ color: cor }}>
        {campo === "valor"
          ? `R$ ${Number(valor).toLocaleString("pt-BR")}`
          : Number(valor).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

function GraficoLinha({ campo, cor, periodo }) {
  const dados = dadosGraficos[periodo];

  return (
    <div className="h-[75px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dados}
          margin={{ top: 8, right: 5, left: 5, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#FFFFFF"
            strokeOpacity={0.06}
            vertical={false}
          />

          <XAxis dataKey="data" hide />

          <YAxis hide />

          <Tooltip
            cursor={{ stroke: cor, strokeOpacity: 0.25 }}
            content={<TooltipPersonalizado campo={campo} cor={cor} />}
          />

          <Line
            type="monotone"
            dataKey={campo}
            stroke={cor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 5,
              fill: cor,
              stroke: "#19191D",
              strokeWidth: 2,
            }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function IndicadorCircular({ valor = "7.4", porcentagem = 74 }) {
  const circunferencia = 2 * Math.PI * 43;
  const deslocamento = circunferencia * (1 - porcentagem / 100);

  return (
    <div className="relative h-[112px] w-[112px] shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-[135deg]">
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="#3A3A40"
          strokeWidth="7"
          strokeDasharray={`${circunferencia * 0.75} ${circunferencia}`}
          strokeLinecap="round"
        />

        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="#A9BFFF"
          strokeWidth="7"
          strokeDasharray={`${circunferencia * 0.75} ${circunferencia}`}
          strokeDashoffset={deslocamento * 0.75}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-medium tracking-tight text-white">
          {valor}
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [periodo, setPeriodo] = useState("7 dias");

  return (
    <div className="space-y-5">
      {/* Identificação e contexto */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9BFFF]">
            Painel de controle
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Visão geral do estoque
          </h2>
        </div>

        <span className="rounded-full border border-white/[0.08] bg-[#19191D] px-3 py-1.5 text-[10px] text-[#A1A1AA]">
          Dados demonstrativos
        </span>
      </div>

      {/* Primeira linha */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Card de destaque */}
        <article className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#19191D] p-6 xl:col-span-4">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#477FFF]/35 to-transparent" />

          <div className="relative z-10 flex items-center justify-center">
            <div className="flex h-[135px] w-[135px] items-center justify-center rounded-full border border-[#A9BFFF]/20 bg-gradient-to-br from-[#477FFF]/30 via-[#101D2D] to-[#09090D] shadow-[0_0_70px_rgba(71,127,255,0.15)]">
              <Boxes size={65} strokeWidth={1.1} className="text-[#A9BFFF]" />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-white">
              Gestão inteligente de estoque
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#B0B0B7]">
              Produtos, fornecedores e movimentações organizados em uma única
              plataforma.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#A9BFFF] px-4 py-2 text-xs font-semibold text-[#09090D]">
              <Warehouse size={14} />
              StockFlow
            </div>
          </div>
        </article>

        {/* Indicadores */}
        <article className="rounded-[20px] bg-[#19191D] p-4 sm:p-5 xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Atividade do estoque
              </h3>

              <p className="mt-1 text-[10px] text-[#88888F]">
                Indicadores gerais do sistema
              </p>
            </div>

            {/* Filtro de período */}
            <div className="flex items-center gap-1 rounded-lg bg-[#101D2D] p-1">
              {Object.keys(dadosGraficos).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => setPeriodo(opcao)}
                  className={`rounded-md px-3 py-2 text-[10px] font-medium transition ${
                    periodo === opcao
                      ? "bg-[#A9BFFF] text-[#09090D]"
                      : "text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {indicadores.map((item) => (
              <div
                key={item.titulo}
                className="rounded-[15px] bg-[#29292D] p-4"
              >
                <p className="text-[11px] font-medium text-[#E2E2E7]">
                  {item.titulo}
                </p>

                <div className="mt-3">
                  <GraficoLinha
                    campo={item.campo}
                    cor={item.cor}
                    periodo={periodo}
                  />
                </div>

                <p className="mt-2 text-[25px] font-semibold tracking-tight text-white">
                  {item.valor}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="text-[10px] text-[#A1A1AA]">
                    {item.detalhe}
                  </span>

                  <span className="text-[10px] text-[#A9BFFF]">Exemplo</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Segunda linha */}
      <section className="grid grid-cols-1 gap-3 rounded-[18px] bg-[#19191D] p-4 md:grid-cols-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#29292D] text-[#A9BFFF]">
            <ArrowDownToLine size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#A1A1AA]">Entradas registradas</p>
            <p className="mt-1 text-sm font-semibold text-white">
              156 movimentações
            </p>
          </div>

          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#3A3A40]">
            <div className="h-full w-[70%] rounded-full bg-[#A9BFFF]" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/[0.06] px-2 py-2 md:border-l md:border-t-0 md:pl-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#29292D] text-[#A6DDE5]">
            <ArrowUpFromLine size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#A1A1AA]">Saídas registradas</p>
            <p className="mt-1 text-sm font-semibold text-white">
              98 movimentações
            </p>
          </div>

          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#3A3A40]">
            <div className="h-full w-[48%] rounded-full bg-[#A6DDE5]" />
          </div>
        </div>
      </section>

      {/* Terceira linha */}
      <section className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-12">
        {/* Tabela */}
        <article className="min-w-0 overflow-hidden rounded-[20px] bg-[#19191D] 2xl:col-span-8">
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Movimentações recentes
              </h3>

              <p className="mt-1 text-[10px] text-[#88888F]">
                Histórico de entradas e saídas
              </p>
            </div>

            <Clock3 size={18} className="text-[#A9BFFF]" />
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full min-w-[580px] text-left">
              <thead>
                <tr className="bg-[#29292D] text-[10px] text-[#C1C1C8]">
                  <th className="rounded-l-lg px-3 py-3 font-medium">
                    Produto
                  </th>
                  <th className="px-3 py-3 font-medium">Tipo</th>
                  <th className="px-3 py-3 font-medium">Quantidade</th>
                  <th className="rounded-r-lg px-3 py-3 font-medium">Data</th>
                </tr>
              </thead>

              <tbody>
                {movimentacoes.map((item) => (
                  <tr
                    key={item.codigo}
                    className="border-b border-white/[0.06] last:border-0"
                  >
                    <td className="px-3 py-4">
                      <p className="text-xs font-medium text-[#EEEEF1]">
                        {item.produto}
                      </p>

                      <p className="mt-1 text-[9px] text-[#77777F]">
                        {item.codigo}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-[9px] ${
                          item.tipo === "Entrada"
                            ? "bg-[#A9BFFF]/10 text-[#A9BFFF]"
                            : "bg-[#A6DDE5]/10 text-[#A6DDE5]"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-xs text-[#E4E4E7]">
                      {item.quantidade}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-[10px] text-[#9999A1]">
                      {item.data}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/[0.06] px-5 py-3">
            <p className="text-[9px] text-[#77777F]">
              Informações ilustrativas, ainda não conectadas à API.
            </p>
          </div>
        </article>

        {/* Indicadores laterais */}
        <div className="flex flex-col gap-4 2xl:col-span-4">
          {/* Saúde do estoque */}
          <article className="rounded-[20px] bg-[#19191D] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Saúde do estoque
                </h3>

                <p className="mt-1 text-[10px] text-[#9999A1]">
                  Indicador demonstrativo
                </p>
              </div>

              <CheckCircle2 size={19} className="text-[#A9BFFF]" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-white">74%</p>

                <p className="mt-2 max-w-[145px] text-[10px] leading-5 text-[#9999A1]">
                  Índice ilustrativo de monitoramento
                </p>
              </div>

              <IndicadorCircular valor="7.4" porcentagem={74} />
            </div>
          </article>

          {/* Estoque baixo */}
          <article className="rounded-[20px] bg-[#19191D] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Estoque baixo
                </h3>

                <p className="mt-1 text-[10px] text-[#9999A1]">
                  Produtos que precisam de atenção
                </p>
              </div>

              <AlertTriangle size={19} className="text-[#D7CDA6]" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-white">12</p>

                <p className="mt-1 text-[10px] text-[#9999A1]">
                  Produtos abaixo do mínimo
                </p>
              </div>

              <span className="rounded-full bg-[#D7CDA6]/10 px-3 py-1.5 text-[10px] text-[#D7CDA6]">
                Atenção
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#29292D]">
              <div className="h-full w-[35%] rounded-full bg-[#D7CDA6]" />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
