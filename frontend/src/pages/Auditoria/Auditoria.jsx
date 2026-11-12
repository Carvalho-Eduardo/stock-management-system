
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Clock3,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

const campo =
  "w-full rounded-xl border border-white/[0.09] bg-[#101014] px-3.5 py-3 text-sm text-[#F4F4F5] outline-none placeholder:text-[#52525B] focus:border-[#A9BFFF]/60";

function formatarData(data) {
  if (!data) return "—";

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) return "—";

  return valor.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obterEstiloAcao(acao) {
  const estilos = {
    CADASTRO:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    EDICAO:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
    EXCLUSAO:
      "border-red-400/20 bg-red-400/10 text-red-300",
    ENTRADA:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    SAIDA:
      "border-orange-400/20 bg-orange-400/10 text-orange-300",
    RECEBIMENTO:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    CANCELAMENTO:
      "border-red-400/20 bg-red-400/10 text-red-300",
    VINCULO:
      "border-violet-400/20 bg-violet-400/10 text-violet-300",
    DESVINCULO:
      "border-orange-400/20 bg-orange-400/10 text-orange-300",
  };

  return estilos[acao] || "border-white/10 bg-white/[0.05] text-[#A1A1AA]";
}

function formatarAcao(acao) {
  const nomes = {
    CADASTRO: "Cadastro",
    EDICAO: "Edição",
    EXCLUSAO: "Exclusão",
    ENTRADA: "Entrada",
    SAIDA: "Saída",
    RECEBIMENTO: "Recebimento",
    CANCELAMENTO: "Cancelamento",
    VINCULO: "Vínculo",
    DESVINCULO: "Desvínculo",
  };

  return nomes[acao] || acao || "Ação";
}

function formatarModulo(modulo) {
  const nomes = {
    PRODUTOS: "Produtos",
    CATEGORIAS: "Categorias",
    FORNECEDORES: "Fornecedores",
    COMPRAS: "Compras",
    ESTOQUE: "Estoque",
    PRODUTOS_FORNECEDORES: "Produtos e fornecedores",
  };

  return nomes[modulo] || modulo || "—";
}

function Indicador({ titulo, valor, descricao, icone: Icone }) {
  void Icone;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#A1A1AA]">{titulo}</p>
        <Icone size={20} className="text-[#A9BFFF]" />
      </div>

      <p className="mt-3 text-3xl font-semibold text-white">{valor}</p>

      <p className="mt-1 text-xs text-[#71717A]">{descricao}</p>
    </div>
  );
}

