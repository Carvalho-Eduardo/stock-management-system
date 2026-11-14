import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

// ============================================================
// VALIDAÇÕES E FORMATAÇÕES
// ============================================================

const DDDS_VALIDOS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
];

function formatarCnpj(valor) {
  return String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function validarCnpj(valor) {
  const cnpj = String(valor || "").replace(/\D/g, "");

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  function calcularDigito(base, pesos) {
    const soma = base.split("").reduce((total, numero, indice) => {
      return total + Number(numero) * pesos[indice];
    }, 0);

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const primeiro = calcularDigito(
    cnpj.substring(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const segundo = calcularDigito(
    cnpj.substring(0, 12) + primeiro,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return cnpj.endsWith(`${primeiro}${segundo}`);
}

function formatarTelefone(valor) {
  const numeros = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;

  const ddd = numeros.slice(0, 2);
  const telefone = numeros.slice(2);

  if (telefone.length <= 5) return `(${ddd}) ${telefone}`;

  return `(${ddd}) ${telefone.slice(0, 5)}-${telefone.slice(5)}`;
}

function validarTelefone(valor) {
  const numeros = String(valor || "").replace(/\D/g, "");

  if (numeros.length !== 11) return false;

  const ddd = Number(numeros.slice(0, 2));
  const numero = numeros.slice(2);

  return DDDS_VALIDOS.includes(ddd) && numero[0] === "9";
}

function normalizarFornecedor(fornecedor) {
  return {
    id: fornecedor.id,
    nome: fornecedor.nome || "",
    cnpj: fornecedor.cnpj || "",
    email: fornecedor.email || "",
    telefone: fornecedor.telefone || "",
    endereco: fornecedor.endereco || "",
  };
}

function mensagemErro(error) {
  const dados = error?.response?.data;

  if (typeof dados === "string" && dados.trim()) return dados;
  if (dados?.message) return dados.message;
  if (dados?.mensagem) return dados.mensagem;
  if (dados?.erro) return dados.erro;
  if (dados?.detail) return dados.detail;

  const status = error?.response?.status;

  if (status === 400) return "Verifique os dados informados.";
  if (status === 401) return "Sua sessão expirou. Entre novamente no sistema.";
  if (status === 403) return "Você não possui permissão para esta operação.";
  if (status === 404) return "Fornecedor não encontrado.";
  if (status === 409) return "Já existe um cadastro com esses dados.";

  if (error?.message && !error.message.toLowerCase().includes("status code")) {
    return error.message;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

function obterLista(resposta) {
  const dados = resposta?.data;

  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.content)) return dados.content;
  if (Array.isArray(dados?.data)) return dados.data;

  return [];
}

// ============================================================
// INDICADOR
// ============================================================

function Indicador({ titulo, valor, detalhe, icone: Icone, cor }) {
  void Icone;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#19191D] p-5 transition hover:border-white/[0.14]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#A1A1AA]">{titulo}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#F4F4F5]">
            {valor}
          </p>
          <p className="mt-2 text-xs text-[#71717A]">{detalhe}</p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: `${cor}12`,
            borderColor: `${cor}30`,
            color: cor,
          }}
        >
          <Icone size={20} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CAMPO DO FORMULÁRIO
// ============================================================

function Campo({
  titulo,
  valor,
  alterar,
  placeholder,
  tipo = "text",
  maxLength,
  erro,
  dica,
  desabilitado,
  inputMode,
}) {
  return (
    <div className="min-w-0">
      <label className="text-sm font-medium text-[#D4D4D8]">{titulo}</label>

      <input
        type={tipo}
        inputMode={inputMode}
        value={valor}
        onChange={alterar}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={desabilitado}
        aria-invalid={Boolean(erro)}
        className={`mt-2 w-full rounded-xl border bg-[#101014] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#52525B] focus:ring-2 disabled:opacity-50 ${
          erro
            ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/10"
            : "border-white/[0.09] focus:border-[#A9BFFF]/60 focus:ring-[#A9BFFF]/10"
        }`}
      />

      {erro && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-400">
          <AlertCircle size={14} className="mt-px shrink-0" />
          {erro}
        </p>
      )}

      {!erro && dica && <p className="mt-1.5 text-xs text-[#71717A]">{dica}</p>}
    </div>
  );
}

// ============================================================
// MODAL DE CADASTRO E EDIÇÃO
// ============================================================

function ModalFornecedor({ aberto, fornecedor, salvando, aoFechar, aoSalvar }) {
  const [formulario, setFormulario] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");

  useEffect(() => {
    if (!aberto) return;

    setFormulario(
      fornecedor
        ? normalizarFornecedor(fornecedor)
        : {
            nome: "",
            cnpj: "",
            email: "",
            telefone: "",
            endereco: "",
          },
    );

    setErros({});
    setErroGeral("");
  }, [aberto, fornecedor]);

  if (!aberto) return null;

  function atualizarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErros((anterior) => ({
      ...anterior,
      [campo]: "",
    }));

    setErroGeral("");
  }

  function validarFormulario() {
    const novosErros = {};

    const nome = formulario.nome.trim();
    const cnpj = formulario.cnpj.replace(/\D/g, "");
    const email = formulario.email.trim();
    const telefone = formulario.telefone.replace(/\D/g, "");
    const endereco = formulario.endereco.trim();

    if (!nome) {
      novosErros.nome = "Informe o nome do fornecedor.";
    } else if (nome.length > 150) {
      novosErros.nome = "O nome deve ter no máximo 150 caracteres.";
    }

    if (cnpj && cnpj.length !== 14) {
      novosErros.cnpj = "Informe os 14 números do CNPJ.";
    } else if (cnpj && !validarCnpj(cnpj)) {
      novosErros.cnpj = "Informe um CNPJ válido.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "Informe um endereço de e-mail válido.";
    } else if (email.length > 180) {
      novosErros.email = "O e-mail deve ter no máximo 180 caracteres.";
    }

    if (telefone && telefone.length !== 11) {
      novosErros.telefone = "Informe o celular com DDD e 9 dígitos.";
    } else if (telefone && !validarTelefone(telefone)) {
      novosErros.telefone = "Informe um número de celular válido.";
    }

    if (endereco.length > 250) {
      novosErros.endereco = "O endereço deve ter no máximo 250 caracteres.";
    }

    return novosErros;
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErroGeral("");

    const novosErros = validarFormulario();
    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    const dados = {
      nome: formulario.nome.trim(),
      cnpj: formulario.cnpj.replace(/\D/g, "") || null,
      email: formulario.email.trim() || null,
      telefone: formulario.telefone.replace(/\D/g, "") || null,
      endereco: formulario.endereco.trim() || null,
    };

    try {
      await aoSalvar(dados);
    } catch (error) {
      const dadosErro = error?.response?.data;
      const errosApi = {};

      const origem =
        dadosErro?.errors || dadosErro?.erros || dadosErro?.fieldErrors;

      if (Array.isArray(origem)) {
        origem.forEach((item) => {
          const campo = String(
            item?.field || item?.campo || item?.property || "",
          )
            .replaceAll("[", "")
            .replaceAll("]", "")
            .split(".")
            .pop()
            .toLowerCase();

          const mensagem =
            item?.defaultMessage || item?.message || item?.mensagem;

          if (
            ["nome", "cnpj", "telefone", "email", "endereco"].includes(campo) &&
            mensagem
          ) {
            errosApi[campo] = String(mensagem);
          }
        });
      } else if (origem && typeof origem === "object") {
        Object.entries(origem).forEach(([campo, mensagem]) => {
          const chave = campo.toLowerCase();

          if (
            ["nome", "cnpj", "telefone", "email", "endereco"].includes(chave)
          ) {
            errosApi[chave] = Array.isArray(mensagem)
              ? mensagem.join(" ")
              : String(mensagem);
          }
        });
      }

      if (Object.keys(errosApi).length > 0) {
        setErros(errosApi);
      } else {
        setErroGeral(mensagemErro(error));
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget && !salvando) {
          aoFechar();
        }
      }}
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.09] bg-[#19191D] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-[#F4F4F5]">
              {fornecedor ? "Editar fornecedor" : "Novo fornecedor"}
            </h2>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              {fornecedor
                ? "Atualize as informações do fornecedor."
                : "Preencha os dados para cadastrar um fornecedor."}
            </p>
          </div>

          <button
            type="button"
            onClick={aoFechar}
            disabled={salvando}
            className="rounded-lg p-2 text-[#A1A1AA] transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={enviarFormulario} noValidate>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <Campo
                titulo="Nome do fornecedor *"
                valor={formulario.nome}
                alterar={(e) => atualizarCampo("nome", e.target.value)}
                placeholder="Ex.: Distribuidora Central"
                maxLength={150}
                erro={erros.nome}
                desabilitado={salvando}
              />
            </div>

            <Campo
              titulo="CNPJ"
              valor={formatarCnpj(formulario.cnpj)}
              alterar={(e) =>
                atualizarCampo(
                  "cnpj",
                  e.target.value.replace(/\D/g, "").slice(0, 14),
                )
              }
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              erro={erros.cnpj}
              dica="Informe os 14 números do CNPJ."
              desabilitado={salvando}
            />

            <Campo
              titulo="E-mail"
              tipo="email"
              valor={formulario.email}
              alterar={(e) => atualizarCampo("email", e.target.value)}
              placeholder="contato@empresa.com"
              maxLength={180}
              erro={erros.email}
              desabilitado={salvando}
            />

            <Campo
              titulo="Celular"
              tipo="tel"
              inputMode="numeric"
              valor={formatarTelefone(formulario.telefone)}
              alterar={(e) =>
                atualizarCampo(
                  "telefone",
                  e.target.value.replace(/\D/g, "").slice(0, 11),
                )
              }
              placeholder="(11) 99999-9999"
              erro={erros.telefone}
              dica="Informe o DDD e o número do celular."
              desabilitado={salvando}
            />

            <Campo
              titulo="Endereço"
              valor={formulario.endereco}
              alterar={(e) => atualizarCampo("endereco", e.target.value)}
              placeholder="Rua, número, cidade..."
              maxLength={250}
              erro={erros.endereco}
              desabilitado={salvando}
            />

            {erroGeral && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300 sm:col-span-2">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span>{erroGeral}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={aoFechar}
              disabled={salvando}
              className="rounded-xl border border-white/[0.09] px-5 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {salvando ? "Salvando..." : "Salvar fornecedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MODAL DE EXCLUSÃO
// ============================================================

function ModalExclusao({ fornecedor, excluindo, aoFechar, aoConfirmar }) {
  if (!fornecedor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#19191D] p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
          <Trash2 size={21} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#F4F4F5]">
          Excluir fornecedor?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
          Você está prestes a excluir{" "}
          <strong className="text-[#F4F4F5]">{fornecedor.nome}</strong>. Essa
          ação não poderá ser desfeita.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={aoFechar}
            disabled={excluindo}
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={aoConfirmar}
            disabled={excluindo}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-60"
          >
            {excluindo ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {excluindo ? "Excluindo..." : "Confirmar exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorEdicao, setFornecedorEdicao] = useState(null);
  const [fornecedorExclusao, setFornecedorExclusao] = useState(null);
  const [notificacao, setNotificacao] = useState(null);

  function notificar(tipo, mensagem) {
    setNotificacao({ tipo, mensagem });
  }

  async function carregarFornecedores() {
    try {
      setErro("");
      setCarregando(true);

      const resposta = await api.get("/fornecedores");
      setFornecedores(obterLista(resposta));
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      setErro(mensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const fornecedoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return fornecedores;

    const termoNumerico = termo.replace(/\D/g, "");

    return fornecedores.filter((fornecedor) => {
      const nome = (fornecedor.nome || "").toLowerCase();
      const cnpj = (fornecedor.cnpj || "").toLowerCase();
      const email = (fornecedor.email || "").toLowerCase();
      const telefone = (fornecedor.telefone || "").toLowerCase();

      return (
        nome.includes(termo) ||
        cnpj.includes(termo) ||
        email.includes(termo) ||
        telefone.includes(termo) ||
        (termoNumerico &&
          (cnpj.replace(/\D/g, "").includes(termoNumerico) ||
            telefone.replace(/\D/g, "").includes(termoNumerico)))
      );
    });
  }, [fornecedores, busca]);

  const indicadores = useMemo(
    () => ({
      total: fornecedores.length,
      comCnpj: fornecedores.filter((item) => item.cnpj).length,
      comEmail: fornecedores.filter((item) => item.email).length,
    }),
    [fornecedores],
  );

  function abrirCadastro() {
    setFornecedorEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(fornecedor) {
    setFornecedorEdicao(fornecedor);
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setFornecedorEdicao(null);
  }

  async function salvarFornecedor(dados) {
    try {
      setSalvando(true);

      if (fornecedorEdicao) {
        await api.put(`/fornecedores/${fornecedorEdicao.id}`, dados);
        notificar("sucesso", "Fornecedor atualizado com sucesso.");
      } else {
        await api.post("/fornecedores", dados);
        notificar("sucesso", "Fornecedor cadastrado com sucesso.");
      }

      setModalAberto(false);
      setFornecedorEdicao(null);

      await carregarFornecedores();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      throw error;
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!fornecedorExclusao || excluindo) return;

    try {
      setExcluindo(true);

      await api.delete(`/fornecedores/${fornecedorExclusao.id}`);

      notificar("sucesso", "Fornecedor excluído com sucesso.");
      setFornecedorExclusao(null);

      await carregarFornecedores();
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      notificar("erro", mensagemErro(error));
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6 pb-8">
      {/* NOTIFICAÇÃO */}

      {notificacao && (
        <div
          className={`fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-xl border px-4 py-3.5 shadow-2xl ${
            notificacao.tipo === "sucesso"
              ? "border-emerald-500/20 bg-[#14251F]"
              : "border-red-500/20 bg-[#281719]"
          }`}
        >
          {notificacao.tipo === "sucesso" ? (
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-400" />
          )}

          <p className="text-sm text-[#F4F4F5]">{notificacao.mensagem}</p>

          <button
            type="button"
            onClick={() => setNotificacao(null)}
            className="ml-2 text-[#71717A] transition hover:text-white"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* CABEÇALHO */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#A9BFFF]">
            <Building2 size={15} />
            GESTÃO DE ESTOQUE
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#F4F4F5]">
            Fornecedores
          </h1>

          <p className="mt-1 text-sm text-[#A1A1AA]">
            Gerencie os fornecedores e seus dados cadastrais.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] sm:w-auto"
        >
          <Plus size={18} />
          Novo fornecedor
        </button>
      </div>

      {/* INDICADORES */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Indicador
          titulo="Total de fornecedores"
          valor={indicadores.total}
          detalhe="Fornecedores cadastrados"
          icone={Building2}
          cor="#A9BFFF"
        />

        <Indicador
          titulo="Com CNPJ"
          valor={indicadores.comCnpj}
          detalhe="Com documento cadastrado"
          icone={FileText}
          cor="#A6DDE5"
        />

        <Indicador
          titulo="Com e-mail"
          valor={indicadores.comEmail}
          detalhe="Com contato eletrônico"
          icone={Mail}
          cor="#D7CDA6"
        />
      </div>

      {/* LISTAGEM */}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#F4F4F5]">
              Fornecedores cadastrados
            </h2>

            <p className="mt-1 text-xs text-[#71717A]">
              {fornecedoresFiltrados.length}{" "}
              {fornecedoresFiltrados.length === 1
                ? "fornecedor encontrado"
                : "fornecedores encontrados"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative min-w-0 sm:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
              />

              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar fornecedor..."
                className="w-full rounded-xl border border-white/[0.09] bg-[#101014] py-2.5 pl-10 pr-10 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/50"
              />

              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white"
                  title="Limpar pesquisa"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={carregarFornecedores}
              disabled={carregando}
              title="Atualizar listagem"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-4 py-2.5 text-sm text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={carregando ? "animate-spin" : ""}
              />
              Atualizar
            </button>
          </div>
        </div>

        {/* CARREGAMENTO */}

        {carregando ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
            <LoaderCircle size={28} className="animate-spin text-[#A9BFFF]" />
            <p className="text-sm text-[#A1A1AA]">Carregando fornecedores...</p>
          </div>
        ) : erro ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <AlertCircle size={32} className="text-red-400" />

            <p className="mt-4 font-medium text-[#F4F4F5]">
              Não foi possível carregar os fornecedores
            </p>

            <p className="mt-2 max-w-md text-sm text-[#A1A1AA]">{erro}</p>

            <button
              type="button"
              onClick={carregarFornecedores}
              className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.09] px-4 py-2.5 text-sm text-[#D4D4D8] transition hover:bg-white/[0.05]"
            >
              <RotateCcw size={15} />
              Tentar novamente
            </button>
          </div>
        ) : fornecedoresFiltrados.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#101014] text-[#71717A]">
              {busca ? <Search size={25} /> : <Building2 size={25} />}
            </div>

            <h3 className="mt-4 font-medium text-[#F4F4F5]">
              {busca
                ? "Nenhum fornecedor encontrado"
                : "Nenhum fornecedor cadastrado"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#71717A]">
              {busca
                ? "Tente pesquisar por outro nome, CNPJ, e-mail ou telefone."
                : "Cadastre seu primeiro fornecedor para começar a organizar seus parceiros."}
            </p>

            {!busca && (
              <button
                type="button"
                onClick={abrirCadastro}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-2.5 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BED0FF]"
              >
                <Plus size={16} />
                Cadastrar fornecedor
              </button>
            )}
          </div>
        ) : (
          <>
            {/* TABELA DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#101014]/60">
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                      Fornecedor
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                      CNPJ
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                      Contato
                    </th>
                    <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                      Endereço
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#71717A]">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {fornecedoresFiltrados.map((fornecedor) => (
                    <tr
                      key={fornecedor.id}
                      className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9BFFF]/15 bg-[#A9BFFF]/[0.08] text-[#A9BFFF]">
                            <Building2 size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-sm font-medium text-[#F4F4F5]">
                              {fornecedor.nome}
                            </p>
                            <p className="mt-1 text-xs text-[#71717A]">
                              ID #{fornecedor.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-[#A1A1AA]">
                          {fornecedor.cnpj
                            ? formatarCnpj(fornecedor.cnpj)
                            : "Não informado"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1.5">
                          {fornecedor.email && (
                            <div className="flex max-w-[210px] items-center gap-2 text-xs text-[#A1A1AA]">
                              <Mail
                                size={13}
                                className="shrink-0 text-[#71717A]"
                              />
                              <span className="truncate">
                                {fornecedor.email}
                              </span>
                            </div>
                          )}

                          {fornecedor.telefone && (
                            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                              <Phone
                                size={13}
                                className="shrink-0 text-[#71717A]"
                              />
                              <span>
                                {formatarTelefone(fornecedor.telefone)}
                              </span>
                            </div>
                          )}

                          {!fornecedor.email && !fornecedor.telefone && (
                            <span className="text-xs text-[#52525B]">
                              Sem contato
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex max-w-[200px] items-center gap-2 text-xs text-[#A1A1AA]">
                          {fornecedor.endereco ? (
                            <>
                              <MapPin
                                size={13}
                                className="shrink-0 text-[#71717A]"
                              />
                              <span className="truncate">
                                {fornecedor.endereco}
                              </span>
                            </>
                          ) : (
                            <span className="text-[#52525B]">
                              Não informado
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(fornecedor)}
                            title="Editar fornecedor"
                            className="rounded-lg border border-white/[0.08] p-2 text-[#A1A1AA] transition hover:border-[#A9BFFF]/30 hover:bg-[#A9BFFF]/[0.08] hover:text-[#A9BFFF]"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setFornecedorExclusao(fornecedor)}
                            title="Excluir fornecedor"
                            className="rounded-lg border border-white/[0.08] p-2 text-[#A1A1AA] transition hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARDS MOBILE */}

            <div className="grid gap-3 p-4 md:hidden">
              {fornecedoresFiltrados.map((fornecedor) => (
                <div
                  key={fornecedor.id}
                  className="rounded-xl border border-white/[0.07] bg-[#101014]/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#A9BFFF]/15 bg-[#A9BFFF]/[0.08] text-[#A9BFFF]">
                        <Building2 size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#F4F4F5]">
                          {fornecedor.nome}
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          ID #{fornecedor.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(fornecedor)}
                        className="rounded-lg p-2 text-[#A1A1AA] hover:bg-[#A9BFFF]/10 hover:text-[#A9BFFF]"
                        title="Editar fornecedor"
                        aria-label="Editar fornecedor"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setFornecedorExclusao(fornecedor)}
                        className="rounded-lg p-2 text-[#A1A1AA] hover:bg-red-500/10 hover:text-red-400"
                        title="Excluir fornecedor"
                        aria-label="Excluir fornecedor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3">
                    <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                      <FileText size={14} className="shrink-0 text-[#71717A]" />
                      {fornecedor.cnpj
                        ? formatarCnpj(fornecedor.cnpj)
                        : "CNPJ não informado"}
                    </div>

                    {fornecedor.email && (
                      <div className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                        <Mail
                          size={14}
                          className="mt-0.5 shrink-0 text-[#71717A]"
                        />
                        <span className="break-all">{fornecedor.email}</span>
                      </div>
                    )}

                    {fornecedor.telefone && (
                      <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <Phone size={14} className="shrink-0 text-[#71717A]" />
                        {formatarTelefone(fornecedor.telefone)}
                      </div>
                    )}

                    {fornecedor.endereco && (
                      <div className="flex items-start gap-2 text-xs text-[#A1A1AA]">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#71717A]"
                        />
                        <span className="break-words">
                          {fornecedor.endereco}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* MODAIS */}

      <ModalFornecedor
        aberto={modalAberto}
        fornecedor={fornecedorEdicao}
        salvando={salvando}
        aoFechar={fecharModal}
        aoSalvar={salvarFornecedor}
      />

      <ModalExclusao
        fornecedor={fornecedorExclusao}
        excluindo={excluindo}
        aoFechar={() => {
          if (!excluindo) setFornecedorExclusao(null);
        }}
        aoConfirmar={confirmarExclusao}
      />
    </div>
  );
}