export default function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [busca, setBusca] = useState("");
  const [acaoFiltro, setAcaoFiltro] = useState("TODOS");
  const [moduloFiltro, setModuloFiltro] = useState("TODOS");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/auditoria");

      setRegistros(
        Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data?.content || [],
      );
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          "Não foi possível carregar o histórico de auditoria.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return registros.filter((registro) => {
      const correspondeBusca =
        !termo ||
        [
          registro.usuarioNome,
          registro.usuarioEmail,
          registro.descricao,
          registro.acao,
          registro.modulo,
          registro.registroId,
        ]
          .join(" ")
          .toLowerCase()
          .includes(termo);

      const correspondeAcao =
        acaoFiltro === "TODOS" || registro.acao === acaoFiltro;

      const correspondeModulo =
        moduloFiltro === "TODOS" ||
        registro.modulo === moduloFiltro;

      return (
        correspondeBusca &&
        correspondeAcao &&
        correspondeModulo
      );
    });
  }, [registros, busca, acaoFiltro, moduloFiltro]);

  const usuariosAtivosNoHistorico = useMemo(
    () =>
      new Set(
        registros
          .map((registro) => registro.usuarioId)
          .filter((id) => id != null),
      ).size,
    [registros],
  );

  const hoje = new Date();

  const registrosHoje = useMemo(
    () =>
      registros.filter((registro) => {
        if (!registro.dataHora) return false;

        const data = new Date(registro.dataHora);

        return (
          data.getDate() === hoje.getDate() &&
          data.getMonth() === hoje.getMonth() &&
          data.getFullYear() === hoje.getFullYear()
        );
      }).length,
    [registros, hoje.getDate(), hoje.getMonth(), hoje.getFullYear()],
  );

  const ultimaAtividade = registros[0]
    ? formatarData(registros[0].dataHora)
    : "Nenhuma atividade";

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
            Sistema / Monitoramento
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
            Auditoria
          </h1>

          <p className="mt-1 text-sm text-[#A1A1AA]">
            Acompanhe as ações realizadas e consulte o histórico do sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={carregar}
          disabled={carregando}
          className="flex items-center gap-2 rounded-xl border border-white/[0.09] px-4 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={carregando ? "animate-spin" : ""}
          />
          Atualizar
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador
          titulo="Total de registros"
          valor={registros.length}
          descricao="Ações armazenadas no histórico"
          icone={ClipboardList}
        />

        <Indicador
          titulo="Atividades hoje"
          valor={registrosHoje}
          descricao="Operações realizadas hoje"
          icone={Activity}
        />

        <Indicador
          titulo="Usuários identificados"
          valor={usuariosAtivosNoHistorico}
          descricao="Usuários presentes no histórico"
          icone={UserRound}
        />

        <Indicador
          titulo="Última atividade"
          valor={
            ultimaAtividade === "Nenhuma atividade"
              ? "—"
              : ultimaAtividade.split(" ")[1] || "—"
          }
          descricao={
            ultimaAtividade === "Nenhuma atividade"
              ? "Nenhum registro disponível"
              : ultimaAtividade
          }
          icone={Clock3}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-[#A9BFFF]" />

            <div>
              <h2 className="font-semibold text-[#F4F4F5]">
                Histórico de atividades
              </h2>

              <p className="mt-1 text-xs text-[#71717A]">
                {filtrados.length} registro(s) encontrado(s)
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_190px_220px]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar usuário, ação, registro ou descrição..."
                className={`${campo} pl-9`}
              />
            </div>

            <select
              value={acaoFiltro}
              onChange={(e) => setAcaoFiltro(e.target.value)}
              className={campo}
            >
              <option value="TODOS">Todas as ações</option>
              <option value="CADASTRO">Cadastro</option>
              <option value="EDICAO">Edição</option>
              <option value="EXCLUSAO">Exclusão</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
              <option value="RECEBIMENTO">Recebimento</option>
              <option value="CANCELAMENTO">Cancelamento</option>
              <option value="VINCULO">Vínculo</option>
              <option value="DESVINCULO">Desvínculo</option>
            </select>

            <select
              value={moduloFiltro}
              onChange={(e) => setModuloFiltro(e.target.value)}
              className={campo}
            >
              <option value="TODOS">Todos os módulos</option>
              <option value="PRODUTOS">Produtos</option>
              <option value="CATEGORIAS">Categorias</option>
              <option value="FORNECEDORES">Fornecedores</option>
              <option value="COMPRAS">Compras</option>
              <option value="ESTOQUE">Estoque</option>
              <option value="PRODUTOS_FORNECEDORES">
                Produtos e fornecedores
              </option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="flex min-h-52 items-center justify-center text-sm text-[#A1A1AA]">
            <LoaderCircle className="mr-2 animate-spin" size={18} />
            Carregando histórico...
          </div>
        ) : erro ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-300">{erro}</p>

            <button
              type="button"
              onClick={carregar}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#D4D4D8] hover:bg-white/[0.05]"
            >
              Tentar novamente
            </button>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            {registros.length === 0 ? (
              <>
                <ClipboardList
                  size={32}
                  className="mb-3 text-[#52525B]"
                />

                <p className="text-sm font-medium text-[#D4D4D8]">
                  Nenhuma atividade registrada
                </p>

                <p className="mt-1 max-w-md text-xs text-[#71717A]">
                  Quando você cadastrar, editar, excluir ou movimentar
                  registros, as atividades aparecerão aqui.
                </p>
              </>
            ) : (
              <>
                <Filter size={30} className="mb-3 text-[#52525B]" />

                <p className="text-sm font-medium text-[#D4D4D8]">
                  Nenhum resultado encontrado
                </p>

                <p className="mt-1 text-xs text-[#71717A]">
                  Tente alterar os filtros ou o termo pesquisado.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#101014]/70 text-xs uppercase tracking-wider text-[#71717A]">
                <tr>
                  {[
                    "Ação",
                    "Módulo",
                    "Descrição",
                    "Responsável",
                    "Registro",
                    "Data e hora",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      className="px-5 py-4 font-medium"
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtrados.map((registro) => (
                  <tr
                    key={registro.id}
                    className="border-t border-white/[0.05] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${obterEstiloAcao(registro.acao)}`}
                      >
                        {formatarAcao(registro.acao)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#D4D4D8]">
                      {formatarModulo(registro.modulo)}
                    </td>

                    <td className="max-w-[330px] px-5 py-4">
                      <p className="text-sm leading-relaxed text-[#D4D4D8]">
                        {registro.descricao}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#F4F4F5]">
                        {registro.usuarioNome || "Usuário não identificado"}
                      </p>

                      {registro.usuarioEmail && (
                        <p className="mt-1 text-xs text-[#71717A]">
                          {registro.usuarioEmail}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#A1A1AA]">
                      {registro.registroId != null
                        ? `#${registro.registroId}`
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-[#A1A1AA]">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays
                          size={14}
                          className="text-[#71717A]"
                        />
                        {formatarData(registro.dataHora)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
